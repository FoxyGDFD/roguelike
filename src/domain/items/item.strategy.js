var Class = $import('@core/class');

var ItemStrategy = Class({
  constructor: function (name, isDisposable) {
    this.name = name || 'ItemStrategy';
    this.isDisposable = isDisposable || false;
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    execute: function (playerVM) {
      // eslint-disable-next-line no-console
      console.log('Using item:', this.name);
    },
    createTile: function () {
      var tile = document.createElement('div');

      return tile;
    },
  },
});

module.exports = ItemStrategy;
