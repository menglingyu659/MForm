import React from "react";
import { DatePicker, Input, Select } from "antd";
// import MForm, { useConfigForm } from "../lib";
import MForm, { useConfigForm } from "../src";
// import MForm, { useConfigForm } from "mconfigform";
import { useEffect } from "react";
import { useMemo } from "react";
import moment from "moment";
import { useState } from "react";

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

let count = 2;
var num = 0;

function OtherInfo(props) {
  const { listData = {} } = props;
  const [f, force] = useState([]);
  console.log(f);
  function change2({ cfgProps: { cfgIndex } }, value, element) {
    if (value === 2 || value === 3) {
      proxyConfig[cfgIndex].components = pc();
    } else {
      proxyConfig[cfgIndex].components = mc();
    }
  }

  function change1(m, value, element) {
    const {
      cfgProps: { cfgIndex },
    } = m;
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
        element: {
          onClick(a) {},
        },
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
        element: {
          type: React.forwardRef((props, ref) => (
            <Select {...props} ref={ref}></Select>
          )),
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
        element: {
          onClick(a) {
            console.log(a);
          },
        },
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
        label: ({ cfgProps: { ownIndex } }) => `弟弟答案${ownIndex + 1}_${num}`,
        isShowAdd({ cfgProps, cfgProps: { ownIndex } }) {
          return count === ownIndex + 1;
        },
        isShowMinus() {
          return count !== 1;
        },
        onAddClick({ add }) {
          count++;
          const components = cbf(num + 1);
          add(components);
        },
        onMinusClick({ minus }) {
          count--;
          minus();
        },
        onClick(p) {
          console.log(p.cfgProps.cfg.title.onClick);
          p.cfgProps.cfg.title.onClick = (a) => {
            console.log("dididi", a);
          };

          // proxyConfig[cfgIndex].title.label = "cfgIndex";
          // console.log(arg, "arg");
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
              return () => {};
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

  let config = [
    {
      id: 0,
      col: {
        span: 8,
      },
      l: "",
      components: [
        {
          id: 0,
          label: "窝窝名称",
          name: "wowoName",
          initialValue: 1231,
          element: {
            in: "aaaw",
            props: {
              in: "w",
              data_a: 123,
              onClick(p, element) {
                console.log(p);
                // p.cfgProps.cfg.title = "999";
                // p.components[2].getFieldDecoratorOptions.$set(
                //   "$initialValue",
                //   moment("1234-10-08")
                // );
                p.cfgProps.cfg.$set("title", {
                  label: (x) => {
                    // console.log(x);
                    return "f人信息" + x.cfgProps.cfgIndex;
                  },
                  onClick(p) {
                    // p.cfg.title.$set("label", "w");
                    console.log((p.cfgProps.cfg.title.label = "w"));
                  },
                });
                // p.cfgProps.cfg.title = {
                //   label: (x) => {
                //     console.log(x);
                //     return "f人信息" + x.cfgProps.cfgIndex;
                //   },
                //   onClick(p) {
                //     // p.cfg.title.$set("label", "w");
                //     console.log((p.cfgProps.cfg.title.label = "w"));
                //   },
                // };
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
          element: {},
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
      title: {
        label: "十信息",
      },
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
    cbf(1),
    {
      id: "w",
      col: {
        span: 8,
      },
      l: "",
      components: [
        {
          id: 0,
          label: "窝窝名称",
          name: "wowoName1",
          $initialValue: 1231,
          element: {
            in: "aaaw",
            props: {
              in: "w",
              data_a: 123,
              className: "spanm",
            },
          },
        },
        {
          id: 1,
          label: "窝窝证件号码",
          name: "wowoId1",
          type: "span",
          element: {},
          required: false,
        },
        {
          id: 2,
          label: "窝窝证件有效日期",
          onClick(m) {
            console.log(m);
            console.log(m.cmptProps.cmpt);
            m.cmptProps.cmpt.$initialValue = moment("1234-09-10");
          },
          name: "wowoIdExpiryDate1",
          element: {
            type: DatePicker,
          },
          $initialValue: moment(listData.legalPersonId),
        },
      ],
    },
  ];
  const [proxyConfig, inited] = useConfigForm(config, [f]);
  useEffect(() => {
    console.log("inited", inited);
    console.log(config);
  }, []);
  return (
    <div>
      <div
        onClick={() => {
          count = 2;
          force({});
        }}
      >
        div
      </div>
      <MForm {...{ config: proxyConfig, proxyConfig, inited, ...formLayout }} />
    </div>
  );
}
export default OtherInfo;

function C() {
  return <div>div</div>;
}
