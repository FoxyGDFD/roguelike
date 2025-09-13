var TILE_TYPES = $import('@domain/map/tile.types');

var ItemStrategy = $import('./item.strategy');

var Sword = ItemStrategy.extends({
  constructor: function (stats) {
    this.damage = stats.damage;
    this.range = stats.range;
    ItemStrategy.call(this, TILE_TYPES.sword);
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    execute: function (playerVM) {
      console.warn('This item is not executable');
    },
    createTile: function () {
      var tile = ItemStrategy.prototype.createTile.call(this);

      tile.className = 'tile tileSW';
      return tile;
    },
  },
});

module.exports = Sword;
