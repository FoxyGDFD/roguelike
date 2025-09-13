var effect = $import('@core/signal').effect;

function InventoryView(container, inventoryModel) {
  container = container || {};
  var model = inventoryModel;

  container.innerHtml = '';

  effect(function () {
    var nodes = model.getAll();
    container.innerHTML = '';

    for (var i = 0; i < nodes.length; i++) {
      container.appendChild(nodes[i].createTile());
    }
  });

  effect(function () {
    var currentNode = model.getCurrentNode();
    var children = container.children;
    if (!currentNode) return;
    for (var i = 0; i < children.length; i++) {
      var slot = children[i];
      if (model.getAll()[i] === currentNode.item) {
        slot.style.border = '2px solid #ffffff';
      } else {
        slot.style.border = '2px solid #aaaaaa';
      }
    }
  });
}

module.exports = InventoryView;
