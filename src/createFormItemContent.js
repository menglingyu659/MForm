import React from "react";
import { Input, Select } from "antd";

const { Option, OptGroup } = Select;

function createFormItemContent(props) {
  const {
    element: {
      type: Com = Input,
      options,
      children,
      group,
      methods,
      render,
      ...elementProps
    } = {},
  } = props;
  return (
    render || (
      <Com {...elementProps} {...methods}>
        {children ||
          (options ? (
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
          ) : null)}
      </Com>
    )
  );
}

export { createFormItemContent };
