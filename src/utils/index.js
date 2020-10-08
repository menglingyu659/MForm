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

// export function overwriteMethods(methods, par) {
//   if (!methods) return methods;
//   const newMethods = { ...methods };
//   for (const prop in newMethods) {
//     const item = newMethods[prop];
//     if (typeof item === "function") {
//       newMethods[prop] = function (...args) {
//         return item.apply(this, [par, ...args]);
//       };
//     }
//   }
//   return newMethods;
// }

export function overwriteMethod(originOnFunction, par) {
  return function (...args) {
    return originOnFunction.apply(this, [par, ...args]);
  };
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
      if (target.__m__.originProps[prop] && value.mark !== "mmm_init") {
        target.__m__.originProps[prop] = undefined;
      }
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
  if (!cfg.__m__.originProps[prop]) {
    cfg.__m__.originProps[prop] = value;
  }
  return {
    value: newVla,
    mark: "mmm_init",
  };
}

function cfgDecorator(cfg, par, key) {
  for (const prop in cfg) {
    if (key === "components")
      par = { ...par, cmpt: cfg[prop], cmptIndex: prop };
    const value = cfg.__m__.originProps[prop] || cfg[prop];
    if (typeof value === "function" && !/^(on|type|handle).*/.test(prop)) {
      const newVla = value(par);
      cfg[prop] = cfgDeal(cfg, prop, value, newVla);
    } else if (typeof value === "function" && /^on.*/.test(prop)) {
      const newVla = overwriteMethod(value, par);
      cfg[prop] = cfgDeal(cfg, prop, value, newVla);
    } else if (typeof value === "object") {
      cfgDecorator(
        value,
        par,
        prop === "components" ? "components" : undefined
      );
    }
  }
  return cfg;
}

export function configDecorator(config = []) {
  config.forEach((cfg, cfgIndex) => {
    const { divideIndex } = cfg;
    const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
    cfgDecorator(cfg, { cfgIndex, ownIndex, cfg, divideIndex });
  });
  return config;
}
