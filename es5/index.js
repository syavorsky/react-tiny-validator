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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var defaultName = function defaultName() {
	  return 'validate-' + (Math.random() + '').slice(2, 7);
	};
	
	var Validate = function (_Component) {
	  _inherits(Validate, _Component);
	
	  function Validate() {
	    var _ref;
	
	    _classCallCheck(this, Validate);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    var _this = _possibleConstructorReturn(this, (_ref = Validate.__proto__ || Object.getPrototypeOf(Validate)).call.apply(_ref, [this].concat(args)));
	
	    _initialiseProps.call(_this);
	
	    var _this$props = _this.props;
	    var name = _this$props.name;
	    var value = _this$props.value;
	
	    var errors = _this._getError(_this.props.value);
	
	    _this.name = name || defaultName();
	    _this.state = {
	      value: value,
	      errors: errors,
	      members: {},
	      pristine: true,
	      valid: errors.length === 0
	    };
	    return _this;
	  }
	
	  _createClass(Validate, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var parent = this.props.parent;
	
	      if (parent) parent.report(this.name, this.state);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      var parent = this.props.parent;
	
	      if (parent) parent.leave(this.name);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var value = nextProps.value;
	      var parent = nextProps.parent;
	
	
	      if (value === this.props.value) return;
	
	      var errors = this._getError(value);
	      var valid = errors.length === 0 && this._validateMembers(this.state.members);
	      var pristine = true;
	
	      this.setState({ errors: errors, pristine: pristine, valid: valid, value: value });
	      if (parent) parent.report(this.name, _extends({}, this.state, { errors: errors, pristine: pristine, valid: valid, value: value }));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var parent = _props.parent;
	      var render = _props.children;
	
	      var opts = {
	        name: this.name,
	        check: this.check,
	        errors: this.state.errors,
	        members: this.state.members,
	        onChange: this.onChange,
	        pristine: (!parent || parent.pristine) && this.state.pristine,
	        valid: this.state.valid,
	        value: this.state.value
	      };
	
	      opts.group = {
	        pristine: opts.pristine,
	        report: this.onReport
	      };
	
	      return render(opts);
	    }
	  }, {
	    key: '_validateMembers',
	    value: function _validateMembers(members) {
	      for (var name in members) {
	        if (!members[name].valid) return false;
	      }return true;
	    }
	  }, {
	    key: '_getError',
	    value: function _getError(value) {
	      var _this2 = this;
	
	      return this.props.validators.reduce(function (errors, validate) {
	        var error = validate(value, _this2.name);
	        if (error !== undefined) errors.push(error + '');
	        return errors;
	      }, []);
	    }
	  }]);
	
	  return Validate;
	}(_react.Component);
	
	Validate.propTypes = {
	  children: _react.PropTypes.func.isRequired,
	  name: _react.PropTypes.string,
	  parent: _react.PropTypes.shape({
	    name: _react.PropTypes.string,
	    onChange: _react.PropTypes.func
	  }),
	  onChange: _react.PropTypes.func,
	  pristine: _react.PropTypes.bool,
	  validators: _react.PropTypes.arrayOf(_react.PropTypes.func),
	  value: _react.PropTypes.any
	};
	Validate.defaultProps = {
	  parent: null,
	  validators: [],
	  value: null,
	  onChange: function onChange() {
	    return undefined;
	  }
	};
	
	var _initialiseProps = function _initialiseProps() {
	  var _this3 = this;
	
	  this.check = function () {
	    _this3.setState({ pristine: false });
	    return _this3.state.errors.length > 0;
	  };
	
	  this.onChange = function (value) {
	    var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	    var _props2 = _this3.props;
	    var parent = _props2.parent;
	    var onChange = _props2.onChange;
	
	
	    var errors = _this3._getError(value);
	    var valid = errors.length === 0 && _this3._validateMembers(_this3.state.members);
	    var pristine = _this3.state.pristine && silent;
	
	    _this3.setState({ errors: errors, pristine: pristine, valid: valid, value: value });
	
	    if (valid) onChange(value);
	    if (parent) parent.report(_this3.name, _extends({}, _this3.state, { errors: errors, pristine: pristine, valid: valid, value: value }));
	  };
	
	  this.onReport = function (name, state) {
	    var parent = _this3.props.parent;
	
	
	    var members = _extends({}, _this3.state.members, _defineProperty({}, name, state));
	    var valid = _this3.state.errors.length === 0 && _this3._validateMembers(members);
	
	    _this3.setState({ members: members, valid: valid });
	    if (parent) parent.report(_this3.name, _extends({}, _this3.state, { members: members, valid: valid }));
	  };
	
	  this.onLeave = function (name) {
	    if (!_this3.state.members[name]) return;
	    var members = _extends({}, _this3.state.members);
	    delete members[name];
	    _this3.setState({ members: members });
	  };
	};
	
	exports.default = Validate;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map