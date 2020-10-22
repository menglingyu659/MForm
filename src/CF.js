import React, { useLayoutEffect } from "react";
import { Col, Form, Row } from "antd";
import { createFormItemContent } from "./createFormItemContent";
import { validatorKey } from "./utils";
import Title from "./Title";
import "./style/CF.css";

const FormItem = Form.Item;

function CF({
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
}) {
  const [form] = Form.useForm();
  useLayoutEffect(() => {
    setting.form = form;
  }, [setting, form]);
  return (
    <Form {...newProps} form={form}>
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
                      name={name}
                      rules={[{ required, message: `${label}不能为空` }]}
                      {...formItemLayout}
                      {...antdSetting}
                      {...props}
                    >
                      {createFormItemContent({ element: _element, _type })}
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

export default CF;
