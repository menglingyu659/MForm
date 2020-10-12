import React from "react";
import { Input, Modal, Select } from "antd";
import OtherInfo from "./OtherInfo";

function C() {
  return <input type="text" />;
}

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
