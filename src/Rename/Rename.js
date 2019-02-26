import React, { useState } from "react";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Rename = props => {
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [time, setTime] = useState("");
  const [day, setDay] = useState("");

  const handleChange = e => {
    if (e.target.id === "title") setTitle(e.target.value);
    if (e.target.id === "speaker") setSpeaker(e.target.value);
    if (e.target.id === "time") setTime(e.target.value);
    if (e.target.id === "day") setDay(e.target.value);
  };

  const sendRename = newFileName => {
    ipcRenderer.send("renameFile", props.fileName, props.filePath, newFileName);
  };

  const handleFormSubmit = e => {
    // Probably best to call upload, then call rename.
    e.preventDefault();
    const newFileName = `${title} - ${speaker} - ${time} - ${day}`;

    if (props.uploadSucceeded === true) {
      console.log("can rename");
      sendRename(newFileName);
    } else {
      console.log("canoot rename");
      setTimeout(() => {
        if (props.uploadSucceeded === true) {
          console.log("can rename now");
          sendRename(newFileName);
        }
      }, 5000);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        Original Path:{" "}
        <input type="text" defaultValue={props.filePath} disabled />
        <br />
        Original Name:{" "}
        <input type="text" defaultValue={props.fileName} disabled />
        <hr />
        New Name:
        <br />
        <input
          type="text"
          onChange={handleChange}
          placeholder="Title"
          id="title"
        />
        <br />
        <input
          type="text"
          onChange={handleChange}
          placeholder="Speaker"
          id="speaker"
        />
        <br />
        <input
          type="text"
          onChange={handleChange}
          placeholder="Time"
          id="time"
        />
        <br />
        <input type="text" onChange={handleChange} placeholder="Day" id="day" />
        <br />
        <input type="submit" value="Rename" />
      </form>
    </>
  );
};

export default Rename;
