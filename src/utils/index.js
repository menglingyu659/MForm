export function overwriteMethod(originOnFunction, par) {
  return function (...args) {
    return originOnFunction.apply(this, [par, ...args]);
  };
}

function IEProxy(config, callback) {
  for (const prop in config) {
    let value = config[prop];
    Object.defineProperty(config, prop, {
      get() {
        return value;
      },
      set(newValue) {
        // console.log(newValue, "config");
        value = callback(newValue, prop, config);
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
      Reflect.set(target, prop, callback(value, prop, target));
      return true;
    },
  });
}

export function polyfillProxy(config, callback) {
  if (typeof config !== "object" || config === null) return config;
  let initedConfig;
  if (!window.Proxy) {
    initedConfig = webkit(config, callback);
  } else {
    // 兼容IE
    initedConfig = IEProxy(config, callback);
  }
  return initedConfig;
}

export function getDealData(newVla) {
  return {
    value: newVla,
    mark: "mmm_init",
  };
}

export function dealOriginProps(originProps, cfg, prop) {
  if (prop === "components") {
    originProps.components = cfg;
  }
}

export function dealData(willDealData) {
  const { active, bind, other } = willDealData;
  active.forEach(({ origin, prop, value, props }) => {
    if (typeof value === "function") {
      const newVla = value(props);
      origin[prop] = getDealData(newVla);
    }
  });
  bind.forEach(({ origin, prop, value, props }) => {
    const newVla = overwriteMethod(value, props);
    origin[prop] = getDealData(newVla);
  });
  other.forEach(({ origin, prop, value }) => {
    /^\$(.*)/.test(prop);
    const _prop = RegExp.$1;
    const _value = getDealData(value);
    origin.$set(_prop, _value);
    delete origin[prop];
  });
}

function removeing(propsIndexs, prop, status, willDealData) {
  const index = propsIndexs[prop];
  willDealData[status].splice(index, 1);
  delete propsIndexs[prop];
}

export function removeOriginDealDataRunner(cfg, prop, willDealData) {
  const { propsIndexs } = cfg.__m__;
  if (propsIndexs.hasOwnProperty(`active$_m_$${prop}`))
    removeing(propsIndexs, `active$_m_$${prop}`, "active", willDealData);
  else if (propsIndexs.hasOwnProperty(`bind$_m_$${prop}`))
    removeing(propsIndexs, `bind$_m_$${prop}`, "bind", willDealData);
  else if (propsIndexs.hasOwnProperty(`other$_m_$${prop}`))
    removeing(propsIndexs, `other$_m_$${prop}`, "other", willDealData);
}

export function removeOriginDealData(cfg, willDealData) {
  for (const prop in cfg) {
    removeOriginDealDataRunner(cfg, prop, willDealData);
    if (cfgControl(cfg, prop, cfg[prop])) {
      removeOriginDealData(cfg[prop], willDealData);
    }
  }
}

export function cfgDeal(cfg, prop, value, props, willDealData) {
  if (typeof value === "function" && !/^(on|type|handle|\$).*/.test(prop)) {
    //处理动态绑定，children,render情况
    const cell = {
      origin: cfg,
      prop,
      value,
      props,
    };
    willDealData.active.push(cell);
    const propIndex = willDealData.active.indexOf(cell);
    cfg.__m__.propsIndexs[`active$_m_$${prop}`] = propIndex;
  } else if (typeof value === "function" && /^on.*/.test(prop)) {
    //处理原生js事件
    const cell = {
      origin: cfg,
      prop,
      value,
      props,
    };
    willDealData.bind.push(cell);
    const propIndex = willDealData.bind.indexOf(cell);
    cfg.__m__.propsIndexs[`bind$_m_$${prop}`] = propIndex;
  } else if (/^\$(.*)/.test(prop)) {
    //处理第三方数据
    const cell = {
      origin: cfg,
      prop,
      value,
      props,
    };
    willDealData.other.push(cell);
    const propIndex = willDealData.other.indexOf(cell);
    cfg.__m__.propsIndexs[`other$_m_$${prop}`] = propIndex;
  }
  return cfg;
}

export function cfgDecorator(cfg, key, originProps, willDealData) {
  if (typeof cfg !== "object" || cfg === null) return cfg;
  cfg.__m__.originProps = originProps;
  for (const prop in cfg) {
    const value = cfg[prop];
    if (key === "components") {
      originProps = {
        ...originProps,
        cmptProps: { cmpt: value, cmptIndex: prop },
      };
    }
    cfgDeal(cfg, prop, value, originProps, willDealData);
    if (cfgControl(cfg, prop, value)) {
      //递归对象
      cfgDecorator(value, prop, originProps, willDealData);
    }
  }
  return cfg;
}

export function configDecorator(config = [], forceUpdata) {
  const willDealData = { active: [], bind: [], other: [] };
  config.forEach((cfg, cfgIndex) => {
    if (Object.prototype.toString.call(cfg) === "[object Object]") {
      const { divideIndex, components } = cfg;
      const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
      const originProps = {
        cfgProps: {
          cfgIndex,
          ownIndex,
          cfg,
          divideIndex,
        },
        forceUpdata,
        components,
      };
      cfgDecorator(cfg, cfgIndex, originProps, willDealData);
    }
  });
  return willDealData;
}

export function cfgControl(cfg, prop, value) {
  return (
    typeof value === "object" &&
    value !== null &&
    prop !== "type" &&
    !/^\$.*/.test(prop)
  );
}

export function validatorKey(keys, index) {
  keys = Array.isArray(keys) ? keys : [keys];
  let key = index;
  keys.forEach((k) => {
    if (![undefined, null].includes(k)) {
      key = k;
    }
  });
  return key;
}

//创建__m__对象
export function createMark(originObjorArr, key = "__m__", values = {}) {
  Object.defineProperty(originObjorArr, key, {
    value: values,
    enumerable: false,
  });
  return originObjorArr;
}

export function cfgIndexReset(config = []) {
  config.forEach((cfg, cfgIndex) => {
    const { cfgProps } = cfg.__m__.originProps;
    const { divideIndex } = cfg;
    const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
    cfgProps.cfgIndex = cfgIndex;
    cfgProps.ownIndex = ownIndex;
  });
}

export function changeWillDealData(cfg, prop, value, willDealData) {
  for (const prop in deleteData) {
  }
}
