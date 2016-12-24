(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.React);
    global.Validate = mod.exports;
  }
})(this, function (module, exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var defaultName = function defaultName() {
    return 'validate-' + (Math.random() + '').slice(2, 7);
  };

  var warn = function warn() {
    var _console;

    if (typeof console !== 'undefined' && console.warn) (_console = console).warn.apply(_console, arguments);
  };

  var missingPromise = function missingPromise() {
    var msg = ['Missing a Promise binding!', 'You should either have global \'Promise\' available', 'or introduce custom one as \'Validate.usePromise(Promise)\''].join('\n');

    warn(msg);
    throw new Error('Missing a Promise binding');
  };

  missingPromise.all = missingPromise;

  var validateMembers = function validateMembers(value, members) {
    var errors = Object.keys(members).reduce(function (errors, name) {
      return [].concat(_toConsumableArray(errors), _toConsumableArray(members[name].errors));
    }, []);
    return errors;
  };

  var aborted = new Error('validation aborted');

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


      _this.name = name || defaultName();
      _this.state = {
        value: value,
        members: {},
        pristine: true,
        pending: false,
        valid: _this.props.value !== undefined ? _this.props.value : true,
        errors: []
      };

      _this._validationRun = 0;
      return _this;
    }

    _createClass(Validate, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _props = this.props;
        var explicit = _props.explicit;
        var valid = _props.valid;
        var value = _props.value;

        if (!explicit && valid === undefined) this._validate(value, {}, true);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var parent = this.props.parent;

        parent && parent.leave(this.name);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        if (!(value in nextProps) || nextProps.value === this.state.value) return;

        var value = nextProps.value;
        var parent = nextProps.parent;
        var onChange = nextProps.onChange;

        this._validate(value, this.state.members).then(function () {
          onChange(_this2.state.value, _this2.state.valid);
          parent && parent.report(_this2.name, _this2.state);
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props;
        var parent = _props2.parent;
        var render = _props2.children;

        var opts = {
          name: this.name,
          check: this.check,
          errors: this.state.errors,
          members: this.state.members,
          onChange: this.onChange,
          pending: this.state.pending,
          pristine: (!parent || parent.pristine) && this.state.pristine,
          valid: this.state.valid,
          value: this.state.value
        };

        opts.group = {
          pristine: opts.pristine,
          report: this.onReport,
          check: this.check
        };

        return render(opts);
      }
    }, {
      key: '_validate',
      value: function _validate(value, members, pristine) {
        var _this3 = this;

        var isAsync = false;
        var run = ++this._validationRun;
        var _props3 = this.props;
        var validators = _props3.validators;
        var parent = _props3.parent;


        var errors = validators.reduce(function (errors, validate) {
          var error = validate(value, members || {});
          if (error !== undefined && error !== null) {
            isAsync = isAsync || !!error.then;
            return errors.concat(error); // either one or Array of errors
          }
          return errors;
        }, []);

        if (isAsync) {
          this.setState({ pending: true });
          return Promise.all(errors.concat(run)).then(function (errors) {
            if (errors.pop() !== _this3._validationRun) throw aborted;
            _this3.setState({
              errors: errors,
              valid: errors.length === 0,
              pending: false
            }, function () {
              return parent && parent.report(_this3.name, _this3.state, pristine);
            });
          }).catch(function (err) {
            _this3.setState({ pending: false });
            if (err === aborted) return;
            warn('Validation failed', err);
          });
        } else {
          this.setState({
            errors: errors,
            valid: errors.length === 0
          }, function () {
            return parent && parent.report(_this3.name, _this3.state, pristine);
          });
          return Promise.resolve();
        }
      }
    }]);

    return Validate;
  }(_react.Component);

  Validate.propTypes = {
    children: _react.PropTypes.func.isRequired,
    explicit: _react.PropTypes.bool,
    name: _react.PropTypes.string,
    parent: _react.PropTypes.shape({
      name: _react.PropTypes.string,
      onChange: _react.PropTypes.func
    }),
    onChange: _react.PropTypes.func,
    pristine: _react.PropTypes.bool,
    valid: _react.PropTypes.bool,
    validators: _react.PropTypes.arrayOf(_react.PropTypes.func),
    value: _react.PropTypes.any
  };
  Validate.defaultProps = {
    parent: null,
    validators: [validateMembers],
    value: '',
    explicit: false,
    onChange: function onChange() {
      return undefined;
    }
  };
  Validate.Promise = typeof Promise === 'undefined' ? missingPromise : Promise;

  Validate.usePromise = function (Promise) {
    Validate.Promise = Promise;
    return Validate;
  };

  var _initialiseProps = function _initialiseProps() {
    var _this4 = this;

    this.check = function () {
      _this4.setState({ pristine: false });
      var _state = _this4.state;
      var value = _state.value;
      var members = _state.members;

      return _this4._validate(value, members).then(function () {
        _this4.props.onChange(value, _this4.state.valid);
        return _this4.state.valid;
      });
    };

    this.onChange = function (value) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var _props4 = _this4.props;
      var explicit = _props4.explicit;
      var onChange = _props4.onChange;

      if (explicit) return _this4.setState({ value: value });

      var _state2 = _this4.state;
      var pristine = _state2.pristine;
      var members = _state2.members;


      _this4.setState(function (state) {
        return _extends({}, state, {
          value: value,
          pristine: pristine && silent
        });
      }, function () {
        _this4._validate(value, members).then(function () {
          onChange(_this4.state.value, _this4.state.valid);
        });
      });
    };

    this.onReport = function (name, member, pristine) {
      var explicit = _this4.props.explicit;


      _this4.setState(function (state) {
        return _extends({}, state, {
          members: _extends({}, state.members, _defineProperty({}, name, member)),
          pristine: explicit ? state.pristine : state.pristine && pristine
        });
      }, function () {
        if (!explicit) _this4._validate(_this4.state.value, _this4.state.members);
      });
    };

    this.onLeave = function (name) {
      var explicit = _this4.props.explicit;
      var members = _this4.state.members;


      if (!members[name]) return;

      var nextMembers = _extends({}, members);
      delete nextMembers[name];

      _this4.setState({
        members: nextMembers
      }, function () {
        if (!explicit) _this4._validate(_this4.state.value, _this4.state.members);
      });
    };
  };

  exports.default = Validate;
  module.exports = exports['default'];
});

//# sourceMappingURL=index.js.map