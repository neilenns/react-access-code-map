import "./App.css";
import { Card, Tabs, Tab, Box, Container } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { UserContext } from "./context/UserContext";
import AccessCodeMap from "./components/AccessCodeMap";

import { serverUrl } from "./configs/accessCodeServer";
import axios from "axios";
import Loader from "./components/Loader";

function App() {
  const [currentTab, setCurrentTab] = useState<string>("login");
  const [userContext, setUserContext] = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const verifyUser = useCallback(() => {
    axios
      .post(
        new URL("users/refreshToken", serverUrl).toString(),
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${userContext.token}`,
          },
        }
      )
      .then(async (response) => {
        setUserContext((oldValues) => {
          return { ...oldValues, token: response.data.token };
        });
        setTimeout(verifyUser, 5 * 60 * 1000);
      })
      .catch((_err) => {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null };
        });
      })
      .finally(() => setLoading(false));
    // ESLint really really really wants userContext.token here, but that
    // causes the page to reload every time the user token is updated.
    // It's completely unnecessary because none of the components use the
    // token directly, they all use the context. So disable the eslint
    // warning for just this line.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUserContext]);

  const fetchUserDetails = useCallback(() => {
    setLoading(true);
    axios
      .get(new URL("users/me", serverUrl).toString(), {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      })
      .then(async (response) => {
        setUserContext((oldValues) => {
          return { ...oldValues, details: response.data };
        });
      })
      .catch((_err) => {
        setUserContext((oldValues) => {
          return { ...oldValues, details: null };
        });
      })
      .finally(() => setLoading(false));
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    // fetch only when user details are not present
    if (userContext.token && !userContext.details) {
      fetchUserDetails();
    }
  }, [userContext.details, userContext.token, fetchUserDetails]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  // Watch for changes to local storage for a logout key and if it's there that
  // means the site was logged out in a different tab. Refresh the page and log out!
  const syncLogout = useCallback((event: StorageEvent) => {
    if (event.key === "logout") {
      // If using react-router-dom, you may call history.push("/")
      window.location.reload();
    }
  }, []);

  // Register for events on local storage to watch for cross-tab logout.
  useEffect(() => {
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [syncLogout]);

  // This is passed to the AccessCodeMap component to handle when the logout button
  // on the map is clicked.
  const logoutHandler = () => {
    axios
      .get(new URL("users/logout", serverUrl).toString(), {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      })
      .finally(() => {
        setUserContext((_oldValues) => {
          return { token: null, userDetails: null };
        });
        window.localStorage.setItem("logout", Date.now().toString());
      });
  };

  function handleTabChange(_event: React.ChangeEvent<{}>, newValue: string) {
    setCurrentTab(newValue);
  }

  if (loading) {
    return <Loader />;
  }

  if (userContext.token === null) {
    return (
      <div className="loginPage">
        <Container maxWidth="xs">
          <Card>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Login" value="login" />
              <Tab label="Register" value="register" />
            </Tabs>
            <Box p={3}>
              {currentTab === "login" && <Login />}
              {currentTab === "register" && <Register />}
            </Box>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="App">
      <AccessCodeMap onSignOutClick={logoutHandler} />
    </div>
  );
}

export default App;
