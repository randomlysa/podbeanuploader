import React, { Component } from "react";

import Home from "./Home/Home";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class App extends Component {
  state = {
    haveToken: false
  };

  componentDidMount() {
    ipcRenderer.on("tokenReceived", (event, token) => {
      this.setState({ haveToken: !!token });
    });
  }

  render() {
    return <Home isLoggedIn={this.state.haveToken} />;
  }
}

export default App;
