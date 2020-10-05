import React from "react";
import { Typography, Icon } from "antd";

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
  const addCallback = add(configIndex);
  const minusCallback = minus(configIndex);
  return (
    <span className="m-title">
      {title ? (
        typeof title === "object" ? (
          render || (
            <Text strong {...titleProps} {...methods}>
              {content}
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
              typeof onAddClick === "function" &&
                onAddClick.apply(this, [
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
              typeof onMinusClick === "function" &&
                onMinusClick.apply(this, [
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
