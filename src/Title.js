import React from "react";
import { Typography } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

function Title(_props) {
  const {
    cfg,
    divideIndex,
    configIndex,
    components,
    forceUpdate,
    title,
    innerHooks: { add, minus } = {},
    title: {
      label,
      isShowAdd,
      isShowMinus,
      render,
      onAddClick,
      onMinusClick,
      props,
      ...titleProps
    } = {},
  } = _props;
  const addCallback = add(configIndex);
  const minusCallback = minus(configIndex);
  const ownIndex = divideIndex ? configIndex - divideIndex : null;
  return (
    <span className="m-title">
      {title ? (
        typeof title === "object" ? (
          render ? (
            React.cloneElement(render, {
              ...titleProps,
              ...props,
            })
          ) : (
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
          <PlusCircleOutlined
            style={{ cursor: "pointer" }}
            onClick={function (...args) {
              typeof handleAddClick === "function" &&
                handleAddClick.apply(this, [
                  {
                    add: addCallback,
                    components,
                    forceUpdate,
                    cfgProps: {
                      cfg,
                      cfgIndex: configIndex,
                      ownIndex,
                      divideIndex,
                    },
                  },
                  ...args,
                ]);
            }}
          />
        </span>
      )}
      {isShowMinus && (
        <span>
          &nbsp;&nbsp;
          <MinusCircleOutlined
            style={{ cursor: "pointer" }}
            onClick={function (...args) {
              typeof handleMinusClick === "function" &&
                handleMinusClick.apply(this, [
                  {
                    minus: minusCallback,
                    components,
                    forceUpdate,
                    cfgProps: {
                      cfg,
                      cfgIndex: configIndex,
                      ownIndex,
                      divideIndex,
                    },
                  },
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
