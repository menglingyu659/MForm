"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProto = void 0;

var _useFormConfig = require("./useFormConfig");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var arrayProto = Array.prototype;
var createProto = Object.create(arrayProto);
exports.createProto = createProto;
var methodsToPatch = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
var createConfig = new _useFormConfig.CreateConfig();
methodsToPatch.forEach(function (method) {
  createProto[method] = function () {
    var configIndex = this.configIndex,
        ownIndex = this.ownIndex,
        $cfg = this.$cfg;

    var insertData, _args;

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

    if (args) {
      _args = args.map(function (item) {
        return _typeof(item) === "object" ? createConfig.pxying(configIndex, ownIndex)(item) : item;
      });
    }

    return arrayProto[method].apply(this, [].concat(args, _toConsumableArray(_args)));
  };
});