"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormConfig = useFormConfig;
exports.CreateConfig = void 0;

var _react = _interopRequireDefault(require("react"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var arrayProto = Array.prototype;
var objectProto = Object.prototype;
var methodsToPatch = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];

var CreateConfig = function CreateConfig(_config2) {
  var _this = this;

  _classCallCheck(this, CreateConfig);

  _defineProperty(this, "forceUpdate", function () {
    _this.register.forEach(function (item) {
      typeof item === "function" && item();
    });
  });

  _defineProperty(this, "setRegister", function (register) {
    _this.register.push(register);

    var index = _this.register.length - 1;
    return function () {
      _this.register.splice(index);
    };
  });

  _defineProperty(this, "overwriteObjectMethod", function () {
    return Object.create(objectProto, {
      $set: {
        value: _this.$set,
        enumerable: false
      }
    });
  });

  _defineProperty(this, "overwriteArrayMethod", function () {
    var createArrayProto = Object.create(arrayProto, {
      $set: {
        value: _this.$set,
        enumerable: false
      }
    });
    methodsToPatch.forEach(function (method) {
      var that = _this;

      _this.createMark(createArrayProto, method, function () {
        var insertData = [];

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        switch (method) {
          case "push":
          case "unshift":
            insertData = args.splice(0);
            break;

          case "splice":
            insertData = args.splice(2);
            break;
        }

        var _args = insertData.map(function (item) {
          return that.pxying(item);
        });

        var methodReturn = arrayProto[method].apply(this, [].concat(args, _toConsumableArray(_args)));

        if (!window.Proxy) {
          // 兼容IE
          (0, _utils.polyfillProxy)(this, function () {
            that.forceUpdate();
          });
          that.forceUpdate();
        }

        return methodReturn;
      });
    });
    return createArrayProto;
  });

  _defineProperty(this, "createMark", function (originObjorArr) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "__m__";
    var values = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    Object.defineProperty(originObjorArr, key, {
      value: values,
      enumerable: false
    });
  });

  _defineProperty(this, "pxying", function (config) {
    if (_typeof(config) !== "object") return config;

    if (!config.__m__) {
      if (Array.isArray(config)) Object.setPrototypeOf(config, _this.createArrayProto);

      if (Object.prototype.toString.call(config) === "[object Object]") {
        Object.setPrototypeOf(config, _this.createObjectProto);
      }

      _this.createMark(config, "__m__", {
        $cfg: "cid"
      });
    }

    for (var cfg in config) {
      var every = config[cfg];
      config[cfg] = _this.pxying(every);
    }

    return (0, _utils.polyfillProxy)(config, function () {
      _this.forceUpdate();
    });
  });

  _defineProperty(this, "initConfig", function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var initedConfig = config.map(function (item) {
      return _this.pxying(item);
    });

    if (!config.__m__) {
      _this.createMark(initedConfig, "__m__", {
        $cfg: "root"
      });

      Object.setPrototypeOf(initedConfig, _this.createArrayProto);
    }

    return (0, _utils.polyfillProxy)(initedConfig, function () {
      _this.forceUpdate();
    });
  });

  _defineProperty(this, "add", function (index) {
    return function (component) {
      _this.proxyConfig.splice(index + 1, 0, component);
    };
  });

  _defineProperty(this, "minus", function (index) {
    return function () {
      _this.proxyConfig.splice(index, 1);
    };
  });

  _defineProperty(this, "getInnerHooks", function (type) {
    if (type !== "menglingyu_innerHooks") return console.error("innerHooks");
    return {
      config: _this.config,
      setRegister: _this.setRegister,
      add: _this.add,
      minus: _this.minus
    };
  });

  _defineProperty(this, "getConfig", function () {
    return [_this.proxyConfig, {
      getInnerHooks: _this.getInnerHooks
    }];
  });

  this.config = _config2;
  this.register = []; // this.keying(config);

  if (_config2) {
    this.createObjectProto = this.overwriteObjectMethod();
    this.createArrayProto = this.overwriteArrayMethod();
    this.proxyConfig = this.initConfig(_config2);
  }
};

exports.CreateConfig = CreateConfig;

function insertFormObject() {
  var inserter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var beInsert = arguments.length > 1 ? arguments[1] : undefined;

  for (var prop in inserter) {
    beInsert[prop] = inserter[prop];
  }

  return beInsert;
}

function useFormConfig(config, inited, inserter) {
  var configRef = _react["default"].useRef();

  if (!configRef.current) {
    if (inited && inserter) {
      var _target = insertFormObject(inserter, inited);

      configRef.current = [config, _target];
    } else {
      var _CreateConfig$getConf = new CreateConfig(config).getConfig(),
          _CreateConfig$getConf2 = _slicedToArray(_CreateConfig$getConf, 2),
          _config = _CreateConfig$getConf2[0],
          _inited = _CreateConfig$getConf2[1];

      var _target2 = insertFormObject(inserter, _inited);

      configRef.current = [_config, _target2];
    }
  }

  return configRef.current;
}