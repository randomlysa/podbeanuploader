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

  const handleFormSubmit = e => {
    e.preventDefault();
    const newFileName = `${title} - ${speaker} - ${time} - ${day}`;
    ipcRenderer.send("renameFile", props.fileName, props.filePath, newFileName);
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
