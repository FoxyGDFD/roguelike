var Class = $import('../class');
var Node = $import('./node');

var LinkedList = Class({
  constructor: function () {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.current = null;
  },
  methods: {
    toArray: function () {
      var array = [];
      var current = this.head;
      while (array.length !== this.length) {
        array.push(current.item);
        current = current.next;
      }
      return array;
    },
    add: function (item) {
      var node = new Node(item);
      if (!this.head) {
        this.head = node;
        this.tail = node;
        node.next = node;
        node.prev = node;
      } else {
        node.prev = this.tail;
        node.next = this.head;
        this.tail.next = node;
        this.head.prev = node;
        this.tail = node;
      }
      if (!this.current) this.current = node;
      this.length++;
      return this;
    },
    setCurrentIndex: function (index) {
      var newCurrent = this.head;
      while (index > 0) {
        newCurrent = newCurrent.next;
        index -= 1;
      }
      this.current = newCurrent;
    },
    removeCurrentNode: function () {
      if (!this.current) return;

      if (this.length === 1) {
        this.head = null;
        this.tail = null;
        this.current = null;
      } else {
        this.current.prev.next = this.current.next;
        this.current.next.prev = this.current.prev;
        if (this.current === this.head) this.head = this.current.next;
        if (this.current === this.tail) this.tail = this.current.prev;
        this.current = this.current.next;
      }
      this.length--;

      return this;
    },

    nextNode: function () {
      if (!this.current) return;
      this.current = this.current.next;
      return this;
    },

    prevNode: function () {
      if (!this.current) return;
      this.current = this.current.prev;
      return this;
    },

    getCurrentNode: function () {
      return this.current || null;
    },
  },
});

module.exports = LinkedList;
