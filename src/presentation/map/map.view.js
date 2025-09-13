var Class = $import('@core/class');

var TILE_TYPES = $import('@domain/map/tile.types');

var MapView = Class({
  constructor: function (container, mapModel, configService) {
    this._model = mapModel;
    this.container = container;
    this.config = configService.config;
    this._tileElements = [];

    this._model.onTileChange(this.updateTile.bind(this));
  },

  methods: {
    _createTile: function (x, y, type) {
      var tile = document.createElement('div');

      tile.className = 'tile';
      if (type === TILE_TYPES['wall']) {
        tile.className += ' tileW';
      }
      if (type === TILE_TYPES['sword']) {
        tile.className += ' tileSW';
      }
      if (type === TILE_TYPES['heal']) {
        tile.className += ' tileHP';
      }
      tile.style.left = x * this.config.tileSize + 'px';
      tile.style.top = y * this.config.tileSize + 'px';
      tile.dataset.x = x;
      tile.dataset.y = y;
      return tile;
    },

    renderTile: function (x, y) {
      var tile = this._createTile(x, y, this._model.map[y][x]);
      this.container.appendChild(tile);
      return tile;
    },

    renderMap: function () {
      this._tileElements = [];
      for (var y = 0; y < this._model.map.length; y++) {
        var row = [];
        for (var x = 0; x < this._model.map[y].length; x++) {
          row.push(this.renderTile(x, y));
        }
        this._tileElements.push(row);
      }
    },

    updateTile: function (x, y) {
      var type = this._model.map[y][x];
      var tile = this._tileElements[y][x];

      tile.className = 'tile';
      if (type === TILE_TYPES['wall']) {
        tile.className += ' tileW';
      }
      if (type === TILE_TYPES['sword']) {
        tile.className += ' tileSW';
      }
      if (type === TILE_TYPES['heal']) {
        tile.className += ' tileHP';
      }
    },
  },
  static: {
    createNew: function (container, mapModel, configService) {
      return new MapView(container, mapModel, configService);
    },
  },
});

module.exports = MapView;
