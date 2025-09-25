var currentEffect = null;

function signal(initialValue) {
  var value = initialValue;
  var _subscribers = [];

  var obj = {};
  var isNotifying = false;

  function notify() {
    if (isNotifying) return;
    isNotifying = true;

    try {
      var subscribers = _subscribers.slice();
      for (var i = 0; i < subscribers.length; i++) {
        subscribers[i]();
      }
    } finally {
      isNotifying = false;
    }
  }

  Object.defineProperty(obj, 'value', {
    get: function () {
      if (currentEffect && _subscribers.indexOf(currentEffect) === -1) {
        _subscribers.push(currentEffect);
      }
      return value;
    },
    set: function (newValue) {
      if (value === newValue) return;
      value = newValue;

      notify();
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
  var isDisposed = false;
  var isRunning = false;

  function execute() {
    if (isDisposed || isRunning) return;

    isRunning = true;
    var previousEffect = currentEffect;
    currentEffect = execute;

    try {
      fn();
    } finally {
      currentEffect = previousEffect;
      isRunning = false;
    }
  }

  execute();

  return function () {
    isDisposed = true;
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
