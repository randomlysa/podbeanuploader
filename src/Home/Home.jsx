import React, { useState } from "react";

import Upload from "../Upload/Upload";
import UppyUpload from "../Upload/UppyUpload";
import Rename from "../Rename/Rename";

const Home = () => {
  // Don't rename file until this is true.
  const [uploadSucceeded, setUploadSucceeded] = useState(false);

  // Need the media key to publish.
  const [mediaKey, setMediaKey] = useState("");

  const [showRename, setShowRename] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");

  // Have - Logout - Settings - Upload
  return (
    <div>
      Home
      <br />
      <UppyUpload
        setShowRename={setShowRename}
        setFileName={setFileName}
        setFilePath={setFilePath}
        setUploadSucceeded={setUploadSucceeded}
        setMediaKey={setMediaKey}
      />
      {showRename && (
        <Rename
          fileName={fileName}
          filePath={filePath}
          mediaKey={mediaKey}
          uploadSucceeded={uploadSucceeded}
        />
      )}
    </div>
  );
};

export default Home;
