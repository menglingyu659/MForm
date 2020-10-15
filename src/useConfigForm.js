import React from "react";
import {
  createMark,
  polyfillProxy,
  cfgControl,
  cfgDecorator,
  cfgIndexReset,
  cfgDeal,
  getDealData,
} from "./utils";

const arrayProto = Array.prototype;
const objectProto = Object.prototype;
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

export class CreateConfig {
  constructor(config) {
    this.config = config;
    this.register = [];
    this.willDealData = { active: [], bind: [], other: [] };
    // this.keying(config);
    if (config) {
      this.createObjectProto = this.overwriteObjectMethod();
      this.createArrayProto = this.overwriteArrayMethod();
      this.proxyConfig = this.initConfig(config);
    }
  }

  getWillDealData = () => this.willDealData;

  forceUpdate = () => {
    this.register.forEach((item) => {
      typeof item === "function" && item();
    });
  };

  setRegister = (register) => {
    this.register.push(register);
    const index = this.register.length - 1;
    return () => {
      this.register.splice(index);
    };
  };

  // createKey = (item, index) => {
  //   for (const prop in item) {
  //     if (Array.isArray(item[prop])) this.keying(item[prop]);
  //   }
  //   return `__m_${index}_m__`;
  // };

  // keying = (config) => {
  //   if (Array.isArray(config)) {
  //     config.forEach((item, index) => {
  //       item.id = item.id || this.createKey(item, index);
  //     });
  //   }
  // };
  polyfillProxyCb = (value, prop, cfg) => {
    if (value.mark === "mmm_init") return value.value;
    if (cfg.__m__.propsIndexs.hasOwnProperty(`active$_m_$${prop}`)) {
      const idx = cfg.__m__.propsIndexs[`active$_m_$${prop}`];
      this.willDealData.active.splice(idx, 1);
    }
    let { originPar, $cfg } = cfg.__m__;
    if ($cfg === "root" && value.hasOwnProperty("__m__")) {
      const { divideIndex } = value;
      const cfgIndex = Number(prop);
      const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
      if (!Number.isNaN(cfgIndex)) {
        value.__m__.originPar.cfgProps.cfgIndex = cfgIndex;
        value.__m__.originPar.cfgProps.ownIndex = ownIndex;
      }
    }
    if (cfgControl(cfg, prop, value) && !value.hasOwnProperty("__m__")) {
      value = this.pxying(originPar)(value);
      // if (
      //   $cfg === "root" &&
      //   Object.prototype.toString.call(value) === "[object Object]"
      // ) {
      //   const { divideIndex, components } = value;
      //   const cfgIndex = Number(prop);
      //   const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
      //   const cfgProps = {
      //     cfgIndex,
      //     ownIndex,
      //     cfg,
      //     divideIndex,
      //   };
      //   const _originPar = {
      //     cfgProps,
      //     forceUpdata: this.forceUpdate,
      //     components,
      //   };
      //   originPar = _originPar;
      // }
      // cfgDecorator(value, prop, originPar, this.willDealData);
    }
    this.forceUpdate();
    return value;
  };

  $delete = ((that) =>
    function (prop) {
      delete this[prop];
      that.forceUpdate();
    })(this);

  $set = ((that) =>
    function (prop, value) {
      if (window.Proxy) {
        this[prop] = value;
      } else {
        this[prop] = that.polyfillProxyCb(value, prop, this);
        polyfillProxy(this, that.polyfillProxyCb);
      }
    })(this);

  //给对象和数组添加不可枚举的原型方法
  addFunctionToProto = (proto) => {
    return Object.create(proto, {
      $set: {
        value: this.$set,
        enumerable: false,
      },
      $delete: {
        value: this.$delete,
        enumerable: false,
      },
    });
  };

  overwriteObjectMethod = () => {
    return this.addFunctionToProto(objectProto);
  };

  overwriteArrayMethod = () => {
    const createArrayProto = this.addFunctionToProto(arrayProto);
    if (!window.Proxy) {
      methodsToPatch.forEach((method) => {
        const that = this;
        createMark(createArrayProto, method, function (...args) {
          let insertData = [];
          switch (method) {
            case "push":
            case "unshift":
              insertData = args.splice(0);
              break;
            case "splice":
              insertData = args.splice(2);
              break;
          }
          const _args = insertData.map((item) => {
            return that.pxying(item);
          });
          const methodReturn = arrayProto[method].apply(this, [
            ...args,
            ..._args,
          ]);
          if (insertData.length) {
            // 兼容IE
            polyfillProxy(this, that.polyfillProxyCb);
            that.forceUpdate();
          }
          return methodReturn;
        });
      });
    }
    return createArrayProto;
  };

  pxying = (props) => {
    const innerPxying = (config, key, status = "child") => {
      if (typeof config !== "object" || config === null) return config;
      if (!config.__m__) {
        if (Array.isArray(config))
          Object.setPrototypeOf(config, this.createArrayProto);
        if (Object.prototype.toString.call(config) === "[object Object]") {
          Object.setPrototypeOf(config, this.createObjectProto);
        }
        createMark(config, "__m__", {
          $cfg: "cid",
          originProps: {},
          originPar: props,
          propsIndexs: {},
        });
      }
      const proxyConfig = polyfillProxy(config, this.polyfillProxyCb);
      if (status === "root") {
        props.cfgProps.cfg = proxyConfig;
      }
      for (const cfg in config) {
        const every = config[cfg];
        if (key === "components") {
          props = { ...props, cmptProps: { cmpt: every, cmptIndex: cfg } };
        }
        cfgDeal(proxyConfig, cfg, every, props, this.willDealData);
        if (cfg !== "type" && !/^\$.*/.test(cfg)) {
          config[cfg] = innerPxying(every, cfg);
        }
      }
      return proxyConfig;
    };
    return innerPxying;
  };

  initConfig = (config = []) => {
    config.forEach((cfg, cfgIndex) => {
      const { divideIndex, components } = cfg;
      const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
      const props = {
        cfgProps: {
          cfgIndex,
          ownIndex,
          cfg,
          divideIndex,
        },
        forceUpdata: this.forceUpdate,
      };
      config[cfgIndex] = this.pxying(props)(cfg, cfgIndex, "root");
    });
    if (!config.__m__) {
      createMark(config, "__m__", {
        $cfg: "root",
        originProps: {},
        originPar: {},
        propsIndexs: {},
      });
      Object.setPrototypeOf(config, this.createArrayProto);
    }
    return polyfillProxy(config, this.polyfillProxyCb);
  };

  add = (index) => (component) => {
    this.proxyConfig.splice(index + 1, 0, component);
  };
  minus = (index) => () => {
    this.proxyConfig.splice(index, 1);
  };

  getInnerHooks = (type) => {
    if (type !== "mmmmmmmm_innerHooks") return console.error("innerHooks");
    return {
      setRegister: this.setRegister,
      add: this.add,
      minus: this.minus,
      getWillDealData: this.getWillDealData,
    };
  };

  getConfig = () => {
    const inited = {
      getInnerHooks: this.getInnerHooks,
      forceUpdate: this.forceUpdate,
    };
    createMark(inited.__proto__, "mmm_mark", "MMMM_INNER");
    return [this.proxyConfig, inited];
  };
}

function insertFormObject(inserter = {}, beInsert) {
  for (const prop in inserter) {
    beInsert[prop] = inserter[prop];
  }
  return beInsert;
}

function useConfigForm(config, depend, inited, inserter) {
  if (
    Object.prototype.toString.call(inited) === "[object Object]" &&
    inited.mmm_mark === "MMMM_INNER"
  ) {
    return React.useMemo(() => {
      const _target = insertFormObject(inserter, inited);
      return [config, _target];
    }, [config, inited]);
  }
  return React.useMemo(() => {
    const [proxyConfig, inited] = new CreateConfig(config).getConfig();
    const _target = insertFormObject(inserter, inited);
    return [proxyConfig, _target];
  }, depend);
}

export { useConfigForm };
