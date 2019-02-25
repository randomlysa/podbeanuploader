const { app, ipcMain, BrowserWindow, webContents } = require("electron");

// const path = require("path");
// const url = require("url");
const jsonConfig = require("electron-json-config");

const myConfig = require("../src/config");

let mainWindow, authWindow;

// Functions to create windows - main, auth.
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  const accessToken = jsonConfig.get("pbAccessToken");

  mainWindow.loadURL(
    // Commendted out the below code so I could have console.log
    "http://localhost:3000"
    // process.env.ELECTRON_START_URL ||
    //   url.format({
    //     pathname: path.join(__dirname, "/../build/index.html"),
    //     protocol: "file:",
    //     slashes: true
    //   })
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createAuthWindow() {
  // https://www.manos.im/blog/electron-oauth-with-github/
  // Build the OAuth consent page URL
  authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    "node-integration": false,
    parent: mainWindow
  });

  var pbUrl = "https://api.podbean.com/v1/dialog/oauth?";
  var authUrl = `${pbUrl}client_id=${
    myConfig.clientId
  }&scope=episode_publish&response_type=code&redirect_uri=${
    myConfig.redirectForDev
  }`;
  authWindow.loadURL(authUrl);
  authWindow.show();
}

// app.on
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ipcMain.on
ipcMain.on("podbeanOAuth", () => {
  createAuthWindow();

  let didNav = 0;
  authWindow.webContents.on("did-navigate", function(event, url) {
    didNav++;
    if (didNav === 2) {
      // https://stackoverflow.com/a/35022140/3996097
      authWindow.webContents.executeJavaScript(`
        require('electron').ipcRenderer.send('tokenReceived', document.body.innerHTML);
      `);
      // Close window so data/token isn't seen. Guess it could be recorded using a screen grabber?
      setTimeout(() => {
        authWindow.destroy();
      }, 50);
    }
  });
});

ipcMain.on("tokenReceived", (_, tokenReceived) => {
  const success = JSON.parse(tokenReceived);
  console.log(success);
  console.log(success.access_token);

  jsonConfig.set("pbAccessToken", success.access_token);
});
