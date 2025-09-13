var Class = $import('@core/class');
var signal = $import('@core/signal').signal;
var LinkedList = $import('@core/linked-list/linked-list');

var ItemStrategy = $import('@domain/items/item.strategy');

var InventoryModel = Class({
  constructor: function (items) {
    this._inventory = new LinkedList();

    this._array = signal(this._inventory.toArray());

    this._currentItem = signal(this._inventory.getCurrentNode());

    if (items && items.length) {
      for (var i = 0; i < items.length; i++) {
        this.add(items[i]);
      }
    }
  },

  methods: {
    add: function (item) {
      if (!(item instanceof ItemStrategy)) {
        throw new Error('item is not instance of ItemStrategy');
      }

      this._inventory.add(item);
      this._array.value = this._inventory.toArray();
      this._currentItem.value = this._inventory.getCurrentNode();
    },

    removeCurrentNode: function () {
      if (!this._inventory.current) return;

      this._inventory.removeCurrentNode();

      this._array.value = this._inventory.toArray();
      this._currentItem.value = this._inventory.getCurrentNode();
    },

    setCurrentIndex: function (index) {
      if (this._array.value[index] === undefined) return;

      this._inventory.setCurrentIndex(index);
      this._currentItem.value = this._inventory.getCurrentNode();
    },

    getAll: function () {
      return this._array.value;
    },

    getCurrentNode: function () {
      return this._currentItem.value;
    },

    nextNode: function () {
      this._inventory.nextNode();
      this._currentItem.value = this._inventory.getCurrentNode();
    },

    prevNode: function () {
      this._inventory.prevNode();
      this._currentItem.value = this._inventory.getCurrentNode();
    },

    useCurrentItem: function (playerVM) {
      var currentNode = this.getCurrentNode();
      if (!currentNode) return;

      currentNode.item.execute(playerVM);

      if (currentNode.item.isDisposable) {
        this.removeCurrentNode();
      }
    },
  },

  static: {
    createNew: function (items) {
      return new InventoryModel(items);
    },
  },
});

module.exports = InventoryModel;
