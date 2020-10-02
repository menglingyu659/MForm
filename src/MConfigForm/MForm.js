import React, { useState, useLayoutEffect, useImperativeHandle } from "react";
import { Col, Form, Row } from "antd";
import { createFormItemContent } from "./createFormItemContent";
import { useFormConfig } from "./useFormConfig";
import { overwriteMethods } from "./utils";
import Title from "./Title";

const FormItem = Form.Item;

function _MForm(props, ref) {
  const { config = [], inited, form, ...newProps } = props;
  console.log(config);
  const [, forceUpdata] = useState(null);
  const { getFieldDecorator } = form;
  const [initedConfig, setting] = useFormConfig(config, inited, { form });
  useImperativeHandle(ref, () => [initedConfig, setting]);
  const { getInnerHooks } = setting;
  const innerHooks = getInnerHooks("menglingyu_innerHooks");
  const { setRegister } = innerHooks;
  useLayoutEffect(() => {
    const unlisten = setRegister(() => {
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
                  formItemLayout,
                  id,
                  label,
                  name,
                  required = true,
                  getFieldDecoratorOptions,
                  //createFormItemContent所需要的信息
                  element,
                  //
                  ...antdSetting
                } = innerProps;
                return (
                  <Col key={id || componentIndex} {...itemCol || col}>
                    <FormItem
                      label={label}
                      {...formItemLayout}
                      {...antdSetting}
                    >
                      {name
                        ? getFieldDecorator(name, {
                            rules: [{ required, message: `${label}不能为空` }],
                            ...getFieldDecoratorOptions,
                          })(
                            createFormItemContent({
                              element,
                              configIndex,
                              ownIndex,
                            })
                          )
                        : createFormItemContent({
                            element,
                            configIndex,
                            ownIndex,
                          })}
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
