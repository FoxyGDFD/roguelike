var Class = $import('@core/class');
var effect = $import('@core/signal').effect;

var PlayerView = Class({
  constructor: function (vm, configService) {
    this._config = configService.config;
    this._vm = vm;
  },
  methods: {
    render: function () {
      var mapSelector = document.querySelector('.field');
      var playerTile = document.createElement('div');
      playerTile.className = 'tile tileP';
      mapSelector.appendChild(playerTile);

      var playerHealth = document.createElement('div');
      playerHealth.className = 'health';
      playerTile.appendChild(playerHealth);

      var self = this;
      effect(function () {
        playerTile.style.left =
          self._vm.coordinates.value.x * self._config.tileSize + 'px';
        playerTile.style.top =
          self._vm.coordinates.value.y * self._config.tileSize + 'px';
      });
      effect(function () {
        playerHealth.style.width = self._vm.health.value + '%';
      });
    },
  },
  static: {
    createNew: function (vm, configService) {
      return new PlayerView(vm, configService);
    },
  },
});

module.exports = PlayerView;
