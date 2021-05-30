import React from "react";
import './App.css';
import Sidebar from './Sidebar';
import Chat from "./Chat";
import { Route, BrowserRouter as Router , Switch } from 'react-router-dom';
import Login from "./Login";
import { useStateValue } from './StateProvider';

function App() {

  const [{ user },dispatch] = useStateValue();
  const uid =
    localStorage.getItem("uid") !== undefined
      ? localStorage.getItem("uid")
      : null;


  return (
    <div className="app">
    {!user && !uid  ?(
        <Login/>
    ):
    (
      <div className="app_body">
      <Router>
              <Sidebar/>
              <Switch>
                <Route path="/rooms/:roomId">
                  <Chat/>
                </Route>
                <Route path="/">
                  <Chat/>
                </Route>              
              </Switch>            
            </Router>
      </div>
    )}
      
    <h6 style={{color:"gray"}}>Made by Ankit Dutta</h6>
    </div>
  );
}

export default App;
