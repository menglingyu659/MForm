export function overwriteMethods(originElement, configIndex, ownIndex) {
  const reg = /^on.*/;
  for (const prop in originElement) {
    const item = originElement[prop];
    if (typeof item === "function" && reg.test(item.name)) {
      originElement[prop] = function(...args) {
        item.apply(this, args.concat(configIndex, ownIndex));
      };
    }
  }
  return originElement;
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
