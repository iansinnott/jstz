/* jstz.min.js Version: 2.1.1 Build date: 2018-12-29 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.jstz = factory());
}(this, function () { 'use strict';

  var _isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var toString = {}.toString;

  var _cof = function (it) {
    return toString.call(it).slice(8, -1);
  };

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.6.1' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var _library = false;

  var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode: _library ? 'pure' : 'global',
    copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id = 0;
  var px = Math.random();
  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
  });

  // 7.2.8 IsRegExp(argument)


  var MATCH = _wks('match');
  var _isRegexp = function (it) {
    var isRegExp;
    return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
  };

  var _anObject = function (it) {
    if (!_isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  var _aFunction = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  // 7.3.20 SpeciesConstructor(O, defaultConstructor)


  var SPECIES = _wks('species');
  var _speciesConstructor = function (O, D) {
    var C = _anObject(O).constructor;
    var S;
    return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
  };

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  // true  -> String#at
  // false -> String#codePointAt
  var _stringAt = function (TO_STRING) {
    return function (that, pos) {
      var s = String(_defined(that));
      var i = _toInteger(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var at = _stringAt(true);

   // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex
  var _advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? at(S, index).length : 1);
  };

  // 7.1.15 ToLength

  var min = Math.min;
  var _toLength = function (it) {
    return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  // getting tag from 19.1.3.6 Object.prototype.toString()

  var TAG = _wks('toStringTag');
  // ES3 wrong here
  var ARG = _cof(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (e) { /* empty */ }
  };

  var _classof = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
      // builtinTag case
      : ARG ? _cof(O)
      // ES3 arguments fallback
      : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

  var builtinExec = RegExp.prototype.exec;

   // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var _regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw new TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }
    if (_classof(R) !== 'RegExp') {
      throw new TypeError('RegExp#exec called on incompatible receiver');
    }
    return builtinExec.call(R, S);
  };

  // 21.2.5.3 get RegExp.prototype.flags

  var _flags = function () {
    var that = _anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var LAST_INDEX = 'lastIndex';

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/,
        re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
  })();

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

      match = nativeExec.call(re, str);

      if (UPDATES_LAST_INDEX_WRONG && match) {
        re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        // eslint-disable-next-line no-loop-func
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var _regexpExec = patchedExec;

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var document = _global.document;
  // typeof document.createElement is 'object' in old IE
  var is = _isObject(document) && _isObject(document.createElement);
  var _domCreate = function (it) {
    return is ? document.createElement(it) : {};
  };

  var _ie8DomDefine = !_descriptors && !_fails(function () {
    return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive = function (it, S) {
    if (!_isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;

  var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject(O);
    P = _toPrimitive(P, true);
    _anObject(Attributes);
    if (_ie8DomDefine) try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp = {
  	f: f
  };

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var hasOwnProperty = {}.hasOwnProperty;
  var _has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var _redefine = createCommonjsModule(function (module) {
  var SRC = _uid('src');
  var TO_STRING = 'toString';
  var $toString = Function[TO_STRING];
  var TPL = ('' + $toString).split(TO_STRING);

  _core.inspectSource = function (it) {
    return $toString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === _global) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      _hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      _hide(O, key, val);
    }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });
  });

  // optional / simple context binding

  var _ctx = function (fn, that, length) {
    _aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
    var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      // export native or passed
      out = (own ? target : source)[key];
      // bind timers to global for call from export context
      exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
      // extend global
      if (target) _redefine(target, key, out, type & $export.U);
      // export
      if (exports[key] != out) _hide(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };
  _global.core = _core;
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  var _export = $export;

  _export({
    target: 'RegExp',
    proto: true,
    forced: _regexpExec !== /./.exec
  }, {
    exec: _regexpExec
  });

  var SPECIES$1 = _wks('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
    // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length === 2 && result[0] === 'a' && result[1] === 'b';
  })();

  var _fixReWks = function (KEY, length, exec) {
    var SYMBOL = _wks(KEY);

    var DELEGATES_TO_SYMBOL = !_fails(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;
      re.exec = function () { execCalled = true; return null; };
      if (KEY === 'split') {
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$1] = function () { return re; };
      }
      re[SYMBOL]('');
      return !execCalled;
    }) : undefined;

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var fns = exec(
        _defined,
        SYMBOL,
        ''[KEY],
        function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
          if (regexp.exec === _regexpExec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
            }
            return { done: true, value: nativeMethod.call(str, regexp, arg2) };
          }
          return { done: false };
        }
      );
      var strfn = fns[0];
      var rxfn = fns[1];

      _redefine(String.prototype, KEY, strfn);
      _hide(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return rxfn.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return rxfn.call(string, this); }
      );
    }
  };

  var $min = Math.min;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX$1 = 'lastIndex';

  // eslint-disable-next-line no-empty
  var SUPPORTS_Y = !!(function () { try { return new RegExp('x', 'y'); } catch (e) {} })();

  // @@split logic
  _fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
      'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
      'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
      '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
      '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
      ''[$SPLIT](/.?/)[LENGTH]
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(this);
        if (separator === undefined && limit === 0) return [];
        // If `separator` is not a regex, use native split
        if (!_isRegexp(separator)) return $split.call(string, separator, limit);
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = _regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy[LAST_INDEX$1];
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
            lastLength = match[0][LENGTH];
            lastLastIndex = lastIndex;
            if (output[LENGTH] >= splitLimit) break;
          }
          if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
        }
        if (lastLastIndex === string[LENGTH]) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
      };
    // Chakra, V8
    } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
      };
    } else {
      internalSplit = $split;
    }

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = defined(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
        if (res.done) return res.value;

        var rx = _anObject(regexp);
        var S = String(this);
        var C = _speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                      (rx.multiline ? 'm' : '') +
                      (rx.unicode ? 'u' : '') +
                      (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? 0xffffffff : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = $min(_toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = _advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  });

  var dP$1 = _objectDp.f;
  var FProto = Function.prototype;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name';

  // 19.2.4.2 name
  NAME in FProto || _descriptors && dP$1(FProto, NAME, {
    configurable: true,
    get: function () {
      try {
        return ('' + this).match(nameRE)[1];
      } catch (e) {
        return '';
      }
    }
  });

  /* Build time: 2018-12-29 09:32:00Z Build by invoking python utilities/dst.py generate */
  var dst_rules = {
    "years": [2014, 2015, 2016, 2017, 2018],
    "zones": [{
      "name": "Africa/Cairo",
      "rules": [{
        "e": 1411678800000,
        "s": 1406844000000
      }, false, false, false, false]
    }, {
      "name": "Africa/Casablanca",
      "rules": [{
        "e": 1414288800000,
        "s": 1406944800000
      }, {
        "e": 1445738400000,
        "s": 1437271200000
      }, {
        "e": 1477792800000,
        "s": 1468116000000
      }, {
        "e": 1509242400000,
        "s": 1498960800000
      }, {
        "e": 1540692000000,
        "s": 1529200800000
      }]
    }, {
      "name": "America/Asuncion",
      "rules": [{
        "e": 1395543600000,
        "s": 1412481600000
      }, {
        "e": 1426993200000,
        "s": 1443931200000
      }, {
        "e": 1459047600000,
        "s": 1475380800000
      }, {
        "e": 1490497200000,
        "s": 1506830400000
      }, {
        "e": 1521946800000,
        "s": 1538884800000
      }]
    }, {
      "name": "America/Campo_Grande",
      "rules": [{
        "e": 1392519600000,
        "s": 1413691200000
      }, {
        "e": 1424574000000,
        "s": 1445140800000
      }, {
        "e": 1456023600000,
        "s": 1476590400000
      }, {
        "e": 1487473200000,
        "s": 1508040000000
      }, {
        "e": 1518922800000,
        "s": 1541304000000
      }]
    }, {
      "name": "America/Goose_Bay",
      "rules": [{
        "e": 1414904400000,
        "s": 1394344800000
      }, {
        "e": 1446354000000,
        "s": 1425794400000
      }, {
        "e": 1478408400000,
        "s": 1457848800000
      }, {
        "e": 1509858000000,
        "s": 1489298400000
      }, {
        "e": 1541307600000,
        "s": 1520748000000
      }]
    }, {
      "name": "America/Havana",
      "rules": [{
        "e": 1414904400000,
        "s": 1394341200000
      }, {
        "e": 1446354000000,
        "s": 1425790800000
      }, {
        "e": 1478408400000,
        "s": 1457845200000
      }, {
        "e": 1509858000000,
        "s": 1489294800000
      }, {
        "e": 1541307600000,
        "s": 1520744400000
      }]
    }, {
      "name": "America/Mazatlan",
      "rules": [{
        "e": 1414310400000,
        "s": 1396774800000
      }, {
        "e": 1445760000000,
        "s": 1428224400000
      }, {
        "e": 1477814400000,
        "s": 1459674000000
      }, {
        "e": 1509264000000,
        "s": 1491123600000
      }, {
        "e": 1540713600000,
        "s": 1522573200000
      }]
    }, {
      "name": "America/Mexico_City",
      "rules": [{
        "e": 1414306800000,
        "s": 1396771200000
      }, {
        "e": 1445756400000,
        "s": 1428220800000
      }, {
        "e": 1477810800000,
        "s": 1459670400000
      }, {
        "e": 1509260400000,
        "s": 1491120000000
      }, {
        "e": 1540710000000,
        "s": 1522569600000
      }]
    }, {
      "name": "America/Miquelon",
      "rules": [{
        "e": 1414900800000,
        "s": 1394341200000
      }, {
        "e": 1446350400000,
        "s": 1425790800000
      }, {
        "e": 1478404800000,
        "s": 1457845200000
      }, {
        "e": 1509854400000,
        "s": 1489294800000
      }, {
        "e": 1541304000000,
        "s": 1520744400000
      }]
    }, {
      "name": "America/Santa_Isabel",
      "rules": [{
        "e": 1414918800000,
        "s": 1394359200000
      }, {
        "e": 1446368400000,
        "s": 1425808800000
      }, {
        "e": 1478422800000,
        "s": 1457863200000
      }, {
        "e": 1509872400000,
        "s": 1489312800000
      }, {
        "e": 1541322000000,
        "s": 1520762400000
      }]
    }, {
      "name": "America/Santiago",
      "rules": [{
        "e": 1398567600000,
        "s": 1410062400000
      }, false, {
        "e": 1463281200000,
        "s": 1471147200000
      }, {
        "e": 1494730800000,
        "s": 1502596800000
      }, {
        "e": 1526180400000,
        "s": 1534046400000
      }]
    }, {
      "name": "America/Sao_Paulo",
      "rules": [{
        "e": 1392516000000,
        "s": 1413687600000
      }, {
        "e": 1424570400000,
        "s": 1445137200000
      }, {
        "e": 1456020000000,
        "s": 1476586800000
      }, {
        "e": 1487469600000,
        "s": 1508036400000
      }, {
        "e": 1518919200000,
        "s": 1541300400000
      }]
    }, {
      "name": "Asia/Amman",
      "rules": [{
        "e": 1414706400000,
        "s": 1395957600000
      }, {
        "e": 1446156000000,
        "s": 1427407200000
      }, {
        "e": 1477605600000,
        "s": 1459461600000
      }, {
        "e": 1509055200000,
        "s": 1490911200000
      }, {
        "e": 1540504800000,
        "s": 1522360800000
      }]
    }, {
      "name": "Asia/Damascus",
      "rules": [{
        "e": 1414702800000,
        "s": 1395957600000
      }, {
        "e": 1446152400000,
        "s": 1427407200000
      }, {
        "e": 1477602000000,
        "s": 1458856800000
      }, {
        "e": 1509051600000,
        "s": 1490911200000
      }, {
        "e": 1540501200000,
        "s": 1522360800000
      }]
    }, {
      "name": "Asia/Dubai",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Asia/Gaza",
      "rules": [{
        "e": 1414098000000,
        "s": 1395957600000
      }, {
        "e": 1445547600000,
        "s": 1427493600000
      }, {
        "e": 1477692000000,
        "s": 1458946800000
      }, {
        "e": 1509141600000,
        "s": 1490396400000
      }, {
        "e": 1540591200000,
        "s": 1521846000000
      }]
    }, {
      "name": "Asia/Irkutsk",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Asia/Jerusalem",
      "rules": [{
        "e": 1414278000000,
        "s": 1395964800000
      }, {
        "e": 1445727600000,
        "s": 1427414400000
      }, {
        "e": 1477782000000,
        "s": 1458864000000
      }, {
        "e": 1509231600000,
        "s": 1490313600000
      }, {
        "e": 1540681200000,
        "s": 1521763200000
      }]
    }, {
      "name": "Asia/Kamchatka",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Asia/Krasnoyarsk",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Asia/Omsk",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Asia/Vladivostok",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Asia/Yakutsk",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Asia/Yekaterinburg",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Asia/Yerevan",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Australia/Lord_Howe",
      "rules": [{
        "e": 1396710000000,
        "s": 1412436600000
      }, {
        "e": 1428159600000,
        "s": 1443886200000
      }, {
        "e": 1459609200000,
        "s": 1475335800000
      }, {
        "e": 1491058800000,
        "s": 1506785400000
      }, {
        "e": 1522508400000,
        "s": 1538839800000
      }]
    }, {
      "name": "Australia/Perth",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Europe/Helsinki",
      "rules": [{
        "e": 1414285200000,
        "s": 1396141200000
      }, {
        "e": 1445734800000,
        "s": 1427590800000
      }, {
        "e": 1477789200000,
        "s": 1459040400000
      }, {
        "e": 1509238800000,
        "s": 1490490000000
      }, {
        "e": 1540688400000,
        "s": 1521939600000
      }]
    }, {
      "name": "Europe/Minsk",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Europe/Moscow",
      "rules": [false, false, false, false, false]
    }, {
      "name": "Pacific/Apia",
      "rules": [{
        "e": 1396706400000,
        "s": 1411826400000
      }, {
        "e": 1428156000000,
        "s": 1443276000000
      }, {
        "e": 1459605600000,
        "s": 1474725600000
      }, {
        "e": 1491055200000,
        "s": 1506175200000
      }, {
        "e": 1522504800000,
        "s": 1538229600000
      }]
    }, {
      "name": "Pacific/Fiji",
      "rules": [{
        "e": 1421503200000,
        "s": 1414850400000
      }, {
        "e": 1452952800000,
        "s": 1446300000000
      }, {
        "e": 1484402400000,
        "s": 1478354400000
      }, {
        "e": 1515852000000,
        "s": 1509804000000
      }, {
        "e": 1547906400000,
        "s": 1541253600000
      }]
    }, {
      "name": "Europe/London",
      "rules": [{
        "e": 1414285200000,
        "s": 1396141200000
      }, {
        "e": 1445734800000,
        "s": 1427590800000
      }, {
        "e": 1477789200000,
        "s": 1459040400000
      }, {
        "e": 1509238800000,
        "s": 1490490000000
      }, {
        "e": 1540688400000,
        "s": 1521939600000
      }]
    }]
  };

  /**
   * This script gives you the zone info key representing your device's time zone setting.
   *
   * @name jsTimezoneDetect
   * @version 1.0.6
   * @author Jon Nylander
   * @license MIT License - https://bitbucket.org/pellepim/jstimezonedetect/src/default/LICENCE.txt
   *
   * For usage and examples, visit:
   * http://pellepim.bitbucket.org/jstz/
   *
   * Copyright (c) Jon Nylander
   */

  var HEMISPHERE_SOUTH = 's';
  var consts = {
    DAY: 86400000,
    HOUR: 3600000,
    MINUTE: 60000,
    SECOND: 1000,
    BASELINE_YEAR: 2014,
    MAX_SCORE: 864000000,
    // 10 days
    AMBIGUITIES: {
      'America/Denver': ['America/Mazatlan'],
      'Europe/London': ['Africa/Casablanca'],
      'America/Chicago': ['America/Mexico_City'],
      'America/Asuncion': ['America/Campo_Grande', 'America/Santiago'],
      'America/Montevideo': ['America/Sao_Paulo', 'America/Santiago'],
      // Europe/Minsk should not be in this list... but Windows.
      'Asia/Beirut': ['Asia/Amman', 'Asia/Jerusalem', 'Europe/Helsinki', 'Asia/Damascus', 'Africa/Cairo', 'Asia/Gaza', 'Europe/Minsk'],
      'Pacific/Auckland': ['Pacific/Fiji'],
      'America/Los_Angeles': ['America/Santa_Isabel'],
      'America/New_York': ['America/Havana'],
      'America/Halifax': ['America/Goose_Bay'],
      'America/Godthab': ['America/Miquelon'],
      'Asia/Dubai': ['Asia/Yerevan'],
      'Asia/Jakarta': ['Asia/Krasnoyarsk'],
      'Asia/Shanghai': ['Asia/Irkutsk', 'Australia/Perth'],
      'Australia/Sydney': ['Australia/Lord_Howe'],
      'Asia/Tokyo': ['Asia/Yakutsk'],
      'Asia/Dhaka': ['Asia/Omsk'],
      // In the real world Yerevan is not ambigous for Baku... but Windows.
      'Asia/Baku': ['Asia/Yerevan'],
      'Australia/Brisbane': ['Asia/Vladivostok'],
      'Pacific/Noumea': ['Asia/Vladivostok'],
      'Pacific/Majuro': ['Asia/Kamchatka', 'Pacific/Fiji'],
      'Pacific/Tongatapu': ['Pacific/Apia'],
      'Asia/Baghdad': ['Europe/Minsk', 'Europe/Moscow'],
      'Asia/Karachi': ['Asia/Yekaterinburg'],
      'Africa/Johannesburg': ['Asia/Gaza', 'Africa/Cairo']
    }
    /**
     * Gets the offset in minutes from UTC for a certain date.
     * @param {Date} date
     * @returns {Number}
     */

  };

  var get_date_offset = function get_date_offset(date) {
    var offset = -date.getTimezoneOffset();
    return offset !== null ? offset : 0;
  };
  /**
   * This function does some basic calculations to create information about
   * the user's timezone. It uses REFERENCE_YEAR as a solid year for which
   * the script has been tested rather than depend on the year set by the
   * client device.
   *
   * Returns a key that can be used to do lookups in jstz.olson.timezones.
   * eg: "720,1,2".
   *
   * @returns {String}
   */


  var lookup_key = function lookup_key() {
    var january_offset = get_date_offset(new Date(consts.BASELINE_YEAR, 0, 2)),
        june_offset = get_date_offset(new Date(consts.BASELINE_YEAR, 5, 2)),
        diff = january_offset - june_offset;

    if (diff < 0) {
      return january_offset + ",1";
    } else if (diff > 0) {
      return june_offset + ",1," + HEMISPHERE_SOUTH;
    }

    return january_offset + ",0";
  };
  /**
   * Tries to get the time zone key directly from the operating system for those
   * environments that support the ECMAScript Internationalization API.
   */


  var get_from_internationalization_api = function get_from_internationalization_api() {
    var format, timezone;

    if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat === "undefined") {
      return;
    }

    format = Intl.DateTimeFormat();

    if (typeof format === "undefined" || typeof format.resolvedOptions === "undefined") {
      return;
    }

    timezone = format.resolvedOptions().timeZone;

    if (timezone && (timezone.indexOf("/") > -1 || timezone === 'UTC') && timezone.indexOf("Etc") != 0) {
      return timezone;
    }
  };
  /**
   * Starting point for getting all the DST rules for a specific year
   * for the current timezone (as described by the client system).
   *
   * Returns an object with start and end attributes, or false if no
   * DST rules were found for the year.
   *
   * @param year
   * @returns {Object} || {Boolean}
   */


  var dst_dates = function dst_dates(year) {
    var yearstart = new Date(year, 0, 1, 0, 0, 1, 0).getTime();
    var yearend = new Date(year, 12, 31, 23, 59, 59).getTime();
    var current = yearstart;
    var offset = new Date(current).getTimezoneOffset();
    var dst_start = null;
    var dst_end = null;

    while (current < yearend - 86400000) {
      var dateToCheck = new Date(current);
      var dateToCheckOffset = dateToCheck.getTimezoneOffset();

      if (dateToCheckOffset !== offset) {
        if (dateToCheckOffset < offset) {
          dst_start = dateToCheck;
        }

        if (dateToCheckOffset > offset) {
          dst_end = dateToCheck;
        }

        offset = dateToCheckOffset;
      }

      current += 86400000;
    }

    if (dst_start && dst_end) {
      return {
        s: find_dst_fold(dst_start).getTime(),
        e: find_dst_fold(dst_end).getTime()
      };
    }

    return false;
  };
  /**
   * Probably completely unnecessary function that recursively finds the
   * exact (to the second) time when a DST rule was changed.
   *
   * @param a_date - The candidate Date.
   * @param padding - integer specifying the padding to allow around the candidate
   *                  date for finding the fold.
   * @param iterator - integer specifying how many milliseconds to iterate while
   *                   searching for the fold.
   *
   * @returns {Date}
   */


  var find_dst_fold = function find_dst_fold(a_date, padding, iterator) {
    if (typeof padding === 'undefined') {
      padding = consts.DAY;
      iterator = consts.HOUR;
    }

    var date_start = new Date(a_date.getTime() - padding).getTime();
    var date_end = a_date.getTime() + padding;
    var offset = new Date(date_start).getTimezoneOffset();
    var current = date_start;
    var dst_change = null;

    while (current < date_end - iterator) {
      var dateToCheck = new Date(current);
      var dateToCheckOffset = dateToCheck.getTimezoneOffset();

      if (dateToCheckOffset !== offset) {
        dst_change = dateToCheck;
        break;
      }

      current += iterator;
    }

    if (padding === consts.DAY) {
      return find_dst_fold(dst_change, consts.HOUR, consts.MINUTE);
    }

    if (padding === consts.HOUR) {
      return find_dst_fold(dst_change, consts.MINUTE, consts.SECOND);
    }

    return dst_change;
  };

  var windows7_adaptations = function windows7_adaptations(rule_list, preliminary_timezone, score, sample) {
    if (score !== 'N/A') {
      return score;
    }

    if (preliminary_timezone === 'Asia/Beirut') {
      if (sample.name === 'Africa/Cairo') {
        if (rule_list[6].s === 1398376800000 && rule_list[6].e === 1411678800000) {
          return 0;
        }
      }

      if (sample.name === 'Asia/Jerusalem') {
        if (rule_list[6].s === 1395964800000 && rule_list[6].e === 1411858800000) {
          return 0;
        }
      }
    } else if (preliminary_timezone === 'America/Santiago') {
      if (sample.name === 'America/Asuncion') {
        if (rule_list[6].s === 1412481600000 && rule_list[6].e === 1397358000000) {
          return 0;
        }
      }

      if (sample.name === 'America/Campo_Grande') {
        if (rule_list[6].s === 1413691200000 && rule_list[6].e === 1392519600000) {
          return 0;
        }
      }
    } else if (preliminary_timezone === 'America/Montevideo') {
      if (sample.name === 'America/Sao_Paulo') {
        if (rule_list[6].s === 1413687600000 && rule_list[6].e === 1392516000000) {
          return 0;
        }
      }
    } else if (preliminary_timezone === 'Pacific/Auckland') {
      if (sample.name === 'Pacific/Fiji') {
        if (rule_list[6].s === 1414245600000 && rule_list[6].e === 1396101600000) {
          return 0;
        }
      }
    }

    return score;
  };
  /**
   * Takes the DST rules for the current timezone, and proceeds to find matches
   * in the jstz.olson.dst_rules.zones array.
   *
   * Compares samples to the current timezone on a scoring basis.
   *
   * Candidates are ruled immediately if either the candidate or the current zone
   * has a DST rule where the other does not.
   *
   * Candidates are ruled out immediately if the current zone has a rule that is
   * outside the DST scope of the candidate.
   *
   * Candidates are included for scoring if the current zones rules fall within the
   * span of the samples rules.
   *
   * Low score is best, the score is calculated by summing up the differences in DST
   * rules and if the consts.MAX_SCORE is overreached the candidate is ruled out.
   *
   * Yah follow? :)
   *
   * @param rule_list
   * @param preliminary_timezone
   * @returns {*}
   */


  var best_dst_match = function best_dst_match(rule_list, preliminary_timezone) {
    var score_sample = function score_sample(sample) {
      var score = 0;

      for (var j = 0; j < rule_list.length; j++) {
        // Both sample and current time zone report DST during the year.
        if (!!sample.rules[j] && !!rule_list[j]) {
          // The current time zone's DST rules are inside the sample's. Include.
          if (rule_list[j].s >= sample.rules[j].s && rule_list[j].e <= sample.rules[j].e) {
            score = 0;
            score += Math.abs(rule_list[j].s - sample.rules[j].s);
            score += Math.abs(sample.rules[j].e - rule_list[j].e); // The current time zone's DST rules are outside the sample's. Discard.
          } else {
            score = 'N/A';
            break;
          } // The max score has been reached. Discard.


          if (score > consts.MAX_SCORE) {
            score = 'N/A';
            break;
          }
        }
      }

      score = windows7_adaptations(rule_list, preliminary_timezone, score, sample);
      return score;
    };

    var scoreboard = {};
    var dst_zones = jstz.olson.dst_rules.zones;
    var dst_zones_length = dst_zones.length;
    var ambiguities = consts.AMBIGUITIES[preliminary_timezone];

    for (var i = 0; i < dst_zones_length; i++) {
      var sample = dst_zones[i];
      var score = score_sample(dst_zones[i]);

      if (score !== 'N/A') {
        scoreboard[sample.name] = score;
      }
    }

    for (var tz in scoreboard) {
      if (scoreboard.hasOwnProperty(tz)) {
        for (var j = 0; j < ambiguities.length; j++) {
          if (ambiguities[j] === tz) {
            return tz;
          }
        }
      }
    }

    return preliminary_timezone;
  };
  /**
   * Takes the preliminary_timezone as detected by lookup_key().
   *
   * Builds up the current timezones DST rules for the years defined
   * in the jstz.olson.dst_rules.years array.
   *
   * If there are no DST occurences for those years, immediately returns
   * the preliminary timezone. Otherwise proceeds and tries to solve
   * ambiguities.
   *
   * @param preliminary_timezone
   * @returns {String} timezone_name
   */


  var get_by_dst = function get_by_dst(preliminary_timezone) {
    var get_rules = function get_rules() {
      var rule_list = [];

      for (var i = 0; i < jstz.olson.dst_rules.years.length; i++) {
        var year_rules = dst_dates(jstz.olson.dst_rules.years[i]);
        rule_list.push(year_rules);
      }

      return rule_list;
    };

    var check_has_dst = function check_has_dst(rules) {
      for (var i = 0; i < rules.length; i++) {
        if (rules[i] !== false) {
          return true;
        }
      }

      return false;
    };

    var rules = get_rules();
    var has_dst = check_has_dst(rules);

    if (has_dst) {
      return best_dst_match(rules, preliminary_timezone);
    }

    return preliminary_timezone;
  };
  /**
   * Uses get_timezone_info() to formulate a key to use in the olson.timezones dictionary.
   *
   * Returns an object with one function ".name()"
   *
   * @returns Object
   */


  var determine = function determine() {
    var preliminary_tz = get_from_internationalization_api();

    if (!preliminary_tz) {
      preliminary_tz = jstz.olson.timezones[lookup_key()];

      if (typeof consts.AMBIGUITIES[preliminary_tz] !== 'undefined') {
        preliminary_tz = get_by_dst(preliminary_tz);
      }
    }

    return {
      name: function name() {
        return preliminary_tz;
      },
      stdTimezoneOffset: function stdTimezoneOffset() {
        // negative to match what (new Date).getTimezoneOffset() will return
        return -lookup_key().split(',')[0];
      },
      timezoneOffset: function timezoneOffset() {
        // negative to match what (new Date).getTimezoneOffset() will return
        return -get_date_offset(new Date());
      }
    };
  };
  /**
   * The keys in this dictionary are comma separated as such:
   *
   * First the offset compared to UTC time in minutes.
   *
   * Then a flag which is 0 if the timezone does not take daylight savings into account and 1 if it
   * does.
   *
   * Thirdly an optional 's' signifies that the timezone is in the southern hemisphere,
   * only interesting for timezones with DST.
   *
   * The mapped arrays is used for constructing the jstz.TimeZone object from within
   * jstz.determine();
   */


  var olson = {
    timezones: {
      '-720,0': 'Etc/GMT+12',
      '-660,0': 'Pacific/Pago_Pago',
      '-660,1,s': 'Pacific/Apia',
      // Why? Because windows... cry!
      '-600,1': 'America/Adak',
      '-600,0': 'Pacific/Honolulu',
      '-570,0': 'Pacific/Marquesas',
      '-540,0': 'Pacific/Gambier',
      '-540,1': 'America/Anchorage',
      '-480,1': 'America/Los_Angeles',
      '-480,0': 'Pacific/Pitcairn',
      '-420,0': 'America/Phoenix',
      '-420,1': 'America/Denver',
      '-360,0': 'America/Guatemala',
      '-360,1': 'America/Chicago',
      '-360,1,s': 'Pacific/Easter',
      '-300,0': 'America/Bogota',
      '-300,1': 'America/New_York',
      '-270,0': 'America/Caracas',
      '-240,1': 'America/Halifax',
      '-240,0': 'America/Santo_Domingo',
      '-240,1,s': 'America/Asuncion',
      '-210,1': 'America/St_Johns',
      '-180,1': 'America/Godthab',
      '-180,0': 'America/Argentina/Buenos_Aires',
      '-180,1,s': 'America/Montevideo',
      '-120,0': 'America/Noronha',
      '-120,1': 'America/Noronha',
      '-60,1': 'Atlantic/Azores',
      '-60,0': 'Atlantic/Cape_Verde',
      '0,0': 'UTC',
      '0,1': 'Europe/London',
      '60,1': 'Europe/Berlin',
      '60,0': 'Africa/Lagos',
      '60,1,s': 'Africa/Windhoek',
      '120,1': 'Asia/Beirut',
      '120,0': 'Africa/Johannesburg',
      '180,0': 'Asia/Baghdad',
      '180,1': 'Europe/Moscow',
      '210,1': 'Asia/Tehran',
      '240,0': 'Asia/Dubai',
      '240,1': 'Asia/Baku',
      '270,0': 'Asia/Kabul',
      '300,1': 'Asia/Yekaterinburg',
      '300,0': 'Asia/Karachi',
      '330,0': 'Asia/Kolkata',
      '345,0': 'Asia/Kathmandu',
      '360,0': 'Asia/Dhaka',
      '360,1': 'Asia/Omsk',
      '390,0': 'Asia/Rangoon',
      '420,1': 'Asia/Krasnoyarsk',
      '420,0': 'Asia/Jakarta',
      '480,0': 'Asia/Shanghai',
      '480,1': 'Asia/Irkutsk',
      '525,0': 'Australia/Eucla',
      '525,1,s': 'Australia/Eucla',
      '540,1': 'Asia/Yakutsk',
      '540,0': 'Asia/Tokyo',
      '570,0': 'Australia/Darwin',
      '570,1,s': 'Australia/Adelaide',
      '600,0': 'Australia/Brisbane',
      '600,1': 'Asia/Vladivostok',
      '600,1,s': 'Australia/Sydney',
      '630,1,s': 'Australia/Lord_Howe',
      '660,1': 'Asia/Kamchatka',
      '660,0': 'Pacific/Noumea',
      '690,0': 'Pacific/Norfolk',
      '720,1,s': 'Pacific/Auckland',
      '720,0': 'Pacific/Majuro',
      '765,1,s': 'Pacific/Chatham',
      '780,0': 'Pacific/Tongatapu',
      '780,1,s': 'Pacific/Apia',
      '840,0': 'Pacific/Kiritimati'
    },
    dst_rules: dst_rules
  };
  var jstz = {
    olson: olson
  };
  var jstz$1 = {
    determine: determine
  };

  return jstz$1;

}));
