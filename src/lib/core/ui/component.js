/** @typedef {import('@core/class').ClassConstructor} ClassConstructor */
var Class = $import('@core/class');
// var effect = $import('@core/signal').effect;

var templateCache = {};

var reactiveAttributesRegexp = /\[(\w+)\]/;
var reactivePropertyRegexp = /\{\{([\w | ' ']+)\}\}/;
var eventPropertyRegexp = /on-(\w+)/;

/** @type {ClassConstructor} */
var Component = Class({
  constructor: function (templateUrl) {
    this._templateUrl = templateUrl;
    this.element = null;
    this.bindings = [];
    this.disposeEventHandlers = [];
  },

  methods: {
    onInit: function () {},
    onDestroy: function () {},

    destroy: function () {
      this.onDestroy();
      this.eventHandlers.forEach(function (dispose) {
        dispose();
      });
    },

    _loadTemplate: function (callback) {
      if (templateCache[this._templateUrl]) {
        callback(this.templateCache[this._templateUrl]);
        return;
      }

      templateCache[this._templateUrl] = $import(this._templateUrl);
      callback(templateCache[this._templateUrl]);
    },

    _createEventBinding: function (node, eventAttributeName) {
      var eventName = eventAttributeName.slice(3);
      var handler = this[node.getAttribute(eventAttributeName)];

      node.removeAttribute(eventAttributeName);

      var self = this;
      node.addEventListener(eventName, function (e) {
        if (typeof handler === 'function') {
          handler.call(self, e);
        }
      });

      this.disposeEventHandlers.push(function () {
        return node.EventListener(eventName);
      });
    },

    _processElement: function (node) {
      var attributes = node.getAttributeNames();

      attributes.forEach(
        function (attr) {
          if (eventPropertyRegexp.test(attr)) {
            this._createEventBinding(node, attr);
            // eslint-disable-next-line no-console
            console.log('Element event:', attr);
          }
          if (reactiveAttributesRegexp.test(attr)) {
            // eslint-disable-next-line no-console
            console.log('Element attribute:', attr);
          }
        }.bind(this)
      );
      var childNodes = node.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        if (
          childNode.nodeType === Node.TEXT_NODE &&
          childNode.textContent.trim() !== ''
        ) {
          this._processText(childNode);
        }
      }
    },

    _processText: function (textNode) {
      var text = textNode.textContent;
      if (reactivePropertyRegexp.test(text)) {
        // eslint-disable-next-line no-console
        console.log('Element property:', text);
      }
    },

    _processNode: function (node) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          return this._processElement(node);
        case Node.TEXT_NODE:
          return this._processText(node);
        default:
          return;
      }
    },

    _createNodeTree: function (element) {
      var stack = [element];

      while (stack.length > 0) {
        var node = stack.pop();

        this._processNode(node);

        // console.log(node.children);
        // If node was removed
        // if (!node.isConnected) {
        //   continue;
        // }

        // add children to stack
        if (node.children && node.children.length > 0) {
          for (var i = node.children.length - 1; i >= 0; i--) {
            stack.push(node.children[i]);
          }
        }
      }
    },

    _compile: function (element) {
      this._createNodeTree(element);
    },

    _parseTemplate: function (templateString) {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = templateString.trim();

      return tempDiv.firstChild;
    },

    render: function () {
      var self = this;

      this._loadTemplate(function (templateString) {
        self.element = self._parseTemplate(templateString);
        self._compile(self.element);
        self.onInit();
      });

      return this.element;
    },
  },
});

module.exports = Component;
