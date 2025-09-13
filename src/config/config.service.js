var Class = $import('@core/class');

var ConfigService = Class({
  constructor: function () {
    this._config = {
      // map with and height counts in tiles
      mapWidth: 40,
      mapHeight: 28,
      tileSize: 35,
    };
  },
  properties: {
    config: {
      get: function () {
        return this._config;
      },
      configurable: false,
    },
  },
});

module.exports = ConfigService;
