import React from "react";
import { Select } from "antd";
import { validatorKey } from "./utils";

const { Option } = Select;
function createOption(opt, comIndex) {
  if (Object.prototype.toString.call(opt) !== "[object Object]") return null;
  const { id, label, value } = opt;
  return (
    <Option key={validatorKey(id, comIndex)} value={value}>
      {label}
    </Option>
  );
}

export { createOption };
