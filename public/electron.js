const { app, ipcMain, BrowserWindow, webContents } = require("electron");
const contextMenu = require("electron-context-menu");

const axios = require("axios");
const fs = require("fs");

// const path = require("path");
// const url = require("url");
const jsonConfig = require("electron-json-config");

const myConfig = require("../src/config");

let mainWindow, authWindow;

contextMenu({
  prepend: (params, browserWindow) => [
    {
      label: "Rainbow",
      // Only show it when right-clicking images
      visible: params.mediaType === "image"
    }
  ]
});

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

  authWindow.webContents.on("did-navigate", function(event, url) {
      // https://stackoverflow.com/a/35022140/3996097
    authWindow.webContents.executeJavaScript(
          `
        require('electron').ipcRenderer.send('authHTMLReceived', document.body.innerHTML);
      `
    );
        });
  });

// Finalize login if token received.
ipcMain.on("authHTMLReceived", (_, authHTMLReceived) => {
  if (
    authHTMLReceived.includes("access_token") &&
    authHTMLReceived.includes("refresh_token")
  ) {
    authWindow.destroy();
    const success = JSON.parse(authHTMLReceived);
  jsonConfig.set("pbAccessToken", success.access_token);
  jsonConfig.set("pbRefreshToken", success.refresh_token);

  mainWindow.webContents.send("tokenReceived", success.access_token);
  }
});

// Logout
ipcMain.on("doLogout", () => {
  jsonConfig.set("pbAccessToken", "");
  jsonConfig.set("pbRefreshToken", "");
  mainWindow.webContents.send("tokenReceived", null);
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
    })
      .then(d => {
      let data = {
        filename: filename,
        presigned_url: d.data.presigned_url,
        media_key: d.data.file_key
      };

      mainWindow.send("gotTheKey", data);
      })
      .catch(err => {
        console.log("Error on authorization attempt: ", err);
    });
  } // if(file)
});

ipcMain.on("publishEpisode", (event, media_key, filename) => {
  // Publish fails can take a long time before the API replies. Show a message
  // that publish has started.
  mainWindow.send("publishStart");
  // Haven't tested yet (reached API pubish limit) but this exact
  // code with only a ID added after /episodes/ worked for updating
  // an episode.

  // url for updating:
  // url: "https://api.podbean.com/v1/episodes/TBGQ6A90E06",

  let title = filename;
  // Remove .mp3 from filename.
  if (title.includes(".mp3")) {
    title = filename
      .split("")
      .slice(0, -4)
      .join("");
  }

  const template = `access_token=${jsonConfig.get(
    "pbAccessToken"
  )}&title=${title}&status=publish&type=public&media_key=${media_key}`;

  axios({
    url: "https://api.podbean.com/v1/episodes/",
    method: "POST",
    data: template,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(d => {
      console.log("SUCCESS : ???");
      let responseData = d.data;
      if (responseData.includes(" : ")) {
        responseData = d.data.split(" : ");
      }
      if (
        responseData[1].includes("error") &&
        responseData[1].includes("error_description")
      ) {
        const { error, error_description } = JSON.parse(responseData[1]);
        console.log(error);
        console.log(error_description);
        mainWindow.send("publishFail", error_description);
      } else {
        // Maybe we succeeded?
        mainWindow.send("publishSuccess", d);
        console.log(d);
      }

      console.log(template);
    })
    .catch(err => {
      // This works for 'Exceeds max 3 posts per days limit.' (Although I'm pretty sure
      // it's 1 post per day for a free account.)
      console.log("FAIL : ", err.response.data);
      mainWindow.send("publishFail", err.response.data.error_description);
    });
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
