// export function overwriteMethods(methods, configIndex, ownIndex) {
//   if (!methods) return methods;
//   const newMethods = { ...methods };
//   const reg = /^(on|handle).*/;
//   for (const prop in newMethods) {
//     const item = newMethods[prop];
//     console.log(item.name, "item.name");

//     if (typeof item === "function" && reg.test(item.name)) {
//       newMethods[prop] = function (...args) {
//         return item.apply(this, args.concat(configIndex, ownIndex));
//       };
//     }
//   }
//   return newMethods;
// }

export function overwriteMethods(methods, par) {
  if (!methods) return methods;
  const newMethods = { ...methods };
  for (const prop in newMethods) {
    const item = newMethods[prop];
    if (typeof item === "function") {
      newMethods[prop] = function (...args) {
        return item.apply(this, [par, ...args]);
      };
    }
  }
  return newMethods;
}

function IEProxy(config, callback) {
  for (const cfg in config) {
    let value = config[cfg];
    Object.defineProperty(config, cfg, {
      get() {
        return value;
      },
      set(newValue) {
        value = callback(newValue);
      },
    });
  }
  return config;
}

function webkit(config, callback) {
  return new Proxy(config, {
    get: (target, prop) => {
      return Reflect.get(target, prop);
    },
    set: (target, prop, value) => {
      Reflect.set(target, prop, callback(value));
      return true;
    },
  });
}

export function polyfillProxy(config, callback) {
  if (typeof config !== "object") return config;
  let initedConfig;
  if (window.Proxy) {
    initedConfig = webkit(config, callback);
  } else {
    // 兼容IE
    initedConfig = IEProxy(config, callback);
  }
  return initedConfig;
}

function cfgDeal(cfg, prop, value, newVla) {
  cfg.__m__.originProps = {
    ...cfg.__m__.originProps,
    [prop]: value,
  };
  return {
    value: newVla,
    mark: "mmm_init",
  };
}

function cfgDecorator(cfg, par) {
  for (const prop in cfg) {
    const value = cfg.__m__.originProps[prop] || cfg[prop];
    if (typeof value === "function" && !/^(on|type).*/.test(prop)) {
      const newVla = value(par);
      cfg[prop] = cfgDeal(cfg, prop, value, newVla);
    } else if (
      prop === "methods" &&
      Object.prototype.toString.call(value) === "[object Object]"
    ) {
      const newVla = overwriteMethods(value, par);
      cfg[prop] = cfgDeal(cfg, prop, value, newVla);
    } else if (typeof value === "object") {
      cfgDecorator(value, par);
    }
  }
  return cfg;
}

export function configDecorator(config = []) {
  config.forEach((cfg, configIndex) => {
    const { divideIndex } = cfg;
    const ownIndex = divideIndex ? configIndex - divideIndex : null;
    cfgDecorator(cfg, { configIndex, ownIndex });
  });
  return config;
}
