import React, { useState } from "react";

import Upload from "../Upload/Upload";
import Rename from "../Rename/Rename";

const Home = () => {
  // Don't rename file until this is true.
  const [uploadSucceeded, setUploadSucceeded] = useState(false);

  const [showRename, setShowRename] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");

  // Have - Logout - Settings - Upload
  return (
    <div>
      Home
      <br />
      <Upload
        setShowRename={setShowRename}
        setFileName={setFileName}
        setFilePath={setFilePath}
        setUploadSucceeded={setUploadSucceeded}
      />
      {showRename && (
        <Rename
          fileName={fileName}
          filePath={filePath}
          uploadSucceeded={uploadSucceeded}
        />
      )}
    </div>
  );
};

export default Home;
