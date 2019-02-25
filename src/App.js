import React, { Component } from "react";

import Login from "./Login";
import Upload from "./Upload";
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
    return <Login />;
  }
}

export default App;
