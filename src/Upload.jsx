import React from "react";
import XHRUpload from "@uppy/xhr-upload";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Uppy = require("@uppy/core");
const { DragDrop } = require("@uppy/react");

// Upload process:
// Drop file into Uppy dropzone
// .send("authorizeUploadFile"): Uppy sends filename, filesize to Node/Electron.
// Node/Electron authorizes a file upload using filename, filesize.
// .send("gotTheKey"): Node sends back a presigned_url and media_key
// Uppy uploads the file to the presigned_url
// .send("publishEpisode"): Uppy sends media_key to node.
// NOTE - stopping here as I can't test this as I've reached up upload limit for the day.
// Node posts to https://api.podbean.com/v1/episodes with the info needed to publish.

const uppy = Uppy({
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: [".mp3"]
  }
});

uppy.on("file-added", file => {
  const dataForElectron = {
    filesize: file.size,
    filename: file.name
  };

  // Todo: not sure if this is the best place to do this...
  // assuming people drop in the right file most of the time?
  ipcRenderer.send("authorizeUploadFile", dataForElectron);

  // Todo: is this needed?
  uppy.setFileMeta(file.id, {
    filename: file.name,
    filesize: file.size,
    content_type: "audio/mpeg"
  });
});

ipcRenderer.on("gotTheKey", (event, data) => {
  uppy.use(XHRUpload, {
    method: "put",
    endpoint: data.presigned_url
  });

  uppy.upload().then(result => {
    console.info("Successful uploads:", result.successful);

    // upload successful, need to post some data to publish it.
    ipcRenderer.send("publishEpisode", data.media_key);

    if (result.failed.length > 0) {
      console.error("Errors:");
      result.failed.forEach(file => {
        console.error(file.error);
      });
    }
  });
});

uppy.on("upload-success", (file, body) => {
  console.log("success, ", file, body);
});

class Upload extends React.Component {
  state = {
    acceptedFiles: []
  };

  render() {
    return (
      <DragDrop
        uppy={uppy}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropHereOr: "Drop here or %{browse}",
            // Used as the label for the link that opens the system file selection dialog.
            browse: "browse"
          }
        }}
      />
    );
  }
}

export default Upload;
