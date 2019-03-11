import React, { Component } from "react";

import Home from "./Home/Home";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class App extends Component {
  state = {
    haveToken: false
  };

  componentDidMount() {
    // When the app runs, token.is_valid is checked and sent here.
    ipcRenderer.on("tokenReceived", (event, tokenIsValid) => {
      this.setState({ haveToken: tokenIsValid });
    });
  }

  render() {
    return <Home isLoggedIn={this.state.haveToken} />;
  }
}

export default App;
