import React from "react";
import styled from "@emotion/styled";

const Welcome = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
`;

const Button = styled.button`
  background: #8fc31f;
  border: none;
  font-size: 20pt;
  cursor: pointer;
  transition: all 0.3s;
  padding: 5px 15px;
  color: #fff;
  font-family: "open sans";
  border-radius: 4px;

  :hover {
    background: #729c18;
  }
`;

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Login = props => {
  const doLogin = () => {
    ipcRenderer.send("podbeanOAuth");
  };

  const doLogout = () => ipcRenderer.send("doLogout");

  const loginButton = (
    <Welcome>
      <h1>Welcome, please login!</h1>
      <Button id="loginButton" onClick={doLogin}>
        Login
      </Button>
    </Welcome>
  );

  const logoutButton = (
    <Button id="logoutButton" onClick={doLogout}>
      Logout
    </Button>
  );

  if (props.isLoggedIn) {
    return logoutButton;
  } else {
    return loginButton;
  }
};

export default Login;
