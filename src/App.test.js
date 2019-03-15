import React from "react";
import ReactDOM from "react-dom";
import { render, getByText } from "react-testing-library";

import App from "./App";

it("Shows a welcome and login button when loaded without a token", () => {
  const { getByText } = render(<App />);
  getByText("Welcome, please login!");
  getByText("Login");
});
