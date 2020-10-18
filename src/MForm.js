import React, { useState, useLayoutEffect, useImperativeHandle } from "react";
import { useConfigForm } from "./useConfigForm";
import { configDecorator } from "./utils";
import CF from "./CF";

function MForm(props, ref) {
  const {
    config = [],
    inited,
    depend,
    proxyConfig,
    element: { props: formElementProps, ...formElement } = {},
    row: { props: formRowProps, ...formRow } = {},
    col: { props: formColProps, ...formCol } = {},
    ...newProps
  } = props;
  const [, forceUpdata] = useState(null);
  const [initedConfig, setting] = useConfigForm(config, depend, inited, {});
  const innerHooks = setting.getInnerHooks("mmmmmmmm_innerHooks");
  useImperativeHandle(ref, () => [initedConfig, setting]);
  configDecorator(initedConfig);
  useLayoutEffect(() => {
    const unlisten = innerHooks.setRegister(() => {
      forceUpdata({});
    });
    return () => {
      unlisten();
    };
  }, [config]);
  return (
    <CF
      {...{
        initedConfig,
        setting,
        formElementProps,
        formElement,
        formRowProps,
        formRow,
        formColProps,
        formCol,
        newProps,
        innerHooks,
      }}
    ></CF>
  );
}

export default React.forwardRef(MForm);
