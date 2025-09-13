var currentEffect = null;

function signal(initialValue) {
  var value = initialValue;
  var _subscribers = [];

  var obj = {};

  Object.defineProperty(obj, 'value', {
    get: function () {
      if (currentEffect && _subscribers.indexOf(currentEffect) === -1) {
        _subscribers.push(currentEffect);
      }
      return value;
    },
    set: function (newValue) {
      value = newValue;
      for (var i = 0; i < _subscribers.length; i++) {
        _subscribers[i]();
      }
    },
  });

  obj.subscribe = function (fn) {
    if (typeof fn === 'function' && _subscribers.indexOf(fn) === -1) {
      _subscribers.push(fn);
    }
    return function dispose() {
      var idx = _subscribers.indexOf(fn);
      if (idx !== -1) _subscribers.splice(idx, 1);
    };
  };

  return obj;
}

function effect(fn) {
  function wrapped() {
    currentEffect = wrapped;
    fn();
    currentEffect = null;
  }
  wrapped();
  return function dispose() {
    // удаляем подписку вручную
  };
}

function computed(fn) {
  var c = signal(fn());

  effect(function () {
    c.value = fn();
  });

  return c;
}

module.exports = { signal: signal, computed: computed, effect: effect };
