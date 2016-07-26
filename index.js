(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['util'], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('util'))
  } else {
    // Browser globals (root is window)
    root.deferror = factory()
  }
}(this, function (util) {
  var inherits

  /* istanbul ignore next */
  if (!util) {
    inherits = util.inherits
  } else {
    // From https://github.com/nodejs/node/blob/master/lib/util.js.
    inherits = function (ctor, superCtor) {
      if (ctor === undefined || ctor === null) {
        throw new TypeError('The constructor to "inherits" must not be null or undefined')
      }

      if (superCtor === undefined || superCtor === null) {
        throw new TypeError('The super constructor to "inherits" must not be null or undefined')
      }

      if (superCtor.prototype === undefined) {
        throw new TypeError('The super constructor to "inherits" must have a prototype')
      }

      ctor.super_ = superCtor
      Object.setPrototypeOf(ctor.prototype, superCtor.prototype)
    }
  }

  function format (message, args) {
    for (var i = 0; i < args.length; i++) {
      message = message.replace('{' + i + '}', args[i])
    }

    return message
  }

  function BaseError () {
    this.stack = (new Error()).stack
  }

  inherits(BaseError, Error)

  /**
   * Define hierarchical error contructors. Heavily inspired by https://github.com/bitpay/bitcore-lib/blob/master/lib/errors/index.js.
   *
   * @param {Object} errorDefinitions        See README.md.
   * @param {Function} [parentConstructor]   If not provided it is BaseError.
   */
  function deferror (errorDefinitions, parentConstructor) {
    var parent = parentConstructor || {}
    parentConstructor = parentConstructor || BaseError

    errorDefinitions.forEach(function (errorDefinition) {
      function errorConstructor () {
        parentConstructor.call(this, errorDefinition)

        this.message = errorDefinition.message ? format(errorDefinition.message, arguments) : (arguments.length > 0 ? arguments[0] : '')
      }

      inherits(errorConstructor, parentConstructor)

      if (errorDefinition.name) {
        errorConstructor.prototype.name = (parentConstructor.prototype.name ? (parentConstructor.prototype.name + ': ') : '') + errorDefinition.name
      }

      if (errorDefinition.code) {
        errorConstructor.prototype.code = (parentConstructor.prototype.code ? (parentConstructor.prototype.code + '::') : '') + errorDefinition.code
      }

      if (errorDefinition.errors) {
        deferror(errorDefinition.errors, errorConstructor)
      }

      parent[errorDefinition.name] = errorConstructor
    })

    return parent
  }

  deferror._base = BaseError

  return deferror
}))
