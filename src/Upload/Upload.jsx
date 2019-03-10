import React from "react";

// Somehow I didn't notice last night that Fine Uploader is dead.
// But I'm saving this anyway, just in case.
import FineUploaderTraditional from "fine-uploader-wrappers";
import Gallery from "react-fine-uploader";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

// Upload process:
// Drop file into Uppy dropzone
// .send("authorizeUploadFile"): Uppy sends filename, filesize to Node/Electron.
// Node/Electron authorizes a file upload using filename, filesize.
// .send("gotTheKey"): Node sends back a presigned_url and media_key
// Uppy uploads the file to the presigned_url
// .send("publishEpisode"): Uppy sends media_key to node.
// NOTE - stopping here as I can't test this as I've reached up upload limit for the day.
// Node posts to https://api.podbean.com/v1/episodes with the info needed to publish.

const uploader = new FineUploaderTraditional({
  options: {
    autoUpload: false,
    request: {
      method: "put",
      requireSuccessJson: false,
      customHeaders: {
        "Content-Type": "audio/mpeg"
      }
    }
  }
});

class Upload extends React.Component {
  componentDidMount() {
    // on.validate:
    // Called once for each selected, dropped, or addFiles submitted file.
    uploader.on("validate", id => {
      const dataForElectron = {
        filesize: id.size,
        filename: id.name
      };
      this.props.setShowRename(true);
      console.log(id);

      // Todo: have an option to start auto upload?
      // ipcRenderer.send("authorizeUploadFile", dataForElectron);
    });

    ipcRenderer.on("gotTheKey", (event, data) => {
      console.log(data);
      uploader.methods.setEndpoint(data.presigned_url);

      // Start uploading.
      uploader.methods.uploadStoredFiles();

      uploader.on("complete", () => {
        this.props.setUploadSucceeded(true);
        // This is when the rename needs to happen. This allows the upload to start
        // immediately, then once the file is on the server, rename the file locally
        // and send a publish with the new filename as the title.
        // I will assume that the file SHOULD be renamed, so don't .send this until
        // the file is renamed. Otherwise episodes will be called strange file names
        // and one of the main points of this is to rename and publish easily.
        console.log("setting media key", data.media_key);
        this.props.setMediaKey(data.media_key);
      });
    });
  }
  render() {
    return <Gallery uploader={uploader} />;
  }
}

export default Upload;
