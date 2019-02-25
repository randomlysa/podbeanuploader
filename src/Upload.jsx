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

};

const Container = styled.div`
  box-sizing: border-box;
  display: flex;

  justify-content: center;
  align-items: center;

  width: 100%;
  height: 300px;
  border-width: 2px;
  border-radius: 5px;
  border-color: ${props => getColor(props)};
  border-style: ${props =>
    props.isDragReject || props.isDragActive ? "solid" : "dashed"};
  background-color: ${props => (props.isDragReject ? "#de4545" : "#eee")};
`;

class Upload extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles, rejectedFiles);
  };

  render() {
    return (
      <>
        <Dropzone accept="audio/mp3" onDrop={this.onDrop}>
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
            acceptedFiles
          }) => {
            return (
              <Container
                isDragActive={isDragActive}
                isDragReject={isDragReject}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragAccept ? "Drop" : "Drag"} files here...
              </Container>
            );
          }}
        </Dropzone>
      </>
    );
  }
}

export default Upload;
