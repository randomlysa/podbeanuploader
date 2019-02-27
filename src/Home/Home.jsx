import React, { useState } from "react";

import Login from "../Login/Login";
import UppyUpload from "../Upload/UppyUpload";
import Rename from "../Rename/Rename";

const Home = props => {
  // Don't rename file until this is true.
  const [uploadSucceeded, setUploadSucceeded] = useState(false);

  // Need the media key to publish.
  const [mediaKey, setMediaKey] = useState("");

  const [showRename, setShowRename] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [status, setStatus] = useState("Add a file!");

  // Have - Logout - Settings - Upload
  if (props.isLoggedIn) {
    return (
      <div>
        <Login isLoggedIn={props.isLoggedIn} />
        <h1>Status: {status}</h1>
        <UppyUpload
          setShowRename={setShowRename}
          setFileName={setFileName}
          setFilePath={setFilePath}
          setUploadSucceeded={setUploadSucceeded}
          setMediaKey={setMediaKey}
          setStatus={setStatus}
        />

        {showRename && (
          <Rename
            fileName={fileName}
            filePath={filePath}
            mediaKey={mediaKey}
            uploadSucceeded={uploadSucceeded}
            setStatus={setStatus}
          />
        )}
      </div>
    );
  } else {
    return <Login isLoggedIn={props.isLoggedIn} />;
  }
};

export default Home;
