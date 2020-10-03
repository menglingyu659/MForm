"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFormItemContent = createFormItemContent;

require("antd/es/input/style/css");

var _input = _interopRequireDefault(require("antd/es/input"));

require("antd/es/select/style/css");

var _select = _interopRequireDefault(require("antd/es/select"));

var _react = _interopRequireDefault(require("react"));

var _utils = require("./utils");

var _jsxFileName = "C:\\Users\\13298\\Desktop\\c-form\\src\\configForm\\createFormItemContent.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Option = _select["default"].Option,
    OptGroup = _select["default"].OptGroup;

function createFormItemContent(props) {
  var _this = this;

  var configIndex = props.configIndex,
      ownIndex = props.ownIndex,
      element = props.element,
      _props$element = props.element;
  _props$element = _props$element === void 0 ? {} : _props$element;

  var _props$element$type = _props$element.type,
      Com = _props$element$type === void 0 ? _input["default"] : _props$element$type,
      options = _props$element.options,
      children = _props$element.children,
      group = _props$element.group,
      methods = _props$element.methods,
      elementProps = _objectWithoutProperties(_props$element, ["type", "options", "children", "group", "methods"]);

  var newMethods = methods && (0, _utils.overwriteMethods)(methods, configIndex, ownIndex);
  return typeof element === "function" ? element({
    configIndex: configIndex,
    ownIndex: ownIndex
  }) : /*#__PURE__*/_react["default"].createElement(Com, _extends({}, elementProps, newMethods, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26,
      columnNumber: 5
    }
  }), typeof children === "function" ? children({
    configIndex: configIndex,
    ownIndex: ownIndex
  }) : options ? group ? /*#__PURE__*/_react["default"].createElement(OptGroup, {
    label: group,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 11
    }
  }, options.map(function (_ref, comIndex) {
    var id = _ref.id,
        label = _ref.label,
        value = _ref.value;
    return /*#__PURE__*/_react["default"].createElement(Option, {
      key: id || comIndex,
      value: value,
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34,
        columnNumber: 17
      }
    }, label);
  })) : options.map(function (_ref2, comIndex) {
    var id = _ref2.id,
        label = _ref2.label,
        value = _ref2.value;
    return /*#__PURE__*/_react["default"].createElement(Option, {
      key: id || comIndex,
      value: value,
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43,
        columnNumber: 15
      }
    }, label);
  }) : null);
}