import React, {
  useState,
  useLayoutEffect,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import { Col, Form, Row } from "antd";
import { createFormItemContent } from "./createFormItemContent";
import { useConfigForm } from "./useConfigForm";
import { configDecorator, dealData, validatorKey } from "./utils";
import Title from "./Title";

const FormItem = Form.Item;

function _MForm(props, ref) {
  const {
    config = [],
    inited,
    depend,
    form,
    proxyConfig,
    element: { props: formElementProps, ...formElement } = {},
    row: { props: formRowProps, ...formRow } = {},
    col: { props: formColProps, ...formCol } = {},
    ...newProps
  } = props;
  const [, forceUpdata] = useState(null);
  const _forceUpdata = useCallback(() => forceUpdata({}), []);
  const [initedConfig, setting] = useConfigForm(config, depend, inited, {
    form,
  });
  const innerHooks = setting.getInnerHooks("mmmmmmmm_innerHooks");
  useImperativeHandle(ref, () => [initedConfig, setting], [
    initedConfig,
    setting,
  ]);
  console.log("uuuuuuuuuuuuu");
  const willDealData = useMemo(() => {
    console.log("-------------------------------------------------");
    const willDealData = configDecorator(initedConfig, _forceUpdata);
    innerHooks.setWillDealData(willDealData);
    return willDealData;
  }, [initedConfig]);
  dealData(willDealData);
  // console.log(JSON.stringify(willDealData));
  // console.log(JSON.stringify(initedConfig));
  useLayoutEffect(() => {
    const unlisten = innerHooks.setRegister(_forceUpdata);
    return () => {
      unlisten();
    };
  }, []);
  return (
    <Form {...newProps}>
      {initedConfig.map((p, configIndex) => {
        if (Object.prototype.toString.call(p) !== "[object Object]")
          return null;
        const {
          id,
          value,
          key,
          title,
          components,
          divideIndex,
          formItemLayout,
          props: boxProps,
          element: { props: cfgElementProps, ...cfgElement } = {},
          row: { props: rowProps, ...row } = {},
          col: { props: colProps, ...col } = {},
          ...boxSetting
        } = p;
        const ownIndex = divideIndex ? configIndex - divideIndex : null;
        return (
          <div
            className="m-box"
            key={validatorKey([value, id, key], configIndex)}
            {...boxSetting}
            {...boxProps}
          >
            <Title {...{ title, configIndex, ownIndex, innerHooks }} />
            <Row
              {...{ ...formRow, ...row }}
              {...{ ...formRowProps, ...rowProps }}
            >
              {components.map((innerProps, componentIndex) => {
                if (
                  Object.prototype.toString.call(innerProps) !==
                  "[object Object]"
                )
                  return null;
                const {
                  id,
                  value,
                  key,
                  label,
                  name,
                  required = true,
                  render,
                  props,
                  type: _type,
                  getFieldDecoratorOptions,
                  col: { props: itemColProps, ...itemCol } = {},
                  //createFormItemContent所需要的信息
                  element: { props: elementProps, ...element } = {},
                  //
                  ...antdSetting
                } = innerProps;
                const _element = {
                  ...formElement,
                  ...cfgElement,
                  ...element,
                  props: {
                    ...formElementProps,
                    ...cfgElementProps,
                    ...elementProps,
                  },
                };
                return render ? (
                  React.cloneElement(render, {
                    ...antdSetting,
                    ...props,
                  })
                ) : (
                  <Col
                    key={validatorKey([value, id, key], componentIndex)}
                    {...{ ...formCol, ...col, ...itemCol }}
                    {...{ ...formColProps, ...colProps, ...itemColProps }}
                  >
                    <FormItem
                      label={label}
                      {...formItemLayout}
                      {...antdSetting}
                      {...props}
                    >
                      {name
                        ? form.getFieldDecorator(name, {
                            rules: [{ required, message: `${label}不能为空` }],
                            ...getFieldDecoratorOptions,
                          })(
                            createFormItemContent({
                              element: _element,
                              _type,
                            })
                          )
                        : createFormItemContent({ element: _element, _type })}
                    </FormItem>
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}
    </Form>
  );
}

const MForm = React.forwardRef(_MForm);
export default Form.create("MForm")(MForm);
