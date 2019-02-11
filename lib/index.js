"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exclude = exclude;
exports.default = exports.Consumer = exports.Provider = exports.Context = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ProviderClass =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ProviderClass, _React$Component);

  function ProviderClass(props) {
    var _this;

    _classCallCheck(this, ProviderClass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProviderClass).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      val: {}
    });

    var stores = props.stores;
    stores = stores.map(function (store) {
      return _this.observe(store, function () {
        return _this.update(stores);
      });
    });
    _this.state = {
      val: _this.valueOf(stores)
    };
    return _this;
  }

  _createClass(ProviderClass, [{
    key: "update",
    value: function update(stores) {
      this.setState({
        val: this.valueOf(stores)
      });
    }
  }, {
    key: "observe",
    value: function observe(data, update) {
      var _this2 = this;

      if (!data || !(data instanceof Object)) {
        return data;
      }

      return new Proxy(data, {
        set: function set(target, key, value, proxy) {
          if (value === target[key]) {
            return true;
          }

          Reflect.set(target, key, value, proxy);

          if (!_this2.__excludeKeys || _this2.__excludeKeys.every(function (k) {
            return k !== key;
          })) {
            update(proxy);
          }

          return true;
        },
        get: function get(target, key, proxy) {
          if (key in target.__proto__) {
            return Reflect.get(target, key, proxy);
          }

          return _this2.observe(Reflect.get(target, key, proxy), update);
        }
      });
    }
  }, {
    key: "valueOf",
    value: function valueOf(stores) {
      var val = {};
      stores.forEach(function (store) {
        var keys = [].concat(_toConsumableArray(Reflect.ownKeys(store)), _toConsumableArray(Reflect.ownKeys(store.__proto__)));
        keys.filter(function (k) {
          return !(store.__excludeKeys && store.__excludeKeys.some(function (_k) {
            return _k === k;
          }));
        }).forEach(function (k) {
          var t = store[k];
          val[k] = t instanceof Function ? t.bind(store) : t;
        });
      });
      return val;
    }
  }, {
    key: "render",
    value: function render() {
      var ctx = this.props.ctx;
      return _react.default.createElement(ctx.Provider, {
        value: this.state.val
      }, this.props.children);
    }
  }]);

  return ProviderClass;
}(_react.default.Component);

var provider = function provider(ctx) {
  return function () {
    for (var _len = arguments.length, stores = new Array(_len), _key = 0; _key < _len; _key++) {
      stores[_key] = arguments[_key];
    }

    return function (Comp) {
      return function (props) {
        return _react.default.createElement(ProviderClass, {
          ctx: ctx,
          stores: stores
        }, _react.default.createElement(Comp, props));
      };
    };
  };
};

var renderConsumer = function renderConsumer(Consumer, Comp, mapToProps) {
  return function (props) {
    return _react.default.createElement(Consumer, null, function (val) {
      var p = _objectSpread({}, mapToProps && mapToProps instanceof Function ? mapToProps(val) : val, props);

      return _react.default.createElement(Comp, p);
    });
  };
};

var isReactComponent = function isReactComponent(c) {
  return c && Reflect.ownKeys(_react.default.Component.prototype).every(function (k) {
    return Reflect.ownKeys(c.prototype.__proto__).some(function (t) {
      return t === k;
    });
  });
};

var consumer = function consumer(ctx) {
  return function () {
    for (var _len2 = arguments.length, keys = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      keys[_key2] = arguments[_key2];
    }

    if (keys.length && isReactComponent(keys[0])) {
      return renderConsumer(ctx.Consumer, keys[0]);
    }

    var mapToProps = !keys.length ? null : function (val) {
      var p = {};
      keys.forEach(function (key) {
        if (typeof key === 'string') {
          p[key] = val[key];
        } else if (key instanceof Function) {
          p = _objectSpread({}, p, key(val));
        }
      });
      return p;
    };
    return function (Comp) {
      return renderConsumer(ctx.Consumer, Comp, mapToProps);
    };
  };
};

var Context = _react.default.createContext();

exports.Context = Context;
var Provider = provider(Context);
exports.Provider = Provider;
var Consumer = consumer(Context);
exports.Consumer = Consumer;

var _default = function (initialState) {
  var ctx = _react.default.createContext(initialState);

  return {
    Context: ctx,
    Provider: provider(ctx),
    Consumer: consumer(ctx)
  };
}();

exports.default = _default;

function exclude(target, key) {
  target.__excludeKeys = [key].concat(target.__excludeKeys || ['__excludeKeys']);
}