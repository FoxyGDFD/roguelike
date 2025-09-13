var signal = $import('@core/signal').signal;

var Sword = $import('@domain/items/sword');
var TILE_TYPES = $import('@domain/map/tile.types');
var HealthPotion = $import('@domain/items/health-potion');

var UnitModel = $import('../unit.model');

var PlayerModel = UnitModel.extends({
  constructor: function (mapModel, stats) {
    stats = stats || {};
    UnitModel.call(this, mapModel, stats);

    this._gold = signal(stats.gold || 0);
    this._inventory = stats.inventoryModel;

    this._damage = stats.damage || 20;
  },

  methods: {
    move: function (dx, dy) {
      UnitModel.prototype.move.call(this, dx, dy);

      var coordinates = this._getCoordinates();
      var newX = coordinates.x;
      var newY = coordinates.y;

      var tile = this._mapModel.map[newY][newX];

      if (tile === TILE_TYPES.heal) {
        this._inventory.add(new HealthPotion({ healAmount: 20 }));
        this._mapModel.setTile(newX, newY, TILE_TYPES.floor);
      } else if (tile === TILE_TYPES.sword) {
        this._inventory.add(new Sword({ damage: 10, range: 2 }));
        this._mapModel.setTile(newX, newY, TILE_TYPES.floor);
      }
    },

    attack: function () {
      var coordinates = this._getCoordinates();
      var node = this._inventory.getCurrentNode();
      var damage = this._damage;

      var range = 1;
      if (node && Object.hasOwn(node, 'item')) {
        var item = node.item;

        if (Object.hasOwn(item, 'damage')) {
          damage += item.damage;
        }

        if (Object.hasOwn(item, 'range')) {
          range += item.range;
        }
      }
      var hotspot = this._getHotspot(coordinates.x, coordinates.y, range);
      // TODO: detect enemies in hotspot and decrees health
      // eslint-disable-next-line no-console
      console.log(hotspot, damage);
    },

    _getHotspot: function (x, y, r) {
      r = r || 1;
      var zeroPoint = {
        x: x - r,
        y: y - r,
      };
      var hotspot = [];
      for (var tempY = 0; tempY <= r * 2; tempY++) {
        var row = [];
        for (var tempX = 0; tempX <= r * 2; tempX++) {
          row.push({ x: zeroPoint.x + tempX, y: zeroPoint.y + tempY });
        }
        hotspot.push(row);
      }
      return hotspot;
    },

    getGold: function () {
      return this._gold.value;
    },
    setGold: function (amount) {
      this._gold.value = Math.max(0, amount);
    },

    useCurrentItem: function (vm) {
      this._inventory.useCurrentItem(vm);
    },

    dropCurrentItem: function () {
      var item = this._inventory.getCurrentNode().item;
      var coordinates = this._getCoordinates();
      var currentX = coordinates.x;
      var currentY = coordinates.y;
      if (this._mapModel.map[currentY][currentX] !== TILE_TYPES.floor) return;
      this._mapModel.setTile(currentX, currentY, item.name);
      this._inventory.removeCurrentNode();
      return item;
    },
  },
});

module.exports = PlayerModel;
