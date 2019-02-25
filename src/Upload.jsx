import React from "react";
import Dropzone from "react-dropzone";
import styled from "@emotion/styled";

const getColor = props => {
  if (props.isDragReject) {
    return "#c66";
  }
  if (props.isDragActive) {
    return "#6c6";
  }
  return "#666";
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
