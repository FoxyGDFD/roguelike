var Class = $import('@core/class');

var TILE_TYPES = $import('./tile.types');

var MapModel = Class({
  constructor: function (config) {
    this.config = config.config;

    this.listeners = [];

    this._fillEmptyMap();
  },
  properties: {
    map: {
      get: function () {
        return this._map || [];
      },
      configurable: false,
    },
  },

  methods: {
    onTileChange: function (callback) {
      this.listeners.push(callback);
    },
    _notifyTileChange: function (x, y, newType) {
      this.listeners.forEach(function (listener) {
        listener(x, y, newType);
      });
    },

    setTile: function (x, y, type) {
      this._map[y][x] = type;
      this._notifyTileChange(x, y, type);
    },

    generateMap: function () {
      for (var y = 0; y < this._map.length; y++) {
        for (var x = 0; x < this._map[y].length; x++) {
          if (
            x === 0 ||
            y === 0 ||
            x === this._map[y].length - 1 ||
            y === this._map.length - 1
          ) {
            this._map[y][x] = 1;
          } else {
            var seed = Math.random();
            var type = TILE_TYPES['floor'];
            if (seed > 0.8) {
              type = TILE_TYPES['wall'];
            } else if (seed < 0.01) {
              type = TILE_TYPES['heal'];
            } else if (seed < 0.02) {
              type = TILE_TYPES['sword'];
            }

            this._map[y][x] = type;
          }
        }
      }
      return this;
    },

    _fillEmptyMap: function () {
      this._map = [];
      for (var y = 0; y < this.config.mapHeight; y++) {
        var row = [];
        for (var x = 0; x < this.config.mapWidth; x++) {
          row.push(0);
        }
        this._map.push(row);
      }
    },
  },
  static: {
    createNew: function (config) {
      return new MapModel(config);
    },
  },
});

module.exports = MapModel;
