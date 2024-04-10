import React, { useState } from "react";
import "@vscode/webview-ui-toolkit";

export default function (props) {
  const [isDisabled, setIsDisabled] = useState < boolean > false;

  // Toggles the visibility of button
  const toggleButton = () => {
    setIsDisabled(!isVisible);
  };

  return (
    <div>
      <vscode-button
        aria-label="code-origins-viewer"
        appearance="secondary"
        disabled={isDisabled ? "true" : "false"}
        onClick={toggleButton}
        style={{width: '200px', height: '50px'}}
      >Show Origins</vscode-button>
    </div>
  );
}
