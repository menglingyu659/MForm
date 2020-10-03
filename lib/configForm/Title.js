"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/es/icon/style/css");

var _icon = _interopRequireDefault(require("antd/es/icon"));

require("antd/es/typography/style/css");

var _typography = _interopRequireDefault(require("antd/es/typography"));

var _react = _interopRequireDefault(require("react"));

var _utils = require("./utils");

var _jsxFileName = "C:\\Users\\13298\\Desktop\\c-form\\src\\configForm\\Title.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Text = _typography["default"].Text;

function Title(props) {
  var ownIndex = props.ownIndex,
      configIndex = props.configIndex,
      title = props.title,
      _props$innerHooks = props.innerHooks;
  _props$innerHooks = _props$innerHooks === void 0 ? {} : _props$innerHooks;
  var add = _props$innerHooks.add,
      minus = _props$innerHooks.minus,
      _props$title = props.title;
  _props$title = _props$title === void 0 ? {} : _props$title;

  var content = _props$title.content,
      isShowAdd = _props$title.isShowAdd,
      isShowMinus = _props$title.isShowMinus,
      render = _props$title.render,
      onAddClick = _props$title.onAddClick,
      onMinusClick = _props$title.onMinusClick,
      methods = _props$title.methods,
      titleProps = _objectWithoutProperties(_props$title, ["content", "isShowAdd", "isShowMinus", "render", "onAddClick", "onMinusClick", "methods"]);

  var newMethods = methods && (0, _utils.overwriteMethods)(methods, configIndex, ownIndex);
  var addCallback = add(configIndex);
  var minusCallback = minus(configIndex);
  return /*#__PURE__*/_react["default"].createElement("span", {
    className: "m-title",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 5
    }
  }, title ? _typeof(title) === "object" ? typeof render === "function" ? render({
    configIndex: configIndex,
    ownIndex: ownIndex,
    addCallback: addCallback,
    minusCallback: minusCallback
  }) : /*#__PURE__*/_react["default"].createElement(Text, _extends({
    strong: true
  }, titleProps, newMethods, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35,
      columnNumber: 13
    }
  }), content) : /*#__PURE__*/_react["default"].createElement(Text, {
    strong: true,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 11
    }
  }, title) : null, (typeof isShowAdd === "function" ? isShowAdd(configIndex, ownIndex) : isShowAdd) && /*#__PURE__*/_react["default"].createElement("span", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46,
      columnNumber: 9
    }
  }, "\xA0\xA0", /*#__PURE__*/_react["default"].createElement(_icon["default"], {
    type: "plus-circle",
    style: {
      cursor: "pointer"
    },
    onClick: function onClick() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      typeof onAddClick === "function" && onAddClick.apply(this, [addCallback, configIndex, ownIndex].concat(args));
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48,
      columnNumber: 11
    }
  })), (typeof isShowMinus === "function" ? isShowMinus(configIndex, ownIndex) : isShowMinus) && /*#__PURE__*/_react["default"].createElement("span", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66,
      columnNumber: 9
    }
  }, "\xA0\xA0", /*#__PURE__*/_react["default"].createElement(_icon["default"], {
    type: "minus-circle-o",
    style: {
      cursor: "pointer"
    },
    onClick: function onClick() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      typeof onMinusClick === "function" && onMinusClick.apply(this, [minusCallback, configIndex, ownIndex].concat(args));
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68,
      columnNumber: 11
    }
  })));
}

var _default = Title;
exports["default"] = _default;