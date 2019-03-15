import React, { Component } from "react";

import Home from "./Home/Home";

let electron = "";
let ipcRenderer = "";
if (process.env.NODE_ENV === "test") {
  electron = require("electron");
  ipcRenderer = electron.ipcRenderer;
} else {
  electron = window.require("electron");
  ipcRenderer = electron.ipcRenderer;
}

class App extends Component {
  state = {
    haveToken: null,
    loading: true
  };

  componentDidMount() {
    // When the app runs, token.is_valid is checked and sent here.
    ipcRenderer.on("tokenReceived", (event, tokenIsValid) => {
      this.setState({ haveToken: tokenIsValid, loading: false });
    });
  }

  render() {
    return (
      <Home isLoggedIn={this.state.haveToken} loading={this.state.loading} />
    );
  }
}

export default App;
