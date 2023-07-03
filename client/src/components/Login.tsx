import { Button, Callout, FormGroup, InputGroup } from "@blueprintjs/core"
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"

import { serverUrl } from "../configs/accessCodeServer";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [password, setPassword] = useState("")
  const [ userContext, setUserContext ] = useContext(UserContext)

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong, try again later.";

    axios.post(new URL("users/login", serverUrl).toString(),
    {
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
            placeholder="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Password" labelFor="password">
          <InputGroup
            id="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button
          intent="primary"
          disabled={isSubmitting}
          text={`${isSubmitting ? "Signing In" : "Sign In"}`}
          fill
          type="submit"
        />
      </form>
    </>
  )
}

export default Login
