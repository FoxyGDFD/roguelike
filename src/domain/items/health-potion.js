var TILE_TYPES = $import('@domain/map/tile.types');

var ItemStrategy = $import('./item.strategy');

var HealthPotion = ItemStrategy.extends({
  constructor: function (stats) {
    this.healAmount = stats.healAmount;
    ItemStrategy.call(this, TILE_TYPES.heal, true);
  },
  methods: {
    execute: function (playerVM) {
      playerVM.increaseHealth(this.healAmount);
    },
    createTile: function () {
      var tile = ItemStrategy.prototype.createTile.call(this);
      tile.className = 'tile tileHP';
      return tile;
    },
  },
});

module.exports = HealthPotion;
