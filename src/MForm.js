import React, { useState, useLayoutEffect, useImperativeHandle } from "react";
import { Col, Form, Row } from "antd";
import { createFormItemContent } from "./createFormItemContent";
import { useFormConfig } from "./useFormConfig";
import { configDecorator, validatorKey } from "./utils";
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
  const [initedConfig, setting] = useFormConfig(config, depend, inited, {
    form,
  });
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
  }, []);
  return (
    <Form {...newProps}>
      {initedConfig.map((p, configIndex) => {
        if (Object.prototype.toString.call(p) !== "[object Object]")
          return null;
        const {
          id,
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
            key={validatorKey(id, configIndex)}
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
                    key={validatorKey(id, componentIndex)}
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
