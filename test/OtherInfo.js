import React from "react";
import { DatePicker, Input, Select } from "antd";
// import MForm, { useFormConfig } from "../lib";
import MForm, { useFormConfig } from "../src";
// import MForm, { useFormConfig } from "mconfigform";
import { useEffect } from "react";
import { useMemo } from "react";
import moment from "moment";

const formLayout = {
  labelCol: {
    xs: 24,
    sm: 10,
  },
  wrapperCol: {
    xs: 24,
    sm: 14,
  },
};

let count = 1;
var num = 0;

function OtherInfo(props) {
  const { listData = {} } = props;
  function change2({ cfgIndex }, value, element) {
    if (value === 2 || value === 3) {
      proxyConfig[cfgIndex].components = pc();
    } else {
      proxyConfig[cfgIndex].components = mc();
    }
  }

  function change1({ cfgIndex }, value, element) {
    if (value === 2 || value === 3) {
      proxyConfig[cfgIndex].components = pc("info2", {
        type: "kk",
        name: "kk姓名",
        id: "kk证件号码",
        idExpiryDate: "kk证件有效期",
      });
    } else {
      proxyConfig[cfgIndex].components = mc("info2", {
        type: "kk",
      });
    }
  }

  function mc(
    w = "Info1",
    { type = "十标志", name = "机构名称", id = "统一社会信用代码" } = {}
  ) {
    return [
      {
        id: 0,
        label: type,
        name: `${w}[]type`,
        element: {
          type: Select,
          $getPopupContainer: () => document.querySelector("#m-modal"),
          props: {
            onChange: w === "Info1" ? change2 : change1,
          },
          options: [
            {
              id: 0,
              label: "法人",
              value: 2,
            },
            {
              id: 1,
              label: "其他自然人",
              value: 3,
            },
            {
              id: 2,
              label: "机构",
              value: 1,
            },
          ],
        },
      },
      {
        id: 1,
        label: name,
        name: `${w}[]name`,
      },
      {
        id: 2,
        label: id,
        name: `${w}[]id`,
      },
    ];
  }

  function pc(
    w = "Info1",
    {
      type = "十标志",
      name = "十姓名",
      id = "十证件号码",
      idExpiryDate = "十证件有效期",
    } = {}
  ) {
    return [
      {
        id: 0,
        label: type,
        name: `${w}[]type`,
        getFieldDecoratorOptions: {
          initialValue: 2,
        },
        element: {
          type: React.forwardRef((props, ref) => (
            <Select {...props} ref={ref}></Select>
          )),
          props: {
            $getPopupContainer: () => document.querySelector("#m-modal"),
            onChange: w === "Info1" ? change2 : change1,
          },
          options: [
            {
              id: 0,
              label: "法人",
              value: 2,
            },
            {
              id: 1,
              label: "其他自然人",
              value: 3,
            },
            {
              id: 2,
              label: "机构",
              value: 1,
            },
          ],
        },
      },
      {
        id: 1,
        label: name,
        name: `${w}[]name`,
      },
      {
        id: 2,
        label: id,
        name: `${w}[]id`,
      },
      {
        id: 3,
        label: idExpiryDate,
        name: `${w}[]idExpiryDate`,
        element: {
          type: DatePicker,
        },
      },
    ];
  }

  function cbf(num = 0) {
    return {
      id: `active${num}`,
      divideIndex: 3,
      props: {
        style: {
          border: "1px dashed #aaa",
          padding: "10px",
          marginBottom: "5px",
        },
      },
      title: {
        label: ({ ownIndex }) => `弟弟答案${ownIndex + 1}`,
        isShowAdd({ ownIndex }) {
          return count === ownIndex + 1;
        },
        isShowMinus() {
          return count !== 1;
        },
        handleAddClick({ add }) {
          count++;
          const components = cbf(num + 1);
          add(components);
        },
        handleMinusClick({ minus }) {
          count--;
          minus();
        },
        props: {
          onClick(p) {
            console.log(p);
            // proxyConfig[cfgIndex].title.label = "cfgIndex";
            // console.log(arg, "arg");
          },
        },
      },
      col: {
        span: 8,
      },
      components: [
        {
          id: 0,
          label: "弟弟答案姓名",
        },
        {
          id: 2,
          label: "弟弟答案证件有效期",
          element: {
            type: DatePicker,
            render() {
              return <Input></Input>;
            },
            disabled: true,
          },
        },
        {
          id: 3,
          label: "弟弟答案地址",
        },
        {
          id: 4,
          label: "span",
          type: function () {
            useEffect(() => {
              return () => {
                console.log("un");
              };
            }, []);
            return (
              <div>
                <em>em</em>
              </div>
            );
          },
        },
      ],
    };
  }

  let config = useMemo(
    () => [
      {
        id: 0,
        title: "a",
        col: {
          span: 8,
        },
        l: "",
        components: [
          {
            id: 0,
            label: "窝窝名称",
            name: "wowoName",
            element: {
              type: "span",
              children(props) {
                return <em>em</em>;
              },
              in: "aaaw",
              props: {
                in: "w",
                data_a: 123,
                onClick(p, element) {
                  p.cfg.title = {
                    label: ({ cfgIndex }) => "f人信息" + cfgIndex,
                    onClick(p) {
                      // p.cfg.title.$set("label", "w");
                      console.log((p.cfg.title.label = "w"));
                    },
                  };
                  console.log(p);
                  // num++;
                  // console.log(num);
                  // proxyConfig[cfgIndex].l = "3";
                  // if (num === 3) {
                  //   proxyConfig[cfgIndex].components[0].$set("label", "3");
                  // }
                  // proxyConfig[cfgIndex].$set("p", { arr: [{ a: "a" }] });
                  // proxyConfig[cfgIndex].p = { arr: [{ a: "a" }] };
                },
                className: "spanm",
              },
            },
          },
          {
            id: 1,
            label: "窝窝证件号码",
            name: "wowoId",
            type: "span",
            element: {
              children() {
                return "w";
              },
            },
            required: false,
          },
          {
            id: 2,
            label: "窝窝证件有效日期",
            name: "wowoIdExpiryDate",
            element: {
              type: DatePicker,
            },
            getFieldDecoratorOptions: {
              $initialValue: moment(listData.legalPersonId),
            },
          },
        ],
      },
      {
        id: 1,
        title: "十信息",
        col: {
          span: 8,
        },
        components: pc(),
      },
      {
        id: 3,
        title: "kk信息",
        col: {
          span: 8,
        },
        components: pc("info2", {
          type: "kk",
          name: "kk姓名",
          id: "kk证件号码",
          idExpiryDate: "kk证件有效期",
          capitalAmount: "出资金额（元）",
          capitalRatio: "出资占比（%）",
          isMrgRpt: "是否合并报表",
        }),
      },
      cbf(),
    ],
    [num]
  );
  const [proxyConfig, inited] = useFormConfig(config);
  console.log("1", inited);
  useEffect(() => {
    console.log("inited", inited);
  }, []);
  return (
    <MForm {...{ config: proxyConfig, proxyConfig, inited, ...formLayout }} />
  );
}
export default OtherInfo;

function C() {
  return <div>div</div>;
}
