import React from "react";

class CreateConfig {
  constructor(config) {
    this.config = config;
    this.register = [];
    // this.keying(config);
    this.proxyConfig = this.initConfig(config);
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

  overwriteMethods = (originOnFunction, configIndex, ownIndex) => {
    return function (...args) {
      return originOnFunction.apply(this, [...args, configIndex, ownIndex]);
    };
  };

  pxying = (configIndex, ownIndex) => {
    const innerPxying = (config) => {
      for (const cfg in config) {
        const every = config[cfg];
        config[cfg] =
          typeof every === "object"
            ? innerPxying(every)
            : typeof every === "function" && /^on.*/.test(every.name)
            ? this.overwriteMethods(every, configIndex, ownIndex)
            : every;
      }
      return new Proxy(config, {
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
    return innerPxying;
  };

  initConfig = (config = []) => {
    const initedConfig = config.map((item, configIndex) => {
      const ownIndex = item.divideIndex ? configIndex - item.divideIndex : null;
      return this.pxying(configIndex, ownIndex)(item);
    });
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
