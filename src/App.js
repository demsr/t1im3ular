import { useEffect, useState } from "react";
import { useTimeular } from "./context/TimeularContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import IndexPage from "./pages/index";
import NavBar from "./components/navbar";
import "./App.css";

function App() {
  const { state: timeState } = useTimeular();
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: timeState.connected ? "#238636" : "#b62324",
        }}
      >
        <NavBar />
        <div
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Switch>
            <Route path="/">
              <IndexPage />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
