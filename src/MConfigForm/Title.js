import React from "react";
import { Typography, Icon } from "antd";
import { overwriteMethods } from "./utils";

const { Text } = Typography;

function Title(props) {
  const {
    ownIndex,
    configIndex,
    title,
    innerHooks: { add, minus } = {},
    title: {
      content,
      isShowAdd,
      isShowMinus,
      render,
      onAddClick,
      onMinusClick,
      methods,
      ...titleProps
    } = {},
  } = props;
  const newMethods =
    methods && overwriteMethods(methods, configIndex, ownIndex);
  const addCallback = add(configIndex);
  const minusCallback = minus(configIndex);
  return (
    <span className="m-title">
      {title ? (
        typeof title === "object" ? (
          typeof render === "function" ? (
            render({ configIndex, ownIndex, addCallback, minusCallback })
          ) : (
            <Text strong {...titleProps} {...newMethods}>
              {content}
            </Text>
          )
        ) : (
          <Text strong>{title}</Text>
        )
      ) : null}
      {(typeof isShowAdd === "function"
        ? isShowAdd(configIndex, ownIndex)
        : isShowAdd) && (
        <span>
          &nbsp;&nbsp;
          <Icon
            type="plus-circle"
            style={{ cursor: "pointer" }}
            onClick={function (...args) {
              typeof onAddClick === "function" &&
                onAddClick.apply(this, [
                  addCallback,
                  configIndex,
                  ownIndex,
                  ...args,
                ]);
            }}
          />
        </span>
      )}
      {(typeof isShowMinus === "function"
        ? isShowMinus(configIndex, ownIndex)
        : isShowMinus) && (
        <span>
          &nbsp;&nbsp;
          <Icon
            type="minus-circle-o"
            style={{ cursor: "pointer" }}
            onClick={function (...args) {
              typeof onMinusClick === "function" &&
                onMinusClick.apply(this, [
                  minusCallback,
                  configIndex,
                  ownIndex,
                  ...args,
                ]);
            }}
          />
        </span>
      )}
    </span>
  );
}

export default Title;
