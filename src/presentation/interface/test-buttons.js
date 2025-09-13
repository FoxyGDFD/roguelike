var computed = $import('@core/signal').computed;
var Component = $import('@core/ui/component');

var TestCharacterButtonsView = Component.extends({
  constructor: function (playerInfoSelector, playerVM) {
    Component.call(this, '@ui/interface/player-info.html');
    this._vm = playerVM;
    this.containerSelector = playerInfoSelector;

    var self = this;
    this.x = computed(function () {
      return self._vm.coordinates.value.x;
    });
    this.y = computed(function () {
      self._vm.coordinates.value.y;
    });
    this.health = computed(function () {
      self._vm.health.value;
    });
    this.gold = computed(function () {
      self._vm.gold.value;
    });
  },

  methods: {
    onInit: function () {
      // eslint-disable-next-line no-console
      console.log('Player info component initialized');
    },

    decreaseHealth: function () {
      this._vm.decreaseHealth(10);
    },

    increaseHealth: function () {
      this._vm.increaseHealth(5);
    },

    addGold: function () {
      this._vm.addGold(50);
    },
  },
});

module.exports = TestCharacterButtonsView;
