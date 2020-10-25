import React, {
  useState,
  useLayoutEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import { useConfigForm } from "./useConfigForm";
import { configDecorator, dealData } from "./utils";
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
  const [, forceUpdate] = useState(null);
  const _forceUpdate = () => forceUpdate({});
  const [initedConfig, setting] = useConfigForm(config, depend, inited, {});
  const innerHooks = setting.getInnerHooks("mmmmmmmm_innerHooks");
  useImperativeHandle(ref, () => [initedConfig, setting], [
    initedConfig,
    setting,
  ]);
  const willDealData = useMemo(() => {
    const willDealData = configDecorator(initedConfig, _forceUpdate);
    innerHooks.setWillDealData(willDealData);
    return willDealData;
  }, [initedConfig]);
  dealData(willDealData);
  useLayoutEffect(() => {
    const unlisten = innerHooks.setRegister(_forceUpdate);
    return () => {
      unlisten();
    };
  }, [initedConfig]);
  return (
    <CF
      {...{
        setting,
        formElementProps,
        formElement,
        formRowProps,
        formRow,
        formColProps,
        formCol,
        newProps,
        initedConfig,
        innerHooks,
      }}
    ></CF>
  );
}

export default React.forwardRef(MForm);
