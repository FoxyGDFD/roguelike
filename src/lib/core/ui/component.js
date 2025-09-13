/** @typedef {import('@core/class').ClassConstructor} ClassConstructor */
var Class = $import('@core/class');
var effect = $import('@core/signal').effect;

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
    this._context = this._createRootContext();
  },

  methods: {
    onInit: function () { },
    onDestroy: function () { },

    destroy: function () {
      this.onDestroy();
    },

    _loadTemplate: function (callback) {
      if (templateCache[this._templateUrl]) {
        callback(this.templateCache[this._templateUrl]);
        return;
      }

      templateCache[this._templateUrl] = $import(this._templateUrl);
      callback(templateCache[this._templateUrl]);
    },

    _createRootContext: function () {
      return {
        data: this,
        locals: {},
        parent: null,
        root: null,
      };
    },

    _processElement: function (node, context) {
      var attributes = node.getAttributeNames();

      attributes.forEach(function (attr) {
        if (eventPropertyRegexp.test(attr)) {
          console.log('Element event:', attr);
        }
        if (reactiveAttributesRegexp.test(attr)) {
          console.log('Element attribute:', attr);
        }
      });
      var childNodes = node.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        if (
          childNode.nodeType === Node.TEXT_NODE &&
          childNode.textContent.trim() !== ''
        ) {
          this._processText(childNode, context);
        }
      }
    },

    _processText: function (textNode, context) {
      var text = textNode.textContent;
      if (reactivePropertyRegexp.test(text)) {
        console.log('Element property:', text);
      }
    },

    _processNode: function (node, context) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          return this._processElement(node, context);
        case Node.TEXT_NODE:
          return this._processText(node, context);
        default:
          return context;
      }
    },

    _createNodeTree: function (element) {
      var stack = [{ node: element, context: this._context }];

      while (stack.length > 0) {
        var templateNode = stack.pop();
        var context = templateNode.context;
        var node = templateNode.node;

        this._processNode(node, context);

        // console.log(node.children);
        // If node was removed
        // if (!node.isConnected) {
        //   continue;
        // }

        // add children to stack
        if (node.children && node.children.length > 0) {
          for (var i = node.children.length - 1; i >= 0; i--) {
            stack.push({
              node: node.children[i],
              context: context,
            });
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
