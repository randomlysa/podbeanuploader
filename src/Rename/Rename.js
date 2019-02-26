import React from "react";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Rename = props => {
  return (
    <>
      <form>
        Original Path: <input type="text" defaultValue={props.filePath} />
        <br />
        Original Name: <input type="text" defaultValue={props.fileName} />
        <br />
        New Name: <input type="text" placeholder="Title" />
        <br />
        <input type="text" placeholder="Title" />
        <br />
        <input type="text" placeholder="Speaker" />
        <br />
        <input type="text" placeholder="Time" />
        <br />
        <input type="text" placeholder="Day" />
        <br />
        <input type="submit" value="Rename" />
      </form>
    </>
  );
};

export default Rename;
