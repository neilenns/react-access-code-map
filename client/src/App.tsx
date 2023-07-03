import './App.css';
import { Card, Elevation, Tab, TabId, Tabs } from "@blueprintjs/core"
// import AccessCodeMap from "./components/AccessCodeMap";
import { useContext, useState } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import { UserContext } from './context/UserContext';
import AccessCodeMap from './components/AccessCodeMap';

function App() {
  const [currentTab, setCurrentTab] = useState<TabId>("login")
  const [userContext, setUserContext] = useContext(UserContext)

  function handleTabChange(navbarTabId: TabId) {
    setCurrentTab(navbarTabId);
  }

  return !userContext.token ?
  (
    <Card elevation={Elevation.TWO}>
      <Tabs id="Tabs" onChange={handleTabChange} selectedTabId={currentTab}>
        <Tab id="login" title="Login" panel={<Login />} />
        <Tab id="register" title="Register" panel={<Register />} />
        <Tabs.Expander />
      </Tabs>
    </Card>
  ) :
  <div className="App">
    <AccessCodeMap/>
  </div>
 ;
}

export default App;
