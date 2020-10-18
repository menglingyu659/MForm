import React from "react";
import {
  createMark,
  polyfillProxy,
  cfgControl,
  cfgDecorator,
  cfgIndexReset,
  cfgDeal,
  removeOriginDealData,
  removeOriginDealDataRunner,
  dealOriginProps,
  hasProxy,
} from "./utils";

const arrayProto = Array.prototype;
const objectProto = Object.prototype;
const methodsToPatch = [
  "shift",
  "pop",
  "sort",
  "reverse",
  "push",
  "unshift",
  "splice",
];

export class CreateConfig {
  constructor(config) {
    this.config = config;
    this.register = [];
    this.willDealData = {};
    // this.keying(config);
    if (config) {
      this.createObjectProto = this.overwriteObjectMethod();
      this.createArrayProto = this.overwriteArrayMethod();
      this.proxyConfig = this.initConfig(config);
    }
  }

  setWillDealData = (willDealData) => {
    this.willDealData = willDealData;
  };

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

  polyfillProxyCb = (value, prop, cfg) => {
    if (value.mark === "mmm_init") return value.value;
    const flag = cfg.hasOwnProperty(prop);
    const oValue = cfg[prop];
    let originProps =
      flag && oValue.__m__ ? oValue.__m__.originProps : cfg.__m__.originProps;
    if (cfgControl(cfg, prop, value)) {
      if (flag) removeOriginDealData(oValue, this.willDealData);
      value = value.hasOwnProperty("__m__") ? value : this.pxying(value);
      originProps = dealOriginProps(originProps, cfg, value, prop);
      cfgDecorator(value, prop, originProps, this.willDealData);
    } else {
      cfgDeal(cfg, prop, value, originProps, this.willDealData);
      if (flag) removeOriginDealDataRunner(cfg, prop, this.willDealData);
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
      if (hasProxy) {
        this[prop] = value;
      } else {
        if (this.hasOwnProperty(prop)) {
          this[prop] = value;
        } else {
          this[prop] = that.polyfillProxyCb(value, prop, this);
          polyfillProxy(this, that.polyfillProxyCb);
        }
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
    methodsToPatch.forEach((method) => {
      const that = this;
      createMark(createArrayProto, method, function (...args) {
        const flag = ["pop", "splice"].includes(method);
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
        const len = this.length;
        const _args = hasProxy
          ? insertData
          : insertData.map((item) => {
              const proxyValue = that.pxying(item);
              return proxyValue;
            });

        const methodReturn = arrayProto[method].apply(this, [
          ...args,
          ..._args,
        ]);
        if (flag && typeof methodReturn === "object" && methodReturn !== null) {
          removeOriginDealData(methodReturn, that.willDealData);
        }
        if (!hasProxy) {
          // 兼容IE
          let { originProps } = this.__m__;
          this.slice(len).forEach((item, index) => {
            originProps = dealOriginProps(originProps, this, item, index + len);
            cfgDecorator(item, index + len, originProps, that.willDealData);
          });
          if (insertData.length) polyfillProxy(this, that.polyfillProxyCb);
        }
        if (!hasProxy || flag) that.forceUpdate();
        return methodReturn;
      });
    });
    return createArrayProto;
  };

  // pxying = (configIndex, ownIndex) => {
  //   const innerPxying = (config) => {
  //     // if (typeof config === "function" && /^(on|handle).*/.test(config.name))
  //     //   return this.overwriteMethods(config, configIndex, ownIndex);
  //     if (typeof config !== "object") return config;
  //     if (!config.__m__) {
  //       if (Array.isArray(config))
  //         Object.setPrototypeOf(config, this.createArrayProto);
  //       if (Object.prototype.toString.call(config) === "[object Object]") {
  //         Object.setPrototypeOf(config, this.createObjectProto);
  //       }
  //       createMark(config, "__m__", {
  //         // configIndex,
  //         // ownIndex,
  //         $cfg: "cid",
  //       });
  //     }
  //     for (const cfg in config) {
  //       const every = config[cfg];
  //       config[cfg] = innerPxying(every);
  //     }
  //     return polyfillProxy(config, () => {
  //       this.forceUpdate();
  //     });
  //   };
  //   return innerPxying;
  // };
  pxying = (config, key) => {
    if (typeof config !== "object" || config === null) return config;
    if (!config.__m__) {
      if (Array.isArray(config))
        Object.setPrototypeOf(config, this.createArrayProto);
      if (Object.prototype.toString.call(config) === "[object Object]") {
        Object.setPrototypeOf(config, this.createObjectProto);
      }
      createMark(config, "__m__", {
        $cfg: key === "components" ? "components" : "cid",
        originProps: {},
        propsIndexs: {},
      });
    }
    for (const cfg in config) {
      if (cfg !== "type" && !/^\$.*/.test(cfg)) {
        const every = config[cfg];
        config[cfg] = this.pxying(every, cfg);
      }
    }
    return polyfillProxy(config, this.polyfillProxyCb);
  };

  initConfig = (config = []) => {
    config.forEach((item, index) => {
      config[index] = this.pxying(item);
    });
    if (!config.__m__) {
      createMark(config, "__m__", {
        $cfg: "root",
        originProps: {},
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
      setWillDealData: this.setWillDealData,
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

function useConfigForm(config, depend, ...args) {
  const [inited, inserter] = args;
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
