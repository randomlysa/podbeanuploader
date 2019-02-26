import React, { useState } from "react";

import Upload from "../Upload/Upload";
import Rename from "../Rename/Rename";

const Home = () => {
  const [showRename, setShowRename] = useState(false);

  // Have - Logout - Settings - Upload
  return (
    <div>
      Home
      <br />
      <Upload setShowRename={setShowRename} />
      {showRename && <Rename />}
    </div>
  );
};

export default Home;
