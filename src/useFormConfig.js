import React from "react";
import { polyfillProxy } from "./utils";

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

  $set = ((that) => {
    return function (prop, value) {
      if (window.Proxy) {
        this[prop] = value;
      } else {
        value = that.pxying(value);
        this[prop] = value;
        polyfillProxy(this, that);
        that.forceUpdate();
      }
    };
  })(this);

  overwriteObjectMethod = () => {
    return Object.create(objectProto, {
      $set: {
        value: this.$set,
        enumerable: false,
      },
    });
  };

  overwriteArrayMethod = () => {
    const createArrayProto = Object.create(arrayProto, {
      $set: {
        value: this.$set,
        enumerable: false,
      },
    });
    methodsToPatch.forEach((method) => {
      const that = this;
      this.createMark(createArrayProto, method, function (...args) {
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
        if (insertData.length && !window.Proxy) {
          // 兼容IE
          polyfillProxy(this, that);
          that.forceUpdate();
        }
        return methodReturn;
      });
    });
    return createArrayProto;
  };

  createMark = (originObjorArr, key = "__m__", values = {}) => {
    Object.defineProperty(originObjorArr, key, {
      value: values,
      enumerable: false,
    });
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
  //       this.createMark(config, "__m__", {
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
      this.createMark(config, "__m__", { $cfg: "cid" });
    }
    for (const cfg in config) {
      const every = config[cfg];
      config[cfg] = this.pxying(every);
    }
    return polyfillProxy(config, this);
  };

  initConfig = (config = []) => {
    const initedConfig = config.map((item) => {
      return this.pxying(item);
    });
    if (!config.__m__) {
      this.createMark(initedConfig, "__m__", { $cfg: "root" });
      Object.setPrototypeOf(initedConfig, this.createArrayProto);
    }
    return polyfillProxy(initedConfig, this);
  };

  add = (index) => (component) => {
    this.proxyConfig.splice(index + 1, 0, component);
  };
  minus = (index) => () => {
    this.proxyConfig.splice(index, 1);
  };

  getInnerHooks = (type) => {
    if (type !== "menglingyu_innerHooks") return console.error("innerHooks");
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
      const [_config, inited] = new CreateConfig(config).getConfig();
      const _target = insertFormObject(inserter, inited);
      configRef.current = [_config, _target];
    }
  }
  return configRef.current;
}

export { useFormConfig };
