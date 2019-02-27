import React from "react";
import * as config from "../config.js";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Login = props => {
  const doLogin = () => {
    ipcRenderer.send("podbeanOAuth");
  };

  const doLogout = () => ipcRenderer.send("doLogout");

  const loginButton = (
    <button id="loginButton" onClick={doLogin}>
      Login
    </button>
  );

  const logoutButton = (
    <button id="logoutButton" onClick={doLogout}>
      Logout
    </button>
  );

  if (props.isLoggedIn) {
    return logoutButton;
  } else {
    return loginButton;
  }
};

export default Login;
