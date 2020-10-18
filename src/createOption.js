import React from "react";
import { validatorKey } from "./utils";
import { Select } from "antd";

const { Option } = Select;

export function createOption(opt, comIndex) {
  if (Object.prototype.toString.call(opt) !== "[object Object]") return null;
  const { id, label, value, key, name } = opt;
  return (
    <Option
      key={validatorKey([value, id, key], comIndex)}
      value={validatorKey([id, key, value], undefined)}
    >
      {validatorKey([name, label], undefined)}
    </Option>
  );
}
