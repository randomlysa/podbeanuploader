import React, { useState } from "react";

import Upload from "../Upload/Upload";
import Rename from "../Rename/Rename";

const Home = () => {
  const [showRename, setShowRename] = useState(true);
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
      />
      {showRename && <Rename fileName={fileName} filePath={filePath} />}
    </div>
  );
};

export default Home;
