import React from "react";
import * as config from "./config.js";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class Login extends React.Component {
  handleClick = () => {
    ipcRenderer.send("podbeanOAuth");
  };

  render() {
    return (
      <button id="loginButton" onClick={this.handleClick}>
        Login
      </button>
    );
  }
}

export default Login;
