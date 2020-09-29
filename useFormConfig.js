import React from "react";
// import { createProto } from "./array";
const arrayProto = Array.prototype;
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
      this.createProto = this.overwriteArrayMethod();
      this.proxyConfig = this.initConfig(config);
    }
  }

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
  overwriteArrayMethod = () => {
    const createProto = Object.create(arrayProto);
    methodsToPatch.forEach((method) => {
      this.createMark(createProto, method, function(...args) {
        console.log("sub");
        const { configIndex, ownIndex, $cfg } = this.__m__;
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
          return typeof item === "object"
            ? this.pxying(configIndex, ownIndex)(item)
            : item;
        });
        return arrayProto[method].apply(this, [...args, ..._args]);
      });
    });
    return createProto;
  };

  createMark = (originObjorArr, key = "__m__", values = {}) => {
    Object.defineProperty(originObjorArr, key, {
      value: values,
      enumerable: false,
    });
  };

  overwriteMethods = (originOnFunction, configIndex, ownIndex) => {
    return function(...args) {
      return originOnFunction.apply(this, [...args, configIndex, ownIndex]);
    };
  };

  pxying = (configIndex, ownIndex) => {
    const innerPxying = (config) => {
      if (Array.isArray(config))
        Object.setPrototypeOf(config, this.createProto);
      this.createMark(config, "__m__", { configIndex, ownIndex, $cfg: "cid" });
      for (const cfg in config) {
        const every = config[cfg];
        config[cfg] =
          typeof every === "object"
            ? innerPxying(every)
            : typeof every === "function" && /^on.*/.test(every.name)
            ? this.overwriteMethods(every, configIndex, ownIndex)
            : every;
      }
      const proxyConfig = new Proxy(config, {
        get: (target, prop) => {
          return Reflect.get(target, prop);
        },
        set: (target, prop, value) => {
          Reflect.set(target, prop, value);
          this.register.forEach((item) => {
            typeof item === "function" && item();
          });
          return true;
        },
      });

      return proxyConfig;
    };
    return innerPxying;
  };

  initConfig = (config = []) => {
    const initedConfig = config.map((item, configIndex) => {
      const ownIndex = item.divideIndex ? configIndex - item.divideIndex : null;
      return this.pxying(configIndex, ownIndex)(item);
    });
    this.createMark(initedConfig, "__m__", { $cfg: "root" });
    Object.setPrototypeOf(initedConfig, this.createProto);
    return new Proxy(initedConfig, {
      get: (target, prop) => {
        return Reflect.get(target, prop);
      },
      set: (target, prop, value) => {
        Reflect.set(target, prop, value);
        this.register.forEach((item) => {
          typeof item === "function" && item();
        });
        return true;
      },
    });
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

// function useFormConfig(config, inited) {
//   const configRef = React.useRef();
//   if (!configRef.current) {
//     if (inited) {
//       configRef.current = [config, inited];
//     } else {
//       configRef.current = new CreateConfig(config).getConfig();
//     }
//   }
//   return configRef.current;
// }

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
