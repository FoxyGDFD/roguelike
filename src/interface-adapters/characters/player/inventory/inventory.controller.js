function InventoryController(inventoryModel) {
  this.inventoryModel = inventoryModel;
  var self = this;
  document.addEventListener('wheel', function (event) {
    if (event.deltaY > 0) self.inventoryModel.nextNode();
    else self.inventoryModel.prevNode();
  });

  document.addEventListener('keydown', function (event) {
    var key = event.key;
    if (/^[1-9]$/.test(key)) {
      self.inventoryModel.setCurrentIndex(key - 1);
    }
  });
}

module.exports = InventoryController;
