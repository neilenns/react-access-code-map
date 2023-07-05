import './App.css';
import { Card, Elevation, Tab, TabId, Tabs } from "@blueprintjs/core"
// import AccessCodeMap from "./components/AccessCodeMap";
import { useCallback, useContext, useEffect, useState } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import { UserContext } from './context/UserContext';
import AccessCodeMap from './components/AccessCodeMap';

import { serverUrl } from "./configs/accessCodeServer";
import axios from "axios";
import Loader from './components/Loader';

function App() {
  const [currentTab, setCurrentTab] = useState<TabId>("login")
  const [userContext, setUserContext] = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  const verifyUser = useCallback(() => {
    axios.post(new URL("users/refreshToken", serverUrl).toString(),
    {},
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${userContext.token}`
      }
    }).then(async response => {
        setUserContext(oldValues => {
          return { ...oldValues, token: response.data.token }});
      setTimeout(verifyUser, 5 * 60 * 1000)
    })
    .catch(err => {
      console.log(`Error: ${err}`);
      setUserContext(oldValues => {
        return { ...oldValues, token: null }
      })
    })
    .finally(() => setLoading(false));
  }, [setUserContext, userContext.token])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  // Watch for changes to local storage for a logout key and if it's there that
  // means the site was logged out in a different tab. Refresh the page and log out!
  const syncLogout = useCallback((event: StorageEvent) => {
    if (event.key === "logout") {
      // If using react-router-dom, you may call history.push("/")
      window.location.reload()
    }
  }, [])


  // Register for events on local storage to watch for cross-tab logout.
  useEffect(() => {
    window.addEventListener("storage", syncLogout)
    return () => {
      window.removeEventListener("storage", syncLogout)
    }
  }, [syncLogout])

  // This is passed to the AccessCodeMap component to handle when the logout button
  // on the map is clicked.
  const logoutHandler = () => {
    axios.get(new URL("users/logout", serverUrl).toString(),
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${userContext.token}`
      }
    }).finally(() => {
      setUserContext(oldValues => {
        return { ...oldValues, token: null }
      })
      window.localStorage.setItem("logout", Date.now().toString())
    });
  }

  function handleTabChange(navbarTabId: TabId) {
    setCurrentTab(navbarTabId);
  }

  if (loading) {
    return <Loader />;
  }

  if (userContext.token === null)
  {
    return (
      <div className="loginPage">
        <Card elevation={Elevation.TWO} style={{width: '20rem'}}>
          <Tabs id="Tabs" onChange={handleTabChange} selectedTabId={currentTab}>
            <Tab id="login" title="Login" panel={<Login />} />
            <Tab id="register" title="Register" panel={<Register />} />
            <Tabs.Expander />
          </Tabs>
        </Card>
        </div>
      );  
  }

  return (
    <div className="App">
      <AccessCodeMap onSignOutClick={logoutHandler}/>
    </div>
  );
}

export default App;
