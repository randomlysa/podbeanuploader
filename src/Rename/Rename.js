import React, { useState } from "react";
import moment from "moment";
import styled from "@emotion/styled";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const StyledInput = styled.input`
  width: 99%;
  margin: 5px 0;
  font-size: 16pt;
  border-radius: 3px;
  border: solid 1px #ddd;

  :focus {
    background: rgba(83, 183, 236, 0.4);
  }
`;

const StyledSubmit = styled.input`
  border: none;
  font-size: 25pt;
  padding: 2px 5px;
  cursor: pointer;
  transition: all 0.3s;
`;

const Rename = props => {
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  // Todo - get time from filename.
  // Set defaults for time, date
  const timeHM = moment().format("Hm");
  let morningEvening = " Morning";
  if (timeHM > 1315) morningEvening = " Evening";

  // Time = "Sunday Morning", "Monday Evening"
  // Date = MM-DD-YYYY
  const defaultTime = moment().format("dddd") + morningEvening;
  const defaultDate = moment().format("MM-DD-YYYY");

  if (!time) setTime(defaultTime);
  if (!date) setDate(defaultDate);

  const handleChange = e => {
    if (e.target.id === "title") setTitle(e.target.value);
    if (e.target.id === "speaker") setSpeaker(e.target.value);
    if (e.target.id === "time") setTime(e.target.value);
    if (e.target.id === "day") setDate(e.target.value);
  };

  const doRenameAndPublish = newFileName => {
    ipcRenderer.send("renameFile", props.fileName, props.filePath, newFileName);
    ipcRenderer.send("publishEpisode", props.mediaKey, newFileName);

    ipcRenderer.on("renameFileSuccess", () => {
      props.setStatus("Rename Successful!");
    });
    ipcRenderer.on("renameFileFail", () => {
      props.setStatus("Rename Failed!");
    });

    ipcRenderer.on("publishSuccess", () => {
      props.setStatus("Rename and publish succeeded. All done!");
    });

    ipcRenderer.on("publishFail", (_, err) => {
      console.warn(err);
      props.setStatus(`Publish failed... ${err}`);
    });
  };

  const handleFormSubmit = e => {
    // Probably best to call upload, then call rename.
    e.preventDefault();
    const newFileName = `${title} - ${speaker} - ${time} - ${date}`;

    if (props.uploadSucceeded === true) {
      console.log("can rename");
      doRenameAndPublish(newFileName);
    } else {
      console.log("waiting to rename");
      setTimeout(() => {
        if (props.uploadSucceeded === true) {
          console.log("can rename now");
          doRenameAndPublish(newFileName);
        }
      }, 5000);
    }
  };

  const renameButtonText = () => {
    // this.props.uploadSucceeded
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        Original Path:{" "}
        <StyledInput type="text" defaultValue={props.filePath} disabled />
        <br />
        Original Name:{" "}
        <StyledInput type="text" defaultValue={props.fileName} disabled />
        <hr />
        New Name:
        <br />
        <StyledInput
          type="text"
          onChange={handleChange}
          placeholder="Title"
          id="title"
        />
        <br />
        <StyledInput
          type="text"
          onChange={handleChange}
          placeholder="Speaker"
          id="speaker"
        />
        <br />
        <StyledInput
          type="text"
          onChange={handleChange}
          placeholder="Time"
          value={defaultTime}
          id="time"
        />
        <br />
        <StyledInput
          type="text"
          onChange={handleChange}
          placeholder="Date"
          value={defaultDate}
          id="date"
        />
        <br />
        <StyledSubmit type="submit" value="Rename & Publish!" />
      </form>
    </>
  );
};

export default Rename;
