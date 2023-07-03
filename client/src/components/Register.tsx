import { Button, Callout, FormGroup, InputGroup } from "@blueprintjs/core"
import React, { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { serverUrl } from "../configs/accessCodeServer";
import axios from "axios";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userContext, setUserContext] = useContext(UserContext)

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong, try again later.";

    axios.post(new URL("users/signup", serverUrl).toString(),
    {
      firstName,
      lastName,
      username,
      password  
    },
    {
      withCredentials: true
    })
    .then(async response => {
      setIsSubmitting(false);
      if (response.status === 400)
      {
        setError("Fill all the fields in correctly.");
      }
      else if (response.status === 401)
      {
        setError("Invalid email or password.");
      }
      else if (response.status !== 200)
      {
        setError(genericErrorMessage);
      }
      else
      {
        // Any hack for now
        setUserContext((oldValues: any) => {
          return { ...oldValues, token: response.data.token }
        })
        console.log(userContext);
      }
    })
    .catch(error => {
      setIsSubmitting(false);
      setError(genericErrorMessage);
    })
  }

  return (
    <>
      {error && <Callout intent="danger">{error}</Callout>}
      <form className="auth-form" onSubmit={formSubmitHandler}>
      <FormGroup label="Username" labelFor="username">
          <InputGroup
            id="username"
            placeholder="username"
            type="username"
            onChange={e => setUsername(e.target.value)}
            value={username}
          />
        </FormGroup>
        <FormGroup label="First Name" labelFor="firstName">
          <InputGroup
            id="firstName"
            placeholder="First Name"
            onChange={e => setFirstName(e.target.value)}
            value={firstName}
          />
        </FormGroup>
        <FormGroup label="Last Name" labelFor="firstName">
          <InputGroup
            id="lastName"
            placeholder="Last Name"
            onChange={e => setLastName(e.target.value)}
            value={lastName}
          />
        </FormGroup>
        <FormGroup label="Password" labelFor="password">
          <InputGroup
            id="password"
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </FormGroup>
        <Button
          intent="primary"
          disabled={isSubmitting}
          text={`${isSubmitting ? "Registering" : "Register"}`}
          fill
          type="submit"
        />
      </form>
    </>
  )
}

export default Register
