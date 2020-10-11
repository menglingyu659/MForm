import React from "react";
import { Modal } from "antd";
import OtherInfo from "./OtherInfo";

function App() {
  return (
    <div>
      <Modal visible={true} width={1340}>
        <div id="m-modal">
          <OtherInfo></OtherInfo>
        </div>
      </Modal>
    </div>
  );
}

export default App;
