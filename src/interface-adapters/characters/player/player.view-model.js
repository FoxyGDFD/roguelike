var Class = $import('@core/class');
var computed = $import('@core/signal').computed;

var PlayerViewModel = Class({
  constructor: function (playerModel) {
    this._model = playerModel;

    var self = this;
    this.gold = computed(function () {
      return self._model.getGold();
    });

    this.health = computed(function () {
      return self._model.getHealth();
    });

    this.coordinates = computed(function () {
      return self._model._getCoordinates();
    });
  },
  methods: {
    move: function (dx, dy) {
      this._model.move(dx, dy);
    },
    increaseHealth: function (amount) {
      this._model.increaseHealth(amount);
    },
    decreaseHealth: function (amount) {
      this._model.decreaseHealth(amount);
    },
    addGold: function (amount) {
      this._model.setGold(this.gold.value + amount);
    },
    dropCurrentItem: function () {
      this._model.dropCurrentItem();
    },
    useItem: function () {
      this._model.useCurrentItem(this);
    },
    attack: function () {
      this._model.attack();
    },
  },
  static: {
    createNew: function (playerModel) {
      return new PlayerViewModel(playerModel);
    },
  },
});

module.exports = PlayerViewModel;
