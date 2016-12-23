(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["react-tiny-validator"] = factory(require("react"));
	else
		root["react-tiny-validator"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/es5/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(1);\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nvar defaultName = function defaultName() {\n  return 'validate-' + (Math.random() + '').slice(2, 7);\n};\n\nvar validateMembers = function validateMembers(value, members) {\n  var errors = Object.keys(members).reduce(function (errors, name) {\n    return [].concat(_toConsumableArray(errors), _toConsumableArray(members[name].errors));\n  }, []);\n  return errors;\n};\n\nvar Validate = function (_Component) {\n  _inherits(Validate, _Component);\n\n  function Validate() {\n    var _ref;\n\n    _classCallCheck(this, Validate);\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    var _this = _possibleConstructorReturn(this, (_ref = Validate.__proto__ || Object.getPrototypeOf(Validate)).call.apply(_ref, [this].concat(args)));\n\n    _initialiseProps.call(_this);\n\n    var _this$props = _this.props;\n    var name = _this$props.name;\n    var value = _this$props.value;\n\n\n    _this.name = name || defaultName();\n    _this.state = {\n      value: value,\n      members: {},\n      pristine: true\n    };\n\n    var errors = _this._getError(_this.props.value, {});\n    _this.state.errors = errors;\n    _this.state.valid = errors.length === 0;\n    return _this;\n  }\n\n  _createClass(Validate, [{\n    key: 'componentDidMount',\n    value: function componentDidMount() {\n      var parent = this.props.parent;\n\n      if (parent) parent.report(this.name, this.state);\n    }\n  }, {\n    key: 'componentWillUnmount',\n    value: function componentWillUnmount() {\n      var parent = this.props.parent;\n\n      if (parent) parent.leave(this.name);\n    }\n  }, {\n    key: 'componentWillReceiveProps',\n    value: function componentWillReceiveProps(nextProps) {\n      if (!(value in nextProps) || nextProps.value === this.state.value) return;\n\n      var value = nextProps.value;\n      var parent = nextProps.parent;\n      var onChange = nextProps.onChange;\n\n\n      var errors = this._getError(value, this.state.members);\n      var valid = errors.length === 0;\n      var pristine = true;\n\n      this.setState({ errors: errors, pristine: pristine, valid: valid, value: value });\n\n      onChange(value, valid);\n      if (parent) parent.report(this.name, _extends({}, this.state, { errors: errors, pristine: pristine, valid: valid, value: value }));\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _props = this.props;\n      var parent = _props.parent;\n      var render = _props.children;\n\n      var opts = {\n        name: this.name,\n        check: this.check,\n        errors: this.state.errors,\n        members: this.state.members,\n        onChange: this.onChange,\n        pristine: (!parent || parent.pristine) && this.state.pristine,\n        valid: this.state.valid,\n        value: this.state.value\n      };\n\n      opts.group = {\n        pristine: opts.pristine,\n        report: this.onReport\n      };\n\n      return render(opts);\n    }\n  }, {\n    key: '_getError',\n    value: function _getError(value, members) {\n      return this.props.validators.reduce(function (errors, validate) {\n        var error = validate(value, members || {});\n        return error === undefined ? errors : errors.concat(error);\n      }, []);\n    }\n  }]);\n\n  return Validate;\n}(_react.Component);\n\nValidate.propTypes = {\n  children: _react.PropTypes.func.isRequired,\n  name: _react.PropTypes.string,\n  parent: _react.PropTypes.shape({\n    name: _react.PropTypes.string,\n    onChange: _react.PropTypes.func\n  }),\n  onChange: _react.PropTypes.func,\n  pristine: _react.PropTypes.bool,\n  validators: _react.PropTypes.arrayOf(_react.PropTypes.func),\n  value: _react.PropTypes.any\n};\nValidate.defaultProps = {\n  parent: null,\n  validators: [validateMembers],\n  value: null,\n  onChange: function onChange() {\n    return undefined;\n  }\n};\n\nvar _initialiseProps = function _initialiseProps() {\n  var _this2 = this;\n\n  this.check = function () {\n    _this2.setState({ pristine: false });\n    return _this2.state.valid;\n  };\n\n  this.onChange = function (value) {\n    var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n    var _props2 = _this2.props;\n    var parent = _props2.parent;\n    var onChange = _props2.onChange;\n\n\n    var errors = _this2._getError(value, _this2.state.members);\n    var valid = errors.length === 0;\n    var pristine = _this2.state.pristine && silent;\n\n    _this2.setState({ errors: errors, pristine: pristine, valid: valid, value: value });\n\n    onChange(value, valid);\n    if (parent) parent.report(_this2.name, _extends({}, _this2.state, { errors: errors, pristine: pristine, valid: valid, value: value }));\n  };\n\n  this.onReport = function (name, member) {\n    var parent = _this2.props.parent;\n\n\n    _this2.setState(function (state) {\n      var members = _extends({}, state.members, _defineProperty({}, name, member));\n      var errors = _this2._getError(state.value, members);\n      var valid = errors.length === 0;\n\n      if (parent) parent.report(_this2.name, _extends({}, state, { errors: errors, members: members, valid: valid }));\n      return { errors: errors, members: members, valid: valid };\n    });\n  };\n\n  this.onLeave = function (name) {\n    if (!_this2.state.members[name]) return;\n    var members = _extends({}, _this2.state.members);\n    delete members[name];\n    _this2.setState({ members: members });\n  };\n};\n\nexports.default = Validate;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./index.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./index.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_1__;\n\n/*****************\n ** WEBPACK FOOTER\n ** external \"react\"\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }
/******/ ])
});
;