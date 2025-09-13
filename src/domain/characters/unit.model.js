var Class = $import('@core/class');
var signal = $import('@core/signal').signal;

var isWalkable = $import('@lib/utils/is-walkable');

var UnitModel = Class({
  constructor: function (mapModel, stats) {
    stats = stats || {};
    this._mapModel = mapModel;
    this._health = signal(stats.health || 100);
    this._coordinates = signal(stats.coordinates || { x: 0, y: 0 });
    this._maxHealth = stats.maxHealth || 100;
  },
  methods: {
    getMaxHealth: function () {
      return this._maxHealth;
    },
    getHealth: function () {
      return this._health.value;
    },
    increaseHealth: function (amount) {
      if (this._health.value + amount > this._maxHealth) {
        this._health.value = this._maxHealth;
      } else {
        this._health.value += amount;
      }
    },
    decreaseHealth: function (amount) {
      if (this._health.value - amount < 0) {
        this._health.value = 0;
      } else {
        this._health.value -= amount;
      }
    },

    _getCoordinates: function () {
      return this._coordinates.value;
    },
    move: function (dx, dy) {
      var newX = this._coordinates.value.x + dx;
      var newY = this._coordinates.value.y + dy;
      if (!isWalkable(newX, newY, this._mapModel.map)) return;

      this._coordinates.value = { x: newX, y: newY };
    },
  },
  static: {
    createNew: function (mapModel, stats) {
      stats = stats || {};
      var x, y;
      do {
        x = Math.floor(Math.random() * mapModel.map[0].length);
        y = Math.floor(Math.random() * mapModel.map.length);
      } while (!isWalkable(x, y, mapModel.map));
      if (!stats.coordinates) {
        stats.coordinates = { x: x, y: y };
      }
      return new this(mapModel, stats);
    },
  },
});

module.exports = UnitModel;
