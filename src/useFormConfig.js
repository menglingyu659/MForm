import React from "react";
import { createMark, polyfillProxy } from "./utils";

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
    // this.keying(config);
    if (config) {
      this.createObjectProto = this.overwriteObjectMethod();
      this.createArrayProto = this.overwriteArrayMethod();
      this.proxyConfig = this.initConfig(config);
    }
  }

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
  polyfillProxyCb = (value) => {
    if (value.mark === "mmm_init") return value.value;
    if (typeof value === "object" && !value.hasOwnProperty("__m__"))
      value = this.pxying(value);
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
        if (value.mark === "mmm_init") {
          this[prop] = value.value;
          return;
        }
        if (this.__m__.originProps[prop] && value.mark !== "mmm_init") {
          this.__m__.originProps[prop] = value;
        }
        value = that.pxying(value);
        this[prop] = value;
        polyfillProxy(this, that.polyfillProxyCb);
        that.forceUpdate();
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

  // overwriteMethods = (originOnFunction, configIndex, ownIndex) => {
  //   return function(...args) {
  //     return originOnFunction.apply(this, [...args, configIndex, ownIndex]);
  //   };
  // };

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
  pxying = (config) => {
    if (typeof config !== "object") return config;
    if (!config.__m__) {
      if (Array.isArray(config))
        Object.setPrototypeOf(config, this.createArrayProto);
      if (Object.prototype.toString.call(config) === "[object Object]") {
        Object.setPrototypeOf(config, this.createObjectProto);
      }
      createMark(config, "__m__", { $cfg: "cid", originProps: {} });
    }
    for (const cfg in config) {
      const every = config[cfg];
      config[cfg] = this.pxying(every);
    }
    return polyfillProxy(config, this.polyfillProxyCb);
  };

  initConfig = (config = []) => {
    config.forEach((item, index) => {
      config[index] = this.pxying(item);
    });
    if (!config.__m__) {
      createMark(config, "__m__", { $cfg: "root", originProps: {} });
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
    };
  };

  getConfig = () => {
    return [this.proxyConfig, { getInnerHooks: this.getInnerHooks }];
  };
}

function insertFormObject(inserter = {}, beInsert) {
  for (const prop in inserter) {
    beInsert[prop] = inserter[prop];
  }
  return beInsert;
}

function useFormConfig(config, inited, inserter) {
  const configRef = React.useRef();
  if (!configRef.current) {
    if (inited && inserter) {
      const _target = insertFormObject(inserter, inited);
      configRef.current = [config, _target];
    } else {
      const [proxyConfig, inited] = new CreateConfig(config).getConfig();
      const _target = insertFormObject(inserter, inited);
      configRef.current = [proxyConfig, _target];
    }
  }
  return configRef.current;
}

export { useFormConfig };
