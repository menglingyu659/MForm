import React from "react";
import { DatePicker, Select } from "antd";
import MForm, { useFormConfig } from "./MConfigForm";
import { useEffect } from "react";
import { useMemo } from "react";

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

function OtherInfo(props) {
  function onControllerChange(value, element, index) {
    console.log(index);
    if (value === 2 || value === 3) {
      config[index].components = createPersonComponents();
    } else {
      config[index].components = createMechanismComponents();
    }
  }

  function onshareholderChange(value, element, index) {
    if (value === 2 || value === 3) {
      config[index].components = createPersonComponents("shareholderInfo", {
        type: "控股股东",
        name: "控股股东姓名",
        id: "控股股东证件号码",
        idExpiryDate: "控股股东证件有效期",
      });
    } else {
      config[index].components = createMechanismComponents("shareholderInfo", {
        type: "控股股东",
      });
    }
  }

  function createMechanismComponents(
    whereInfo = "controllerInfo",
    {
      type = "实控人标志",
      name = "机构名称",
      id = "统一社会信用代码",
      capitalAmount = "出资金额（元）",
      capitalRatio = "出资占比（%）",
      isMrgRpt = "是否合并报表",
    } = {}
  ) {
    return [
      {
        id: 0,
        label: type,
        name: `${whereInfo}[]type`,
        element: {
          type: Select,
          methods: {
            onChange:
              whereInfo === "controllerInfo"
                ? onControllerChange
                : onshareholderChange,
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
        name: `${whereInfo}[]name`,
      },
      {
        id: 2,
        label: id,
        name: `${whereInfo}[]id`,
      },
      {
        id: 3,
        label: capitalAmount,
        name: `${whereInfo}[]capitalAmount`,
      },
      {
        id: 4,
        label: capitalRatio,
        name: `${whereInfo}[]capitalRatio`,
      },
      {
        id: 5,
        label: isMrgRpt,
        name: `${whereInfo}[]isMrgRpt`,
        element: {},
      },
    ];
  }

  function createPersonComponents(
    whereInfo = "controllerInfo",
    {
      type = "实控人标志",
      name = "实控人姓名",
      id = "实控人证件号码",
      idExpiryDate = "实控人证件有效期",
      capitalAmount = "出资金额（元）",
      capitalRatio = "出资占比（%）",
      isMrgRpt = "是否合并报表",
    } = {}
  ) {
    return [
      {
        id: 0,
        label: type,
        name: `${whereInfo}[]type`,
        element: {
          type: Select,
          methods: {
            onChange:
              whereInfo === "controllerInfo"
                ? onControllerChange
                : onshareholderChange,
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
        name: `${whereInfo}[]name`,
      },
      {
        id: 2,
        label: id,
        name: `${whereInfo}[]id`,
      },
      {
        id: 3,
        label: idExpiryDate,
        name: `${whereInfo}[]idExpiryDate`,
        element: {
          type: DatePicker,
        },
      },
      {
        id: 4,
        label: capitalAmount,
        name: `${whereInfo}[]capitalAmount`,
      },
      {
        id: 5,
        label: capitalRatio,
        name: `${whereInfo}[]capitalRatio`,
      },
      {
        id: 6,
        label: isMrgRpt,
        name: `${whereInfo}[]isMrgRpt`,
      },
    ];
  }

  function createBeneficiaryConfig(num = 0) {
    return {
      id: `active${num}`,
      divideIndex: 4,
      style: {
        border: "1px dashed #aaa",
        padding: "10px",
        marginBottom: "5px",
      },
      title: {
        content: `受益人信息`,
        isShowAdd(index, ownIndex) {
          return count === ownIndex + 1;
        },
        isShowMinus() {
          return count !== 1;
        },
        onAddClick(add) {
          console.log(config);
          count++;
          const components = createBeneficiaryConfig(num + 1);
          add(components);
        },
        onMinusClick(miuns) {
          count--;
          miuns();
        },
        methods: {
          onClick(element, index) {
            console.log(element);
            console.log(index);
            // config[index].title.content = "index";
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
          label: "受益人姓名",
        },
        {
          id: 1,
          label: "受益人证件号码",
        },
        {
          id: 2,
          label: "受益人证件有效期",
          element: {
            type: DatePicker,
          },
        },
        {
          id: 3,
          label: "受益人地址",
        },
      ],
    };
  }

  function createEnpseBasicInfoComponents() {
    return [
      {
        id: 0,
        label: "是否上市公司",
        element: {
          type: Select,
          options: [
            {
              id: 0,
              label: "是",
              value: 1,
            },
            {
              id: 1,
              label: "否",
              value: 2,
            },
          ],
        },
      },
      {
        id: 1,
        label: "企业出资人经济成分",
        element: {
          type: Select,
          options: [
            {
              id: 0,
              label: "是",
              value: 1,
            },
            {
              id: 1,
              label: "否",
              value: 2,
            },
          ],
        },
      },
      {
        id: 2,
        label: "企业邮箱地址",
        name: "controllerName",
      },
      {
        id: 3,
        label: "企业邮编",
        name: "controllerId",
      },
      {
        id: 4,
        label: "企业地址",
        name: "controllerIdExpiryDate",
        element: {
          type: DatePicker,
        },
      },
      {
        id: 5,
        label: "员工人数",
        name: "chuzi",
      },
      {
        id: 6,
        label: "注册资本（元）%）",
        name: "bili",
      },
      {
        id: 7,
        label: "实收资本（元）",
        name: "baobiao",
      },
      {
        id: 8,
        label: "年收入（元）",
        name: "baobiao",
      },
      {
        id: 9,
        label: "年收入（元）",
        name: "baobiao",
      },
      {
        id: 10,
        label: "年收入（元）",
        name: "baobiao",
      },
      {
        id: 11,
        label: "年收入（元）",
        name: "baobiao",
      },
      {
        id: 12,
        label: "总资产（元）",
        name: "baobiao",
      },
      {
        id: 13,
        label: "净资产（元）",
        name: "baobiao",
      },
      {
        id: 14,
        label: "营业收入（元）",
        name: "baobiao",
      },
      {
        id: 15,
        label: "国标分类",
        name: "baobiao",
        col: {
          span: 6,
          style: {
            marginRight: "24px",
          },
        },
        formItemLayout: {
          wrapperCol: {
            span: 14,
          },
        },
        element: {
          type: Select,
          className: "w",
        },
      },
      {
        id: 16,
        col: {
          span: 4,
        },
        formItemLayout: {
          labelCol: {
            span: 0,
          },
          wrapperCol: {
            span: 21,
          },
        },
        element: {
          type: Select,
        },
        colon: false,
      },
      {
        id: 17,
        col: {
          span: 4,
        },
        formItemLayout: {
          labelCol: {
            span: 0,
          },
          wrapperCol: {
            span: 21,
          },
        },
        colon: false,
      },
      {
        id: 18,
        col: {
          span: 4,
        },
        formItemLayout: {
          labelCol: {
            span: 0,
          },
          wrapperCol: {
            span: 21,
          },
        },
        colon: false,
      },
      {
        id: 19,
        label: "国标补充分类",
        colon: false,
      },
      {
        id: 20,
        label: "战略新兴产业类型",
        colon: false,
      },
    ];
  }

  let initconfig = useMemo(
    () => [
      {
        id: 0,
        title: "法人信息",
        col: {
          span: 8,
        },
        components: [
          {
            id: 0,
            label: "法定代表人名称",
            name: "legalPersonName",
            element: {
              type: "span",
              children() {
                return <em>em</em>;
              },
              className: "spanm",
            },
          },
          {
            id: 1,
            label: "法定代表人证件号码",
            name: "legalPersonId",
            element: {
              type: "span",
            },
            required: false,
          },
          {
            id: 2,
            label: "法定代表人证件有效日期",
            name: "legalPersonIdExpiryDate",
            element: {
              type: DatePicker,
            },
          },
          {
            id: 3,
            label: "法定代表人电话",
            name: "legalPersonPhone",
          },
          {
            id: 4,
            label: "法定代表人邮编",
            name: "legalPersonPostalCode",
          },
          {
            id: 5,
            label: "法定代表人地址",
            name: "legalPersonAddress",
          },
        ],
      },
      {
        id: 1,
        title: "操作员信息",
        col: {
          span: 8,
        },
        components: [
          {
            id: 0,
            label: "操作员名称",
            name: "operatorName",
            element: { type: "span" },
          },
          {
            id: 1,
            label: "操作员证件号码",
            name: "operatorId",
            element: { type: "span" },
          },
          {
            id: 2,
            label: "操作员证件有效期",
            name: "operatorIdExpiryDate",
            element: { type: DatePicker },
          },
        ],
      },
      {
        id: 2,
        title: "实控人信息",
        col: {
          span: 8,
        },
        components: createPersonComponents(),
      },
      {
        id: 3,
        title: "控股股东信息",
        col: {
          span: 8,
        },
        components: createPersonComponents("shareholderInfo", {
          type: "控股股东",
          name: "控股股东姓名",
          id: "控股股东证件号码",
          idExpiryDate: "控股股东证件有效期",
          capitalAmount: "出资金额（元）",
          capitalRatio: "出资占比（%）",
          isMrgRpt: "是否合并报表",
        }),
      },
      createBeneficiaryConfig(),
      {
        id: 4,
        title: "企业基本信息",
        col: {
          span: 8,
        },
        components: createEnpseBasicInfoComponents(),
      },
      {
        id: 5,
        title: "银行信息",
        col: {
          span: 8,
        },
        components: [
          {
            id: 0,
            label: "基本户开户银行",
            name: "baobiao",
          },
          {
            id: 1,
            label: "基本户开户地区",
            name: "baobiao",
          },

          {
            id: 2,
            //   label: "是否合并报表",
            name: "baobiao",
            colon: false,
          },
          {
            id: 3,
            label: "基本户支行名称",
            name: "baobiao",
          },
          {
            id: 4,
            label: "基本存款账号",
            name: "baobiao",
          },
          {
            id: 5,
            label: "中征码",
            name: "baobiao",
          },
        ],
      },
    ],
    []
  );
  const [config, inited] = useFormConfig(initconfig);
  console.log("1", inited);
  useEffect(() => {
    console.log("inited", inited);
  }, []);
  return <MForm {...{ config, inited, ...formLayout }} />;
}
export default OtherInfo;
