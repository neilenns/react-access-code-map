import { TextField, Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

import { serverUrl } from "../configs/accessCodeServer";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [userContext, setUserContext] = useContext(UserContext);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong, try again later.";

    axios
      .post(
        new URL("users/login", serverUrl).toString(),
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (response) => {
        // Any hack for now
        setUserContext((oldValues: any) => {
          return { ...oldValues, token: response.data.token };
        });
        console.log(userContext);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError("Fill all the fields in correctly.");
        } else if (error.response.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(genericErrorMessage);
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      <form className="auth-form" onSubmit={formSubmitHandler}>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          fullWidth
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
        <TextField
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Button
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          fullWidth
          type="submit"
        >
          {isSubmitting ? "Signing In" : "Sign In"}
        </Button>
      </form>
    </>
  );
};

export default Login;
