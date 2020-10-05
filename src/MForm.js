import React, { useState, useLayoutEffect, useImperativeHandle } from "react";
import { Col, Form, Row } from "antd";
import { createFormItemContent } from "./createFormItemContent";
import { useFormConfig } from "./useFormConfig";
import { configDecorator } from "./utils";
import Title from "./Title";

const FormItem = Form.Item;

function _MForm(props, ref) {
  const { config = [], inited, form, proxyConfig, ...newProps } = props;
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
        if (typeof p !== "object" || p === null || Array.isArray(p))
          return null;
        const {
          id,
          title,
          components,
          divideIndex,
          col = {},
          ...boxSetting
        } = p;
        const ownIndex = divideIndex ? configIndex - divideIndex : null;
        return (
          <div className="m-box" key={id || configIndex} {...boxSetting}>
            <Title {...{ title, configIndex, ownIndex, innerHooks }} />
            <Row>
              {components.map((innerProps, componentIndex) => {
                const {
                  col: itemCol,
                  id,
                  label,
                  name,
                  required = true,
                  render,
                  getFieldDecoratorOptions,
                  //createFormItemContent所需要的信息
                  element,
                  //
                  ...antdSetting
                } = innerProps;
                return (
                  render || (
                    <Col key={id || componentIndex} {...(itemCol || col)}>
                      <FormItem label={label} {...antdSetting}>
                        {name
                          ? form.getFieldDecorator(name, {
                              rules: [
                                { required, message: `${label}不能为空` },
                              ],
                              ...getFieldDecoratorOptions,
                            })(createFormItemContent({ element }))
                          : createFormItemContent({ element })}
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
