import { Button, FormHelperText, TextField, Typography } from "@mui/material";

import React, { useState } from "react";
import { serverUrl } from "../configs/accessCodeServer";
import axios from "axios";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong, try again later.";

    axios
      .post(
        new URL("users/signup", serverUrl).toString(),
        {
          firstName,
          lastName,
          username: email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (response) => {
        setRegisterSuccess(true);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setError(error.response.data.message);
        } else {
          setError(genericErrorMessage);
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      {registerSuccess && (
        <Typography color="success">
          Registration successful! You'll be notified once your registration is
          approved.
        </Typography>
      )}
      {!registerSuccess && (
        <form onSubmit={formSubmitHandler}>
          <FormHelperText error={error !== ""}>{error}</FormHelperText>
          <TextField
            label="First Name"
            variant="outlined"
            required={true}
            margin="normal"
            fullWidth
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
          <TextField
            label="Last Name"
            variant="outlined"
            required={true}
            margin="normal"
            fullWidth
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
          />
          <TextField
            label="Email"
            variant="outlined"
            required={true}
            type="email"
            margin="normal"
            fullWidth
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <TextField
            label="Password"
            variant="outlined"
            required={true}
            margin="normal"
            fullWidth
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <Button
            type="submit"
            color="primary"
            disabled={isSubmitting}
            variant="contained"
          >
            {isSubmitting ? "Registering" : "Register"}
          </Button>
        </form>
      )}
    </>
  );
};

export default Register;
