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

function IEProxy(config, callback) {
  for (const cfg in config) {
    let value = config[cfg];
    Object.defineProperty(config, cfg, {
      get() {
        return value;
      },
      set(newValue) {
        callback();
        value = newValue;
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
      Reflect.set(target, prop, value);
      callback();
      return true;
    },
  });
}

export function polyfillProxy(config, callback) {
  let initedConfig;
  if (window.Proxy) {
    initedConfig = webkit(config, callback);
  } else {
    // 兼容IE
    initedConfig = IEProxy(config, callback);
  }
  return initedConfig;
}
