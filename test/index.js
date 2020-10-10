import React from "react";
import { Modal } from "antd";
import OtherInfo from "./OtherInfo";

function App() {
  return (
    <div>
      <Modal visible={true} width={1340} className="m-modal">
        <OtherInfo></OtherInfo>
      </Modal>
    </div>
  );
}

export default App;
