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

export function overwriteMethods(methods, configIndex, ownIndex) {
  if (!methods) return methods;
  const newMethods = { ...methods };
  for (const prop in newMethods) {
    const item = newMethods[prop];
    if (typeof item === "function") {
      newMethods[prop] = function (...args) {
        return item.apply(this, args.concat(configIndex, ownIndex));
      };
    }
  }
  return newMethods;
}

function IEProxy(config, createConfig) {
  for (const cfg in config) {
    let value = config[cfg];
    Object.defineProperty(config, cfg, {
      get() {
        return value;
      },
      set(newValue) {
        if (typeof newValue === "object" && !newValue.hasOwnProperty("__m__"))
          newValue = createConfig.pxying(newValue);
        createConfig.forceUpdate();
        value = newValue;
      },
    });
  }
  return config;
}

function webkit(config, createConfig) {
  return new Proxy(config, {
    get: (target, prop) => {
      return Reflect.get(target, prop);
    },
    set: (target, prop, value) => {
      if (typeof value === "object" && !value.hasOwnProperty("__m__"))
        value = createConfig.pxying(value);
      Reflect.set(target, prop, value);
      createConfig.forceUpdate();
      return true;
    },
  });
}

export function polyfillProxy(config, createConfig) {
  if (typeof config !== "object") return config;
  let initedConfig;
  if (window.Proxy) {
    initedConfig = webkit(config, createConfig);
  } else {
    // 兼容IE
    initedConfig = IEProxy(config, createConfig);
  }
  return initedConfig;
}
