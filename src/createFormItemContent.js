import React from "react";
import { Input, Select } from "antd";
import { createOption } from "./createOption";
const { OptGroup } = Select;

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
