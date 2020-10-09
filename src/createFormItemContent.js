import React from "react";
import { Input, Select } from "antd";

const { Option, OptGroup } = Select;

function createFormItemContent(_props) {
  const {
    _type,
    element: { type, options, group, props, render, ...elementProps } = {},
  } = _props;
  const children = options ? (
    group ? (
      <OptGroup label={group}>
        {options.map(({ id, label, value }, comIndex) => {
          return (
            <Option key={id || comIndex} value={value}>
              {label}
            </Option>
          );
        })}
      </OptGroup>
    ) : (
      options.map(({ id, label, value }, comIndex) => {
        return (
          <Option key={id || comIndex} value={value}>
            {label}
          </Option>
        );
      })
    )
  ) : null;
  const Com = type || _type || Input;
  return render || <Com children={children} {...elementProps} {...props}></Com>;
}

export { createFormItemContent };
