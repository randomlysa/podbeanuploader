import React from "react";

import { render, getByText, cleanup } from "react-testing-library";

import Home from "./Home";

afterEach(cleanup);

it("Shows login button when not logged in", () => {
  const { getByText } = render(<Home />);
  // Another login button test.
  getByText("Welcome, please login!");
  getByText("Login");
});

it("Shows loading text while waiting for token", () => {
  const { getByText } = render(<Home isLoggedIn={false} loading={true} />);
  getByText("Loading...");
});

it("Shows logout button, upload drop zone when logged in", () => {
  const { getByText } = render(<Home isLoggedIn={true} loading={false} />);
  getByText("Drop here or");
  getByText("Logout");
});
