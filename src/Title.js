import React from "react";
import { Typography, Icon } from "antd";

const { Text } = Typography;

function Title(_props) {
  const {
    ownIndex,
    configIndex,
    title,
    innerHooks: { add, minus } = {},
    title: {
      label,
      isShowAdd,
      isShowMinus,
      render,
      handleAddClick,
      handleMinusClick,
      props,
      ...titleProps
    } = {},
  } = _props;
  const addCallback = add(configIndex);
  const minusCallback = minus(configIndex);
  return (
    <span className="m-title">
      {title ? (
        typeof title === "object" ? (
          render || (
            <Text strong {...titleProps} {...props}>
              {label}
            </Text>
          )
        ) : (
          <Text strong>{title}</Text>
        )
      ) : null}
      {isShowAdd && (
        <span>
          &nbsp;&nbsp;
          <Icon
            type="plus-circle"
            style={{ cursor: "pointer" }}
            onClick={function (...args) {
              typeof handleAddClick === "function" &&
                handleAddClick.apply(this, [
                  { add: addCallback, configIndex, ownIndex },
                  ...args,
                ]);
            }}
          />
        </span>
      )}
      {isShowMinus && (
        <span>
          &nbsp;&nbsp;
          <Icon
            type="minus-circle-o"
            style={{ cursor: "pointer" }}
            onClick={function (...args) {
              typeof handleMinusClick === "function" &&
                handleMinusClick.apply(this, [
                  { minus: minusCallback, configIndex, ownIndex },
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
