import { TextField, Button } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

import { serverUrl } from "../configs/accessCodeServer";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [, setUserContext] = useContext(UserContext);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong, try again later.";

    axios
      .post(
        new URL("users/login", serverUrl).toString(),
        {
          username: email,
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
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError("Fill all the fields in correctly.");
        } else if (error.response.status === 401) {
          setError("Invalid email or password.");
        } else if (error.response.status === 402) {
          setError("Your account is not approved yet.");
        } else {
          setError(genericErrorMessage);
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <form className="auth-form" onSubmit={formSubmitHandler}>
        <TextField
          label="Email"
          required={true}
          variant="outlined"
          type="email"
          margin="normal"
          fullWidth
          value={email}
          error={error !== ""}
          helperText={error}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <TextField
          label="Password"
          required={true}
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
