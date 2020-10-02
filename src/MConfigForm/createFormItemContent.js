import React from "react";
import { Input, Select } from "antd";
import { overwriteMethods } from "./utils";

const { Option, OptGroup } = Select;

function createFormItemContent(props) {
  const {
    configIndex,
    ownIndex,
    element,
    element: {
      type: Com = Input,
      options,
      children,
      group,
      methods,
      ...elementProps
    } = {},
  } = props;
  const newMethods =
    methods && overwriteMethods(methods, configIndex, ownIndex);
  return typeof element === "function" ? (
    element({ configIndex, ownIndex })
  ) : (
    <Com {...elementProps} {...newMethods}>
      {typeof children === "function" ? (
        children({ configIndex, ownIndex })
      ) : options ? (
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
      ) : null}
    </Com>
  );
}

export { createFormItemContent };
