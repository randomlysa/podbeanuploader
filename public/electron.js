const { app, ipcMain, BrowserWindow, webContents } = require("electron");
const axios = require("axios");
const fs = require("fs");

// const path = require("path");
// const url = require("url");
const jsonConfig = require("electron-json-config");

const myConfig = require("../src/config");

let mainWindow, authWindow;

// Functions to create windows - main, auth.
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  mainWindow.loadURL(
    // Commented out the below code so I could have console.log
    "http://localhost:3000"
    // process.env.ELECTRON_START_URL ||
    //   url.format({
    //     pathname: path.join(__dirname, "/../build/index.html"),
    //     protocol: "file:",
    //     slashes: true
    //   })
  );

  mainWindow.webContents.on("did-finish-load", () => {
    const accessToken = jsonConfig.get("pbAccessToken");
    mainWindow.webContents.send("tokenReceived", accessToken);
  });

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
      authWindow.webContents
        .executeJavaScript(
          `
        require('electron').ipcRenderer.send('tokenReceived', document.body.innerHTML);
      `
        )
        .then(() => {
      // Close window so data/token isn't seen. Guess it could be recorded using a screen grabber?
        authWindow.destroy();
        });
    }
  });
});

ipcMain.on("tokenReceived", (_, tokenReceived) => {
  const success = JSON.parse(tokenReceived);
  jsonConfig.set("pbAccessToken", success.access_token);
  jsonConfig.set("pbRefreshToken", success.refresh_token);

  mainWindow.webContents.send("tokenReceived", success.access_token);
});

ipcMain.on("authorizeUploadFile", (event, file) => {
  const { filename, filesize } = file;
  if (file) {
    axios({
      method: "get",
      url: "https://api.podbean.com/v1/files/uploadAuthorize",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      params: {
        access_token: jsonConfig.get("pbAccessToken"),
        filename,
        filesize,
        content_type: "audio/mpeg"
      }
    }).then(d => {
      let data = {
        presigned_url: d.data.presigned_url,
        media_key: d.data.file_key
      };

      mainWindow.send("gotTheKey", data);
    });
  } // if(file)
});

ipcMain.on("publishEpisode", (event, media_key) => {
  // Haven't tested yet (reached API pubish limit) but this exact
  // code with only a ID added after /episodes/ worked for updating
  // an episode.

  // url for updating:
  // url: "https://api.podbean.com/v1/episodes/TBGQ6A90E06",
  const template = `access_token=${jsonConfig.get(
    "pbAccessToken"
  )}&title='Title_Needs_To_Be_5_Chars'&status=publish&type=public`;

  axios({
    url: "https://api.podbean.com/v1/episodes/",
    method: "POST",
    data: template,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(d => console.warn("SUCCESS : ", d))
    .catch(err => console.log("FAIL : ", err));
});

ipcMain.on("renameFile", (event, fileName, filePath, newFileName) => {
  const oldFile = `${filePath}/${fileName}`;
  const newFile = `${filePath}/${newFileName}.mp3`;
  fs.rename(oldFile, newFile, function errorOnRename(err) {
    if (err) {
      mainWindow.send("renameFileFail", err);
    }
    mainWindow.send("renameFileSuccess");
  });
});
