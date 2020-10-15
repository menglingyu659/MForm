import React from "react";
import { Input, Select } from "antd";
import { validatorKey } from "./utils";

const { Option, OptGroup } = Select;

function createOption(opt, comIndex) {
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

function createFormItemContent(_props) {
  const {
    _type,
    element: { type, options, group, props, render, ...elementProps } = {},
  } = _props;
  const children = options ? (
    group ? (
      <OptGroup label={group}>
        {options.map((opt, comIndex) => {
          return createOption(opt, comIndex);
        })}
      </OptGroup>
    ) : (
      options.map((opt, comIndex) => {
        return createOption(opt, comIndex);
      })
    )
  ) : null;
  const Com = type || _type || Input;
  return render ? (
    React.cloneElement(render, {
      ...elementProps,
      ...props,
    })
  ) : (
    <Com children={children} {...elementProps} {...props}></Com>
  );
}

export { createFormItemContent };
