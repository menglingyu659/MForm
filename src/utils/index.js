export const hasProxy = window.Proxy;

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
    set: (target, prop, value, receiver) => {
      Reflect.set(target, prop, callback(value, prop, receiver));
      return true;
    },
  });
}

export function polyfillProxy(config, callback) {
  if (typeof config !== "object" || config === null) return config;
  let initedConfig;
  if (hasProxy) {
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

export function dealOriginProps(originProps, cfg, value, prop) {
  const { $cfg } = cfg.__m__;
  if (prop === "components") {
    originProps.components = value;
    return originProps;
  }
  if ($cfg === "components") {
    return {
      ...originProps,
      cmptProps: {
        cmpt: value,
        cmptIndex: Number(prop),
      },
    };
  }
  if ($cfg === "root") {
    const cfgIndex = Number(prop);
    const { divideIndex, components } = value;
    const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
    return {
      ...originProps,
      cfgProps: {
        cfg: value,
        cfgIndex,
        ownIndex,
        divideIndex,
      },
      components,
    };
  }
  return originProps;
}

export function dealData(willDealData) {
  const { active, bind, other } = willDealData;
  active.forEach((act) => {
    const { origin, prop, value, props } = act;
    if (typeof value === "function") {
      const newVla = value(props);
      origin[prop] = getDealData(newVla);
    }
  });
  bind.forEach((bid) => {
    const { origin, prop, value, props } = bid;
    const newVla = overwriteMethod(value, props);
    origin[prop] = getDealData(newVla);
    delete origin.__m__.propsIndexs[`bind$_m_$${prop}`];
  });
  other.forEach((oth) => {
    const { origin, prop, value } = oth;
    const reg = /^\$(.*)/;
    reg.test(prop);
    const _prop = RegExp.$1;
    const _value = getDealData(value);
    origin.$set(_prop, _value);
    delete origin[prop];
    delete origin.__m__.propsIndexs[`other$_m_$${prop}`];
  });
  willDealData.bind = [];
  willDealData.other = [];
}

function removeing(propsIndexs, prop, status, willDealData) {
  const pp = `active$_m_$${prop}`;
  const index = propsIndexs[pp];
  delete willDealData[status][index];
  delete propsIndexs[pp];
}

export function removeOriginDealDataRunner(cfg, prop, willDealData) {
  if (!cfg.hasOwnProperty("__m__")) return cfg;
  const { propsIndexs } = cfg.__m__;
  if (propsIndexs.hasOwnProperty(`active$_m_$${prop}`))
    removeing(propsIndexs, prop, "active", willDealData);
  // else if (propsIndexs.hasOwnProperty(`bind$_m_$${prop}`))
  //   removeing(propsIndexs, `bind$_m_$${prop}`, "bind", willDealData);
  // else if (propsIndexs.hasOwnProperty(`other$_m_$${prop}`))
  //   removeing(propsIndexs, `other$_m_$${prop}`, "other", willDealData);
  return cfg;
}

export function removeOriginDealData(cfg, willDealData) {
  if (!cfg.hasOwnProperty("__m__")) return cfg;
  for (const prop in cfg) {
    removeOriginDealDataRunner(cfg, prop, willDealData);
    if (cfgControl(prop, cfg[prop])) {
      removeOriginDealData(cfg[prop], willDealData);
    }
  }
  return cfg;
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
        cmptProps: { cmpt: value, cmptIndex: Number(prop) },
      };
    }
    cfgDeal(cfg, prop, value, originProps, willDealData);
    if (cfgControl(prop, value)) {
      //递归对象
      cfgDecorator(value, prop, originProps, willDealData);
    }
  }
  return cfg;
}

export function configDecorator(config = [], forceUpdate) {
  const willDealData = { active: [], bind: [], other: [] };
  config.forEach((cfg, cfgIndex) => {
    if (Object.prototype.toString.call(cfg) === "[object Object]") {
      const { divideIndex, components } = cfg;
      const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
      const originProps = {
        cfgProps: {
          cfg,
          cfgIndex,
          ownIndex,
          divideIndex,
        },
        forceUpdate,
        components,
      };
      cfgDecorator(cfg, cfgIndex, originProps, willDealData);
    }
  });
  config.__m__.originProps = {
    forceUpdate,
  };
  return willDealData;
}

export function cfgControl(prop, value) {
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

class BinaryTree {
  constructor(coll) {
    this.stack = [];
    this.root = null;
    this.createBinaryTree(coll);
  }

  static BinaryTree(value) {
    this.value = value;
    this.left = this.right = null;
  }

  insertNode(value) {
    const node = new BinaryTree.BinaryTree(value);
    this.stack.push(node);
    if (this.root === null) {
      this.root = node;
    } else {
      this.inset(node);
    }
  }

  inset(node) {
    if (this.stack[0].left === null) {
      this.stack[0].left = node;
    } else {
      this.stack.shift().right = node;
    }
  }

  createBinaryTree(coll) {
    for (const prop in coll) {
      this.insertNode(coll[prop]);
    }
    return this;
  }
}

export function compare(origin, target) {
  let result;
  if (Object.is(origin, target)) result = true;
  else if (
    !Object.is(
      Object.prototype.toString.call(origin),
      Object.prototype.toString.call(target)
    )
  ) {
    result = [{ type: "change", origin, target }];
  } else {
    result = [];
  }
  return result;
}

function resetIndex(config) {
  const { $cfg } = config.__m__;
  if ($cfg === "root") {
    config.forEach((cfg, cfgIndex) => {
      const {
        divideIndex,
        components,
        __m__: { originProps },
      } = cfg;
      const ownIndex = divideIndex ? cfgIndex - divideIndex : undefined;
      originProps.cfgProps = {
        cfg,
        cfgIndex,
        ownIndex,
        divideIndex,
      };
      originProps.components = components;
    });
  } else if ($cfg === "components") {
    config.forEach((cfg, cmptIndex) => {
      cfg.__m__.originProps.cmptProps = {
        cmpt: cfg,
        cmptIndex: Number(cmptIndex),
      };
    });
  }
}

export function diff(origin, target, willDealData) {
  const { $cfg, originProps: _originProps } = target.__m__;
  const flag = ["root", "components"].includes($cfg);
  const originProps = flag ? { ..._originProps } : _originProps;
  origin.forEach((item, index) => {
    if (!target.includes(item)) {
      //删除
      if (cfgControl(index, item)) {
        removeOriginDealData(item, willDealData);
      } else {
        removeOriginDealDataRunner(target, index, willDealData);
      }
    }
  });
  target.forEach((item, index) => {
    if (!origin.includes(item)) {
      //添加
      if (cfgControl(index, item)) {
        cfgDecorator(item, index, originProps, willDealData);
      } else {
        cfgDeal(target, index, item, originProps, willDealData);
      }
    }
  });

  if (flag) {
    resetIndex(target);
  }
}
