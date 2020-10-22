import React, { useState } from "react";
import { Input, Modal, Select, Form } from "antd";
import OtherInfo from "./OtherInfo";

function C() {
  return <input type="text" />;
}

function App() {
  const [w, setW] = useState("w");
  console.log(w);
  return (
    <div>
      <Modal visible={true} width={1340}>
        <button
          onClick={() => {
            setW("setW");
          }}
        ></button>
        <Form>
          <Form.Item name="a" initialValue={w}>
            <Input onClick={() => {}}></Input>
          </Form.Item>
        </Form>
        <div id="m-modal">
          <OtherInfo></OtherInfo>
        </div>
      </Modal>
    </div>
  );
}

export default App;
