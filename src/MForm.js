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
    form,
    proxyConfig,
    row: formRow,
    row: { props: formRowProps } = {},
    col: formCol,
    col: { props: formColProps } = {},
    ...newProps
  } = props;
  const [, forceUpdata] = useState(null);
  const [initedConfig, setting] = useFormConfig(config, inited, { form });
  const innerHooks = setting.getInnerHooks("menglingyu_innerHooks");
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
          row,
          row: { props: rowProps } = {},
          col,
          col: { props: colProps } = {},
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
                const {
                  col: itemCol,
                  col: { props: itemColProps } = {},
                  id,
                  label,
                  name,
                  required = true,
                  render,
                  props,
                  type: _type,
                  getFieldDecoratorOptions,
                  //createFormItemContent所需要的信息
                  element,
                  //
                  ...antdSetting
                } = innerProps;
                return (
                  render || (
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
                              rules: [
                                { required, message: `${label}不能为空` },
                              ],
                              ...getFieldDecoratorOptions,
                            })(createFormItemContent({ element, _type }))
                          : createFormItemContent({ element, _type })}
                      </FormItem>
                    </Col>
                  )
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
