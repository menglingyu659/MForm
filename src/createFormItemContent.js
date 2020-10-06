import React from "react";
import { Input, Select } from "antd";

const { Option, OptGroup } = Select;

function createFormItemContent(_props) {
  const {
    element: {
      type: Com = Input,
      options,
      group,
      props,
      render,
      ...elementProps
    } = {},
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
  return render || <Com children={children} {...elementProps} {...props}></Com>;
}

export { createFormItemContent };
