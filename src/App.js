import React, { Component } from "react";

import Login from "./Login";
import Home from "./Home";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class App extends Component {
  state = {
    haveToken: false
  };

  componentDidMount() {
    ipcRenderer.on("tokenReceived", (event, token) => {
      this.setState({ haveToken: true });
    });
  }

  render() {
    if (this.state.haveToken) {
      return <Home />;
    } else {
      return <Login />;
    }
  }
}

export default App;
