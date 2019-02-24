import React from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";

class Upload extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log("beep");
    console.log(acceptedFiles, rejectedFiles);
  };

  componentDidMount() {
    console.log("beep2");
  }

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div
              {...getRootProps()}
              className={classNames("dropzone", {
                "dropzone--isActive": isDragActive
              })}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop files here...</p>
              ) : (
                <p>
                  Try dropping some files here
                  <br />
                  <br />, or click to select files to upload.
                </p>
              )}
            </div>
          );
        }}
      </Dropzone>
    );
  }
}

export default Upload;
