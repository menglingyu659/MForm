"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overwriteMethods = overwriteMethods;
exports.polyfillProxy = polyfillProxy;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
function overwriteMethods(methods, configIndex, ownIndex) {
  if (!methods) return methods;

  var newMethods = _objectSpread({}, methods);

  var _loop = function _loop(prop) {
    var item = newMethods[prop];

    if (typeof item === "function") {
      newMethods[prop] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return item.apply(this, args.concat(configIndex, ownIndex));
      };
    }
  };

  for (var prop in newMethods) {
    _loop(prop);
  }

  return newMethods;
}

function IEProxy(config, callback) {
  var _loop2 = function _loop2(cfg) {
    var value = config[cfg];
    Object.defineProperty(config, cfg, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        callback();
        value = newValue;
      }
    });
  };

  for (var cfg in config) {
    _loop2(cfg);
  }

  return config;
}

function webkit(config, callback) {
  return new Proxy(config, {
    get: function get(target, prop) {
      return Reflect.get(target, prop);
    },
    set: function set(target, prop, value) {
      Reflect.set(target, prop, value);
      callback();
      return true;
    }
  });
}

function polyfillProxy(config, callback) {
  var initedConfig;

  if (window.Proxy) {
    initedConfig = webkit(config, callback);
  } else {
    // 兼容IE
    initedConfig = IEProxy(config, callback);
  }

  return initedConfig;
}