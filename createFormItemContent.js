import React from "react";
import { Input, Select } from "antd";
import { overwriteMethods } from "./utils";

const { Option, OptGroup } = Select;

function createFormItemContent(props) {
  const {
    configIndex,
    ownIndex,
    element: {
      type: Com = Input,
      options,
      children,
      group,
      methods,
      ...elementProps
    } = {},
  } = props;
  const newMethods = overwriteMethods(methods, configIndex, ownIndex);
  return (
    <Com {...elementProps} {...newMethods}>
      {Com.name === "Select" && options ? (
        group ? (
          <OptGroup label={group}>
            {options.map(({ id, label, value }, comOptGroupIndex) => {
              return (
                <Option key={id || comOptGroupIndex} value={value}>
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
      ) : typeof children === "function" ? (
        children()
      ) : null}
    </Com>
  );
}

export { createFormItemContent };
