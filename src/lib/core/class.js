/**
 * @typedef {Object} PropertyDefinition
 * @property {() => any} [get]
 * @property {(value: any) => void} [set]
 * @property {boolean} [enumerable]
 * @property {boolean} [configurable]
 */

/**
 * @typedef {Object} ClassDefinition
 * @property {Function} [constructor]
 * @property {Object.<string, Function>} [methods]
 * @property {Object.<string, Function>} [static]
 * @property {Object.<string, PropertyDefinition>} [properties]
 * @property {Object.<string, PropertyDefinition>} [staticProperties]
 */

/**
 * @callback ExtendsFunction
 * @param {ClassDefinition} definition
 * @returns {ClassConstructor}
 */

/**
 * @callback InjectFunction
 * @param {Object.<string, Function>} methods
 * @returns {ClassConstructor}
 */

/**
 * @typedef {Function & {
 *   extends: ExtendsFunction,
 *   inject: InjectFunction,
 *   prototype: Object
 * }} ClassConstructor
 */

/**
 * @typedef {Function & {
 *   inject: (constructor: ClassConstructor, methods: Object.<string, Function>) => ClassConstructor,
 *   mixin: <T extends Object, S extends Object>(target: T, source: S) => T & S
 * }} ClassFactory
 */

/**
 * @type {() => ClassFactory}
 */
var Class = function () {
  /**
   * @param {ClassDefinition} definition
   * @returns {ClassConstructor}
   */
  function create(definition) {
    var constructor = /** @type {any} */ (
      definition.constructor || function () {}
    );
    var staticMethods = definition.static || {};
    var instanceMethods = definition.methods || {};
    var properties = definition.properties || {};
    var staticProperties = definition.staticProperties || {};

    constructor.extends = function (childDefinition) {
      return _extends.call(this, childDefinition);
    };

    constructor.inject = function (methods) {
      return _inject.call(this, methods);
    };

    _applyStaticProperties(staticProperties, constructor);
    _applyProperties(properties, constructor);
    _applyStaticMethods(staticMethods, constructor);
    _applyInstanceMethods(instanceMethods, constructor);

    return /** @type {ClassConstructor} */ constructor;
  }

  /**
   * @this {ClassConstructor}
   * @param {ClassDefinition} childDefinition
   * @returns {ClassConstructor}
   */
  function _extends(childDefinition) {
    var parentConstructor = /** @type {ClassConstructor} */ this;
    var childStaticMethods = childDefinition.static || {};
    var childInstanceMethods = childDefinition.methods || {};
    var childProperties = childDefinition.properties || {};
    var childStaticProperties = childDefinition.staticProperties || {};
    var childConstructor =
      childDefinition.constructor ||
      function () {
        // @ts-ignore
        parentConstructor.apply(this, arguments);
      };

    _inherit(childConstructor, parentConstructor);

    _inheritStatic(childConstructor, parentConstructor);

    _applyStaticProperties(childStaticProperties, childConstructor);
    _applyProperties(childProperties, childConstructor);
    _applyStaticMethods(childStaticMethods, childConstructor);
    _applyInstanceMethods(childInstanceMethods, childConstructor);

    // @ts-ignore
    childConstructor.extends = function (grandChildDefinition) {
      return _extends.call(this, grandChildDefinition);
    };

    // @ts-ignore
    childConstructor.inject = function (methods) {
      return _inject.call(this, methods);
    };

    // @ts-ignore
    return childConstructor;
  }

  /** @param {Object.<string, Function>} methods */
  function _inject(methods) {
    _applyInstanceMethods(methods, this);
    return this;
  }
  /**
   * @private
   */
  function _applyProperties(properties, constructor) {
    Object.keys(properties).forEach(function (propName) {
      var propDefinition = properties[propName];
      Object.defineProperty(constructor.prototype, propName, {
        get: propDefinition.get,
        set: propDefinition.set,
        enumerable: propDefinition.enumerable !== false,
        configurable: propDefinition.configurable !== false,
      });
    });
  }

  /**
   * @private
   */
  function _applyStaticProperties(properties, constructor) {
    Object.keys(properties).forEach(function (propName) {
      var propDefinition = properties[propName];
      Object.defineProperty(constructor, propName, {
        get: propDefinition.get,
        set: propDefinition.set,
        enumerable: propDefinition.enumerable !== false,
        configurable: propDefinition.configurable !== false,
      });
    });
  }

  /**
   * @private
   */
  function _applyInstanceMethods(methods, constructor) {
    Object.keys(methods).forEach(function (methodName) {
      constructor.prototype[methodName] = methods[methodName];
    });
  }

  /**
   * @private
   */
  function _applyStaticMethods(methods, constructor) {
    Object.keys(methods).forEach(function (methodName) {
      constructor[methodName] = methods[methodName];
    });
  }

  /**
   * @private
   */
  function _inherit(childClass, parentClass) {
    childClass.prototype = Object.create(parentClass.prototype);
    childClass.prototype.constructor = childClass;
  }

  /**
   * @private
   */
  function _inheritStatic(childClass, parentClass) {
    var notInheredProperties = [
      'length',
      'name',
      'prototype',
      'extends',
      'inject',
    ];
    Object.getOwnPropertyNames(parentClass).forEach(function (propName) {
      if (!notInheredProperties.includes(propName)) {
        var descriptor = Object.getOwnPropertyDescriptor(parentClass, propName);
        Object.defineProperty(childClass, propName, descriptor);
      }
    });
  }

  /**
   * Внедряет методы в существующий конструктор класса
   * @param {ClassConstructor} constructor
   * @param {Object.<string, Function>} methods
   * @returns {ClassConstructor}
   */
  create.inject = function (constructor, methods) {
    return _inject.call(constructor, methods);
  };

  /**
   * Примешивает свойства и методы из source в target (кроме constructor и prototype)
   * @template T, S
   * @param {T} target
   * @param {S} source
   * @returns {T & S}
   */
  create.mixin = function (target, source) {
    Object.keys(source).forEach(function (key) {
      if (key !== 'constructor' && key !== 'prototype') {
        /** @type {any} */ target[key] = /** @type {any} */ (source)[key];
      }
    });
    return /** @type {T & S} */ (target);
  };

  return /** @type {ClassFactory} */ create;
};

module.exports = Class();
