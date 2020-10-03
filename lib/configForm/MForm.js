"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/es/row/style/css");

var _row = _interopRequireDefault(require("antd/es/row"));

require("antd/es/col/style/css");

var _col = _interopRequireDefault(require("antd/es/col"));

require("antd/es/form/style/css");

var _form = _interopRequireDefault(require("antd/es/form"));

var _react = _interopRequireWildcard(require("react"));

var _createFormItemContent = require("./createFormItemContent");

var _useFormConfig3 = require("./useFormConfig");

var _utils = require("./utils");

var _Title = _interopRequireDefault(require("./Title"));

var _jsxFileName = "C:\\Users\\13298\\Desktop\\c-form\\src\\configForm\\MForm.js";

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var FormItem = _form["default"].Item;

function _MForm(props, ref) {
  var _this = this;

  var _props$config = props.config,
      config = _props$config === void 0 ? [] : _props$config,
      inited = props.inited,
      form = props.form,
      newProps = _objectWithoutProperties(props, ["config", "inited", "form"]);

  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      forceUpdata = _useState2[1];

  var getFieldDecorator = form.getFieldDecorator;

  var _useFormConfig = (0, _useFormConfig3.useFormConfig)(config, inited, {
    form: form
  }),
      _useFormConfig2 = _slicedToArray(_useFormConfig, 2),
      initedConfig = _useFormConfig2[0],
      setting = _useFormConfig2[1];

  (0, _react.useImperativeHandle)(ref, function () {
    return [initedConfig, setting];
  });
  var getInnerHooks = setting.getInnerHooks;
  var innerHooks = getInnerHooks("menglingyu_innerHooks");
  var setRegister = innerHooks.setRegister;
  (0, _react.useLayoutEffect)(function () {
    var unlisten = setRegister(function () {
      forceUpdata({});
    });
    return function () {
      unlisten();
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement(_form["default"], _extends({}, newProps, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 5
    }
  }), initedConfig.map(function (p, configIndex) {
    if (_typeof(p) !== "object" || p === null || Array.isArray(p)) return null;

    var id = p.id,
        title = p.title,
        components = p.components,
        divideIndex = p.divideIndex,
        _p$col = p.col,
        col = _p$col === void 0 ? {} : _p$col,
        boxSetting = _objectWithoutProperties(p, ["id", "title", "components", "divideIndex", "col"]);

    var ownIndex = divideIndex ? configIndex - divideIndex : null;
    return /*#__PURE__*/_react["default"].createElement("div", _extends({
      className: "m-box",
      key: id || configIndex
    }, boxSetting, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react["default"].createElement(_Title["default"], _extends({
      title: title,
      configIndex: configIndex,
      ownIndex: ownIndex,
      innerHooks: innerHooks
    }, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43,
        columnNumber: 13
      }
    })), /*#__PURE__*/_react["default"].createElement(_row["default"], {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 44,
        columnNumber: 13
      }
    }, components.map(function (innerProps, componentIndex) {
      var itemCol = innerProps.col,
          formItemLayout = innerProps.formItemLayout,
          id = innerProps.id,
          label = innerProps.label,
          name = innerProps.name,
          _innerProps$required = innerProps.required,
          required = _innerProps$required === void 0 ? true : _innerProps$required,
          getFieldDecoratorOptions = innerProps.getFieldDecoratorOptions,
          element = innerProps.element,
          antdSetting = _objectWithoutProperties(innerProps, ["col", "formItemLayout", "id", "label", "name", "required", "getFieldDecoratorOptions", "element"]);

      return /*#__PURE__*/_react["default"].createElement(_col["default"], _extends({
        key: id || componentIndex
      }, itemCol || col, {
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 60,
          columnNumber: 19
        }
      }), /*#__PURE__*/_react["default"].createElement(FormItem, _extends({
        label: label
      }, formItemLayout, antdSetting, {
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 61,
          columnNumber: 21
        }
      }), name ? getFieldDecorator(name, _objectSpread({
        rules: [{
          required: required,
          message: "".concat(label, "\u4E0D\u80FD\u4E3A\u7A7A")
        }]
      }, getFieldDecoratorOptions))((0, _createFormItemContent.createFormItemContent)({
        element: element,
        configIndex: configIndex,
        ownIndex: ownIndex
      })) : (0, _createFormItemContent.createFormItemContent)({
        element: element,
        configIndex: configIndex,
        ownIndex: ownIndex
      })));
    })));
  }));
}

var MForm = /*#__PURE__*/_react["default"].forwardRef(_MForm);

var _default = _form["default"].create("MForm")(MForm);

exports["default"] = _default;