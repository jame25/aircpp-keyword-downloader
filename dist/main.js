(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 45:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(738)["default"]);
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 74:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _regeneratorRuntime = __webpack_require__(756);

var _asyncToGenerator = __webpack_require__(293);

var _defineProperty = __webpack_require__(693);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var invariant = __webpack_require__(308); // Remove settings that are using the default value


var filterDefaultValues = function filterDefaultValues(settingValueMap, definitions) {
  var nonDefaultValues = Object.keys(settingValueMap).reduce(function (reduced, key) {
    var definition = definitions.find(function (def) {
      return def.key === key;
    });

    if (!definition) {
      return reduced;
    }

    if (settingValueMap[key] === definition.default_value) {
      return reduced;
    }

    reduced[key] = settingValueMap[key];
    return reduced;
  }, {});
  return nonDefaultValues;
};

module.exports = function (extension, logger, fs, api) {
  var configFile = extension.configFile,
      configVersion = extension.configVersion,
      definitions = extension.definitions;
  var settings;
  var valuesUpdatedCallback; // Handler for API event for updated settings

  var onSettingsUpdated = function onSettingsUpdated(updatedValues) {
    settings = _objectSpread(_objectSpread({}, settings), updatedValues);

    if (valuesUpdatedCallback) {
      valuesUpdatedCallback(updatedValues);
    }

    logger.verbose("Writing settings to ".concat(configFile, "..."));
    var fileContent = {
      version: configVersion,
      settings: filterDefaultValues(settings, definitions)
    };
    fs.writeFile(configFile, JSON.stringify(fileContent, null, 2), function (err) {
      if (err) {
        logger.error("Failed to save settings to ".concat(configFile, ": ").concat(err));
      }
    });
  };

  var hasDefinition = function hasDefinition(key) {
    return !!definitions.find(function (def) {
      return def.key === key;
    });
  }; // Get setting value by key


  var getValue = function getValue(key) {
    invariant(hasDefinition(key), "Definition for key ".concat(key, " was not found"));
    return settings[key];
  }; // Update a single setting value


  var setValue = function setValue(key, value) {
    invariant(hasDefinition(key), "Definition for key ".concat(key, " was not found"));
    return api.updateSettings(_defineProperty({}, key, value));
  }; // Initialize settings API


  var registerApi = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(settingsLoaded) {
      var filteredSettings;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return api.postDefinitions(definitions);

            case 2:
              if (!settingsLoaded) {
                _context.next = 6;
                break;
              }

              // Remove possible obsolete settings that were loaded (those would cause an error with the API)
              filteredSettings = Object.keys(settings).reduce(function (reduced, key) {
                if (hasDefinition(key)) {
                  reduced[key] = settings[key];
                }

                return reduced;
              }, {}); // Send the loaded settings

              _context.next = 6;
              return api.updateSettings(filteredSettings);

            case 6:
              _context.next = 8;
              return api.getSettings();

            case 8:
              settings = _context.sent;
              // Listen for updated setting values
              api.addSettingUpdateListener(onSettingsUpdated);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function registerApi(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var load = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(convertHandler) {
      var settingsLoaded, data;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              settingsLoaded = false; // Attempt to load saved settings

              _context2.prev = 1;
              logger.verbose("Loading settings from ".concat(configFile, "..."));
              data = JSON.parse(fs.readFileSync(configFile, 'utf8'));

              if (!(data && (!data.version || !data.settings))) {
                _context2.next = 6;
                break;
              }

              throw 'Invalid settings format';

            case 6:
              if (data.version !== configVersion && convertHandler) {
                settings = convertHandler(data.version, data.settings);
                invariant(settings, "Migration handler should return the new settings");
              } else {
                settings = data.settings;
              }

              settingsLoaded = true;
              _context2.next = 13;
              break;

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](1);
              logger.verbose("Failed to load settings: ".concat(_context2.t0));

            case 13:
              _context2.prev = 13;
              _context2.next = 16;
              return registerApi(settingsLoaded);

            case 16:
              _context2.next = 21;
              break;

            case 18:
              _context2.prev = 18;
              _context2.t1 = _context2["catch"](13);
              logger.error('Failed to register settings: ' + _context2.t1.message);

            case 21:
              if (valuesUpdatedCallback) {
                valuesUpdatedCallback(settings);
              }

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 10], [13, 18]]);
    }));

    return function load(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  return {
    getValue: getValue,
    setValue: setValue,
    load: load,

    set onValuesUpdated(handler) {
      valuesUpdatedCallback = handler;
    },

    getValues: function getValues() {
      return _objectSpread({}, settings);
    }
  };
};

/***/ }),

/***/ 125:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDb = void 0;
const stormdb_1 = __importDefault(__webpack_require__(844));
let db;
const getDb = async (dbPath) => {
    if (!db) {
        const engine = new stormdb_1.default.localFileEngine(dbPath);
        db = new stormdb_1.default(engine);
        if (!db.get('search_history').value()) {
            db.set('search_history', []);
        }
        if (!db.get('download_history').value()) {
            db.set('download_history', []);
        }
        await db.save();
    }
    return db;
};
exports.getDb = getDb;


/***/ }),

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __importDefault(__webpack_require__(927));
module.exports = main_1.default;


/***/ }),

/***/ 172:
/***/ ((module) => {

function _OverloadYield(e, d) {
  this.v = e, this.k = d;
}
module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 185:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildSearchQuery = exports.turnNicksIntoArray = exports.getExcludedUsers = exports.isDupe = exports.hasNFOFiles = exports.isDirectoryResult = exports.calculateRelevanceScore = exports.escapeRegExp = exports.parseNFOContent = exports.sleep = void 0;
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const parseNFOContent = async (content, keywords, caseSensitive, wholeWordsOnly) => {
    const matchedKeywords = [];
    const searchContent = caseSensitive ? content : content.toLowerCase();
    for (const keyword of keywords) {
        const searchKeyword = caseSensitive ? keyword : keyword.toLowerCase();
        let found = false;
        if (wholeWordsOnly) {
            const regex = new RegExp(`\\b${(0, exports.escapeRegExp)(searchKeyword)}\\b`, caseSensitive ? 'g' : 'gi');
            found = regex.test(searchContent);
        }
        else {
            found = searchContent.includes(searchKeyword);
        }
        if (found && !matchedKeywords.includes(keyword)) {
            matchedKeywords.push(keyword);
        }
    }
    return matchedKeywords;
};
exports.parseNFOContent = parseNFOContent;
const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
exports.escapeRegExp = escapeRegExp;
const calculateRelevanceScore = (matchedKeywords, totalKeywords, fileSize) => {
    const keywordScore = (matchedKeywords.length / totalKeywords) * 100;
    const sizeBonus = Math.min(fileSize / (1024 * 1024 * 100), 10); // Bonus for larger files, max 10 points
    return Math.round(keywordScore + sizeBonus);
};
exports.calculateRelevanceScore = calculateRelevanceScore;
const isDirectoryResult = (result) => {
    return result.type.id === 'directory' || result.type.str === 'Directory';
};
exports.isDirectoryResult = isDirectoryResult;
const hasNFOFiles = (result, fileTypes) => {
    return fileTypes.some(ext => result.name.toLowerCase().includes(ext.toLowerCase()));
};
exports.hasNFOFiles = hasNFOFiles;
const isDupe = (dupeInfo) => {
    return dupeInfo && dupeInfo.id !== 'none';
};
exports.isDupe = isDupe;
const getExcludedUsers = (excludedUsersString) => {
    return excludedUsersString
        .map(user => user.trim())
        .filter(user => user.length > 0);
};
exports.getExcludedUsers = getExcludedUsers;
const turnNicksIntoArray = (nicks) => {
    if (Array.isArray(nicks)) {
        return nicks;
    }
    return [nicks];
};
exports.turnNicksIntoArray = turnNicksIntoArray;
const buildSearchQuery = (searchItem) => {
    return {
        pattern: searchItem.keywords.join(' OR '),
        file_type: 'directory',
        min_size: searchItem.min_directory_size * 1024 * 1024,
        max_size: 0,
        extensions: searchItem.file_types.join(',')
    };
};
exports.buildSearchQuery = buildSearchQuery;


/***/ }),

/***/ 293:
/***/ ((module) => {

function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 308:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = "production";

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),

/***/ 334:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.printEvent = void 0;
const api_1 = __webpack_require__(490);
const printEvent = (message, severity = api_1.SeverityEnum.INFO) => {
    if (global.SETTINGS?.getValue('enable_logging')) {
        global.SOCKET.post('events', {
            text: `[NFO Keyword Searcher] ${message}`,
            severity: severity.toLowerCase(),
        }).catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to log event:', error);
        });
    }
};
exports.printEvent = printEvent;


/***/ }),

/***/ 373:
/***/ ((module) => {

function _regeneratorKeys(e) {
  var n = Object(e),
    r = [];
  for (var t in n) r.unshift(t);
  return function e() {
    for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e;
    return e.done = !0, e;
  };
}
module.exports = _regeneratorKeys, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 383:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 451:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.migrate = exports.SettingDefinitions = void 0;
exports.SettingDefinitions = [
    {
        key: 'search_items',
        title: 'NFO/TXT Keyword Search Items',
        default_value: [],
        type: 'list',
        item_type: 'object',
        definitions: [
            {
                key: 'name',
                title: 'Search name',
                default_value: '',
                type: 'string'
            },
            {
                key: 'keywords',
                title: 'Keywords to search for (comma-separated)',
                default_value: [],
                type: 'string_array'
            },
            {
                key: 'file_types',
                title: 'File types to search in',
                default_value: ['.nfo', '.txt', '.diz'],
                type: 'string_array'
            },
            {
                key: 'enabled',
                title: 'Enabled',
                default_value: true,
                type: 'boolean'
            },
            {
                key: 'case_sensitive',
                title: 'Case sensitive search',
                default_value: false,
                type: 'boolean'
            },
            {
                key: 'whole_words_only',
                title: 'Match whole words only',
                default_value: false,
                type: 'boolean'
            },
            {
                key: 'min_directory_size',
                title: 'Minimum directory size (MB)',
                default_value: 0,
                type: 'number'
            },
            {
                key: 'max_results',
                title: 'Maximum results to download per search',
                default_value: 5,
                type: 'number'
            },
            {
                key: 'target_directory',
                title: 'Target download directory',
                default_value: '',
                type: 'string'
            },
            {
                key: 'priority',
                title: 'Download priority',
                default_value: 0,
                type: 'number'
            }
        ]
    },
    {
        key: 'search_interval',
        title: 'Search interval (minutes)',
        default_value: 30,
        type: 'number'
    },
    {
        key: 'max_file_size_to_parse',
        title: 'Maximum NFO/TXT file size to parse (KB)',
        default_value: 100,
        type: 'number'
    },
    {
        key: 'search_timeout',
        title: 'Search timeout (seconds)',
        default_value: 60,
        type: 'number'
    },
    {
        key: 'enable_logging',
        title: 'Enable detailed logging',
        default_value: true,
        type: 'boolean'
    },
    {
        key: 'excluded_users',
        title: 'Excluded users (comma-separated)',
        default_value: [],
        type: 'string_array'
    }
];
const migrate = (loadedData) => {
    return loadedData;
};
exports.migrate = migrate;


/***/ }),

/***/ 490:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeverityEnum = void 0;
var SeverityEnum;
(function (SeverityEnum) {
    SeverityEnum["INFO"] = "info";
    SeverityEnum["WARNING"] = "warning";
    SeverityEnum["ERROR"] = "error";
})(SeverityEnum = exports.SeverityEnum || (exports.SeverityEnum = {}));


/***/ }),

/***/ 546:
/***/ ((module) => {

function _regeneratorDefine(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e) {
    i = 0;
  }
  module.exports = _regeneratorDefine = function regeneratorDefine(e, r, n, t) {
    if (r) i ? i(e, r, {
      value: n,
      enumerable: !t,
      configurable: !t,
      writable: !t
    }) : e[r] = n;else {
      var o = function o(r, n) {
        _regeneratorDefine(e, r, function (e) {
          return this._invoke(r, n, e);
        });
      };
      o("next", 0), o("throw", 1), o("return", 2);
    }
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _regeneratorDefine(e, r, n, t);
}
module.exports = _regeneratorDefine, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 570:
/***/ ((module) => {

class StormDB {
  constructor(engine) {
    this.engine = engine;

    this.state = this.engine.init();
    this.pointers = [];
  }

  default(defaultValue) {
    let stateEmpty =
      Object.keys(this.state).length === 0 && this.state.constructor === Object;

    if (stateEmpty) this.state = defaultValue;

    return this;
  }

  length() {
    this.pointers.push("length");
    return this;
  }

  delete(reindexLists = false) {
    let enclosing = this.state;
    for (let i = 0; i < this.pointers.length - 1; i++) {
      enclosing = enclosing[this.pointers[i]];
    }

    let final = this.pointers[this.pointers.length - 1];

    if (Array.isArray(enclosing) && reindexLists) {
      enclosing.splice(final, 1);
    } else {
      delete enclosing[final];
    }
  }

  push(value) {
    let list = this.value();

    if (!Array.isArray(list)) throw new Error("You can only push to lists.");

    list.push(value);
    this.set(list);

    return this;
  }

  map(func) {
    let list = this.value();

    if (typeof func !== "function")
      throw new Error("You can only pass functions to .map().");
    if (!Array.isArray(list)) throw new Error("You can only map lists.");

    list = list.map(func);
    this.set(list);

    return this;
  }

  filter(func) {
    let list = this.value();

    if (typeof func !== "function")
      throw new Error("You can only pass functions to .filter().");
    if (!Array.isArray(list)) throw new Error("You can only filter lists.");

    list = list.filter(func);
    this.set(list);

    return this;
  }

  sort(func) {
    let list = this.value();

    if (typeof func !== "function" && func !== undefined)
      throw new Error("You can only pass functions or nothing to .sort().");
    if (!Array.isArray(list)) throw new Error("You can only sort lists.");

    list.sort(func);
    this.set(list);

    return this;
  }

  reduce(func) {
    let list = this.value();

    if (typeof func !== "function")
      throw new Error("You can only pass functions to .reduce().");
    if (!Array.isArray(list)) throw new Error("You can only reduce lists.");

    let reducedValue = list.reduce(func);
    this.set(reducedValue);

    return this;
  }

  get(value) {
    let extraPointers;
    if (typeof value === "string") extraPointers = value.split(".");
    else extraPointers = [value];

    let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    clone.pointers = [...clone.pointers, ...extraPointers];
    return clone;
  }

  set(key, value) {
    if (value === undefined) {
      this.setValue(key);
    } else {
      let extraPointers;
      if (typeof key === "string") extraPointers = key.split(".");
      else extraPointers = [key];

      this.setValue(value, extraPointers);
    }
    return this;
  }

  value() {
    let data = this.state;
    for (let i = 0; i < this.pointers.length; i++) {
      if (i < this.pointers.length - 1 && !data[this.pointers[i]]) {
        throw new Error(
          "Can't run .value() on non-existant property of non-existant object."
        );
      }
      data = data[this.pointers[i]];
    }

    return data;
  }

  setValue(value, pointers = [], setrecursively = true) {
    let depth = 0;

    pointers = [...this.pointers, ...pointers];

    const func = (a, b) => {
      depth += 1;

      let finalLevel = depth === pointers.length;
      if (setrecursively && typeof a[b] === "undefined" && !finalLevel) {
        a[b] = {};
        return a[b];
      }

      if (finalLevel) {
        a[b] = value;
        return value;
      } else {
        return a[b];
      }
    };
    pointers.reduce(func, this.state);
  }

  save() {
    return this.engine.write(this.state);
  }
}

module.exports = StormDB;


/***/ }),

/***/ 579:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(738)["default"]);
function _regeneratorValues(e) {
  if (null != e) {
    var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"],
      r = 0;
    if (t) return t.call(e);
    if ("function" == typeof e.next) return e;
    if (!isNaN(e.length)) return {
      next: function next() {
        return e && r >= e.length && (e = void 0), {
          value: e && e[r++],
          done: !e
        };
      }
    };
  }
  throw new TypeError(_typeof(e) + " is not iterable");
}
module.exports = _regeneratorValues, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 605:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var invariant = __webpack_require__(308);

var settingsManager = __webpack_require__(74);

var DefaultAPIHandler = function DefaultAPIHandler(socket, extensionName) {
  return {
    postDefinitions: function postDefinitions(definitions) {
      return socket.post("extensions/".concat(extensionName, "/settings/definitions"), definitions);
    },
    getSettings: function getSettings() {
      return socket.get("extensions/".concat(extensionName, "/settings"));
    },
    updateSettings: function updateSettings(settings) {
      return socket.patch("extensions/".concat(extensionName, "/settings"), settings);
    },
    addSettingUpdateListener: function addSettingUpdateListener(callback) {
      return socket.addListener('extensions', 'extension_settings_updated', callback, extensionName);
    }
  };
};

module.exports = function (socket, extension) {
  var extensionName = extension.extensionName,
      configVersion = extension.configVersion,
      definitions = extension.definitions;
  invariant(configVersion, 'Settings version should be a positive integer');
  invariant(Array.isArray(definitions), 'Setting definitions should be an array');
  var API = DefaultAPIHandler(socket, extensionName);
  var manager = settingsManager(extension, socket.logger, __webpack_require__(383), API);
  return manager;
};

/***/ }),

/***/ 633:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var OverloadYield = __webpack_require__(172);
var regenerator = __webpack_require__(993);
var regeneratorAsync = __webpack_require__(869);
var regeneratorAsyncGen = __webpack_require__(887);
var regeneratorAsyncIterator = __webpack_require__(791);
var regeneratorKeys = __webpack_require__(373);
var regeneratorValues = __webpack_require__(579);
function _regeneratorRuntime() {
  "use strict";

  var r = regenerator(),
    e = r.m(_regeneratorRuntime),
    t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor;
  function n(r) {
    var e = "function" == typeof r && r.constructor;
    return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name));
  }
  var o = {
    "throw": 1,
    "return": 2,
    "break": 3,
    "continue": 3
  };
  function a(r) {
    var e, t;
    return function (n) {
      e || (e = {
        stop: function stop() {
          return t(n.a, 2);
        },
        "catch": function _catch() {
          return n.v;
        },
        abrupt: function abrupt(r, e) {
          return t(n.a, o[r], e);
        },
        delegateYield: function delegateYield(r, o, a) {
          return e.resultName = o, t(n.d, regeneratorValues(r), a);
        },
        finish: function finish(r) {
          return t(n.f, r);
        }
      }, t = function t(r, _t, o) {
        n.p = e.prev, n.n = e.next;
        try {
          return r(_t, o);
        } finally {
          e.next = n.n;
        }
      }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n;
      try {
        return r.call(this, e);
      } finally {
        n.p = e.prev, n.n = e.next;
      }
    };
  }
  return (module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return {
      wrap: function wrap(e, t, n, o) {
        return r.w(a(e), t, n, o && o.reverse());
      },
      isGeneratorFunction: n,
      mark: r.m,
      awrap: function awrap(r, e) {
        return new OverloadYield(r, e);
      },
      AsyncIterator: regeneratorAsyncIterator,
      async: function async(r, e, t, o, u) {
        return (n(e) ? regeneratorAsyncGen : regeneratorAsync)(a(r), e, t, o, u);
      },
      keys: regeneratorKeys,
      values: regeneratorValues
    };
  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 648:
/***/ ((module) => {

module.exports = class LocalEngine {
  constructor(path, options = {}) {
    this.path = path;

    this.serialize = options.serialize || JSON.stringify;
    this.deserialize = options.deserialize || JSON.parse;
  }

  init() {
    const exists = localStorage.getItem(this.path);
    if (!exists) {
      localStorage.setItem(this.path, this.serialize({}));
      return {};
    } else {
      return this.read();
    }
  }

  read() {
    let data = localStorage.getItem(this.path);

    try {
      let json = this.deserialize(data);
      return json;
    } catch (error) {
      error.message =
        "Failed to load StormDB database file - invalid or corrupted format.";
      throw error;
    }
  }

  write(data) {
    localStorage.setItem(this.path, this.serialize(data));
  }
};


/***/ }),

/***/ 693:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPropertyKey = __webpack_require__(736);
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 736:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(738)["default"]);
var toPrimitive = __webpack_require__(45);
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 738:
/***/ ((module) => {

function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 739:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(383);

module.exports = class LocalEngine {
  constructor(path, options = {}) {
    this.path = path;

    this.async = options.async || false;
    this.serialize = options.serialize || JSON.stringify;
    this.deserialize = options.deserialize || JSON.parse;
  }

  init() {
    const exists = fs.existsSync(this.path);
    if (!exists) {
      fs.writeFileSync(this.path, this.serialize({}));
      return {};
    } else {
      return this.read();
    }
  }

  read() {
    let data = fs.readFileSync(this.path, "UTF-8");
    if (data === "") data = "{}";

    try {
      let json = this.deserialize(data);
      return json;
    } catch (error) {
      error.message =
        "Failed to load StormDB database file - invalid or corrupted format.";
      throw error;
    }
  }

  write(data) {
    // if async, return promise wrapper around async writefile
    if (this.async) {
      return new Promise(
        function (resolve, reject) {
          fs.writeFile(this.path, this.serialize(data), function (error) {
            if (error) return reject(error);
            else resolve();
          });
        }.bind(this)
      );
    }

    fs.writeFileSync(this.path, this.serialize(data));
    return null;
  }
};


/***/ }),

/***/ 756:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(633)();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ 791:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var OverloadYield = __webpack_require__(172);
var regeneratorDefine = __webpack_require__(546);
function AsyncIterator(t, e) {
  function n(r, o, i, f) {
    try {
      var c = t[r](o),
        u = c.value;
      return u instanceof OverloadYield ? e.resolve(u.v).then(function (t) {
        n("next", t, i, f);
      }, function (t) {
        n("throw", t, i, f);
      }) : e.resolve(u).then(function (t) {
        c.value = t, i(c);
      }, function (t) {
        return n("throw", t, i, f);
      });
    } catch (t) {
      f(t);
    }
  }
  var r;
  this.next || (regeneratorDefine(AsyncIterator.prototype), regeneratorDefine(AsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () {
    return this;
  })), regeneratorDefine(this, "_invoke", function (t, o, i) {
    function f() {
      return new e(function (e, r) {
        n(t, i, e, r);
      });
    }
    return r = r ? r.then(f, f) : f();
  }, !0);
}
module.exports = AsyncIterator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 806:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runSearch = exports.initializeSearchInterval = void 0;
const api_1 = __webpack_require__(490);
const localdb_1 = __webpack_require__(125);
const log_1 = __webpack_require__(334);
const utils = __importStar(__webpack_require__(185));
const initializeSearchInterval = async (searchInterval) => {
    global.SEARCH_INTERVAL = setInterval(() => {
        (0, exports.runSearch)();
    }, searchInterval * 60 * 1000);
};
exports.initializeSearchInterval = initializeSearchInterval;
const runSearch = async () => {
    const searchItems = global.SETTINGS.getValue('search_items');
    const enabledItems = searchItems.filter(item => item.enabled);
    if (enabledItems.length === 0) {
        return;
    }
    for (const searchItem of enabledItems) {
        if (searchItem.keywords.length === 0) {
            continue;
        }
        try {
            await performKeywordSearch(searchItem);
            await utils.sleep(5000); // Wait 5 seconds between searches
        }
        catch (error) {
            (0, log_1.printEvent)(`Error searching for "${searchItem.name}": ${error.message}`, api_1.SeverityEnum.ERROR);
        }
    }
};
exports.runSearch = runSearch;
const performKeywordSearch = async (searchItem) => {
    (0, log_1.printEvent)(`Starting NFO/TXT keyword search for: ${searchItem.name}`, api_1.SeverityEnum.INFO);
    // Create search instance
    const instance = await global.SOCKET.post('search', {
        expiration: 10
    });
    const results = [];
    const nfoResults = [];
    // Build search query for directories
    const query = utils.buildSearchQuery(searchItem);
    // Add result listeners
    const removeResultAddedListener = await global.SOCKET.addListener('search', 'search_result_added', (searchResult) => {
        if (utils.isDirectoryResult(searchResult.result)) {
            results.push(searchResult.result);
        }
    }, instance.id);
    const removeResultUpdatedListener = await global.SOCKET.addListener('search', 'search_result_updated', (searchResult) => {
        const index = results.findIndex(r => r.id === searchResult.result.id);
        if (index !== -1) {
            results[index] = searchResult.result;
        }
    }, instance.id);
    const removeOnSearchSentListener = await global.SOCKET.addListener('search', 'search_hub_searches_sent', (searchInfo) => {
        const listeners = [
            removeOnSearchSentListener,
            removeResultAddedListener,
            removeResultUpdatedListener
        ];
        onSearchSent(searchItem, instance, listeners, searchInfo, results, nfoResults);
    }, instance.id);
    // Perform the search
    await global.SOCKET.post(`search/${instance.id}/hub_search`, { query });
};
const onSearchSent = async (searchItem, instance, listeners, searchInfo, results, nfoResults) => {
    (0, log_1.printEvent)(`Searching ${searchInfo.sent} hubs for directories with NFO/TXT files`, api_1.SeverityEnum.INFO);
    const excludedUsers = utils.getExcludedUsers(global.SETTINGS.getValue('excluded_users'));
    const maxFileSize = global.SETTINGS.getValue('max_file_size_to_parse') * 1024; // Convert KB to bytes
    const searchTimeout = global.SETTINGS.getValue('search_timeout');
    let waited = 0;
    const maxWait = searchTimeout;
    // Collect results for some time
    while (waited < maxWait) {
        await utils.sleep(2000);
        waited += 2;
        if (results.length > 0) {
            // Process directory results to find NFO/TXT files
            for (const result of results) {
                if (nfoResults.length >= searchItem.max_results) {
                    break;
                }
                try {
                    const nfoResult = await processDirectoryForNFO(result, searchItem, maxFileSize, excludedUsers);
                    if (nfoResult) {
                        nfoResults.push(nfoResult);
                    }
                }
                catch (error) {
                    (0, log_1.printEvent)(`Error processing directory "${result.name}": ${error.message}`, api_1.SeverityEnum.WARNING);
                }
            }
            if (nfoResults.length >= searchItem.max_results || waited >= 30) {
                break;
            }
        }
    }
    // Process found NFO results
    if (nfoResults.length > 0) {
        (0, log_1.printEvent)(`Found ${nfoResults.length} directories with matching NFO/TXT content`, api_1.SeverityEnum.INFO);
        for (const nfoResult of nfoResults.slice(0, searchItem.max_results)) {
            await startDownload(nfoResult, searchItem);
        }
    }
    else {
        (0, log_1.printEvent)(`No directories found with matching NFO/TXT content for: ${searchItem.name}`, api_1.SeverityEnum.INFO);
    }
    // Save search history
    await saveSearchHistory(searchItem, nfoResults.length);
    // Clean up listeners
    for (const listener of listeners) {
        listener();
    }
};
const processDirectoryForNFO = async (result, searchItem, maxFileSize, excludedUsers) => {
    // Check excluded users
    const nicks = utils.turnNicksIntoArray(result.users.user.nicks);
    if (excludedUsers.length > 0 && result.users.count === 1) {
        const isExcluded = excludedUsers.some(excludeUser => nicks.some(nick => nick.includes(excludeUser)));
        if (isExcluded) {
            return null;
        }
    }
    // Check for dupes if needed
    if (utils.isDupe(result.dupe)) {
        return null;
    }
    // Try to get directory listing to find NFO/TXT files
    try {
        const directoryListing = await global.SOCKET.post('share/find_nfo_file', {
            user: result.users.user,
            path: result.path || result.name,
            file_types: searchItem.file_types
        });
        if (directoryListing && directoryListing.length > 0) {
            // Found NFO/TXT files, now check their content
            for (const file of directoryListing) {
                if (file.size > maxFileSize) {
                    continue; // Skip files that are too large
                }
                try {
                    // Download and parse NFO/TXT file content
                    const fileContent = await global.SOCKET.post('share/download_text_file', {
                        user: result.users.user,
                        path: file.path,
                        max_size: maxFileSize
                    });
                    if (fileContent && fileContent.text) {
                        const matchedKeywords = await utils.parseNFOContent(fileContent.text, searchItem.keywords, searchItem.case_sensitive, searchItem.whole_words_only);
                        if (matchedKeywords.length > 0) {
                            const relevanceScore = utils.calculateRelevanceScore(matchedKeywords, searchItem.keywords.length, result.size);
                            return {
                                directory_name: result.name,
                                directory_path: result.path || result.name,
                                nfo_file_path: file.path,
                                nfo_content: fileContent.text.substring(0, 500),
                                matched_keywords: matchedKeywords,
                                file_size: result.size,
                                user_count: result.users.count,
                                relevance_score: relevanceScore
                            };
                        }
                    }
                }
                catch (fileError) {
                    (0, log_1.printEvent)(`Could not read file ${file.path}: ${fileError.message}`, api_1.SeverityEnum.WARNING);
                    continue;
                }
            }
        }
    }
    catch (error) {
        // Fallback: assume directory contains NFO if it matches our criteria
        const hasNFOInName = searchItem.file_types.some((ext) => result.name.toLowerCase().includes(ext.toLowerCase().replace('.', '')));
        if (hasNFOInName) {
            const matchedKeywords = await utils.parseNFOContent(result.name, searchItem.keywords, searchItem.case_sensitive, searchItem.whole_words_only);
            if (matchedKeywords.length > 0) {
                return {
                    directory_name: result.name,
                    directory_path: result.path || result.name,
                    nfo_file_path: 'unknown',
                    nfo_content: 'Content not available - matched by directory name',
                    matched_keywords: matchedKeywords,
                    file_size: result.size,
                    user_count: result.users.count,
                    relevance_score: 50
                };
            }
        }
    }
    return null;
};
const startDownload = async (nfoResult, searchItem) => {
    try {
        (0, log_1.printEvent)(`Downloading "${nfoResult.directory_name}" (matched: ${nfoResult.matched_keywords.join(', ')})`, api_1.SeverityEnum.INFO);
        // Queue the directory download
        await global.SOCKET.post('queue', {
            target: searchItem.target_directory || 'auto',
            priority: searchItem.priority || 0,
            path: nfoResult.directory_path,
            size: nfoResult.file_size
        });
    }
    catch (error) {
        (0, log_1.printEvent)(`Failed to download "${nfoResult.directory_name}": ${error.message}`, api_1.SeverityEnum.ERROR);
    }
};
const saveSearchHistory = async (searchItem, resultsFound) => {
    try {
        const db = await (0, localdb_1.getDb)(global.DbPath);
        const historyItem = {
            keywords: searchItem.keywords,
            timestamp: new Date(),
            results_found: resultsFound,
            downloads_started: resultsFound,
            search_item_id: searchItem.id
        };
        db.get('search_history').value().push(historyItem);
        await db.save();
    }
    catch (error) {
        (0, log_1.printEvent)(`Failed to save search history: ${error.message}`, api_1.SeverityEnum.WARNING);
    }
};


/***/ }),

/***/ 844:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(570);
module.exports.localFileEngine = __webpack_require__(739);
module.exports.browserEngine = __webpack_require__(648);


/***/ }),

/***/ 869:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var regeneratorAsyncGen = __webpack_require__(887);
function _regeneratorAsync(n, e, r, t, o) {
  var a = regeneratorAsyncGen(n, e, r, t, o);
  return a.next().then(function (n) {
    return n.done ? n.value : a.next();
  });
}
module.exports = _regeneratorAsync, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 887:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var regenerator = __webpack_require__(993);
var regeneratorAsyncIterator = __webpack_require__(791);
function _regeneratorAsyncGen(r, e, t, o, n) {
  return new regeneratorAsyncIterator(regenerator().w(r, e, t, o), n || Promise);
}
module.exports = _regeneratorAsyncGen, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 927:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const settings_1 = __webpack_require__(451);
const localdb_1 = __webpack_require__(125);
const search_1 = __webpack_require__(806);
// Settings manager docs: https://github.com/airdcpp-web/airdcpp-extension-settings-js
const airdcpp_extension_settings_1 = __importDefault(__webpack_require__(605));
const CONFIG_VERSION = 1;
exports["default"] = (socket, extension) => {
    console.log('1. Extension module loaded');
    global.SOCKET = socket;
    global.DbPath = extension.configPath + 'db.json';
    extension.onStart = async () => {
        console.log('2. Extension onStart called');
        try {
            await (0, localdb_1.getDb)(global.DbPath);
            console.log('3. Database initialized');
            // INITIALIZATION
            global.SETTINGS = (0, airdcpp_extension_settings_1.default)(socket, {
                extensionName: extension.name,
                configFile: extension.configPath + 'config.json',
                configVersion: CONFIG_VERSION,
                definitions: settings_1.SettingDefinitions,
            });
            console.log('4. Settings manager created');
            await global.SETTINGS.load(settings_1.migrate);
            console.log('5. Settings loaded');
            // Set up search interval
            (0, search_1.initializeSearchInterval)(global.SETTINGS.getValue('search_interval'));
            console.log('6. Search interval initialized');
            global.SETTINGS.onValuesUpdated = async (updatedValues) => {
                // Reset search interval if changed
                if (Object.prototype.hasOwnProperty.call(updatedValues, 'search_interval')) {
                    clearInterval(global.SEARCH_INTERVAL);
                    (0, search_1.initializeSearchInterval)(updatedValues.search_interval);
                }
            };
            // Perform an initial search on startup
            setTimeout(() => {
                (0, search_1.runSearch)();
            }, 5000); // Wait 5 seconds after startup
            console.log('7. Extension fully initialized');
        }
        catch (error) {
            console.error('Extension initialization error:', error);
            throw error;
        }
    };
    extension.onStop = async () => {
        console.log('Extension stopping...');
        clearInterval(global.SEARCH_INTERVAL);
        const db = await (0, localdb_1.getDb)(global.DbPath);
        await db.save();
        console.log('Extension stopped');
    };
    console.log('8. Extension handlers registered');
};


/***/ }),

/***/ 993:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var regeneratorDefine = __webpack_require__(546);
function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
  var e,
    t,
    r = "function" == typeof Symbol ? Symbol : {},
    n = r.iterator || "@@iterator",
    o = r.toStringTag || "@@toStringTag";
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return regeneratorDefine(u, "_invoke", function (r, n, o) {
      var i,
        c,
        u,
        f = 0,
        p = o || [],
        y = !1,
        G = {
          p: 0,
          n: 0,
          v: e,
          a: d,
          f: d.bind(e, 4),
          d: function d(t, r) {
            return i = t, c = 0, u = e, G.n = r, a;
          }
        };
      function d(r, n) {
        for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
          var o,
            i = p[t],
            d = G.p,
            l = i[2];
          r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
        }
        if (o || r > 1) return a;
        throw y = !0, n;
      }
      return function (o, p, l) {
        if (f > 1) throw TypeError("Generator is already running");
        for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
          i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
          try {
            if (f = 2, i) {
              if (c || (o = "next"), t = i[o]) {
                if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                if (!t.done) return t;
                u = t.value, c < 2 && (c = 0);
              } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
              i = e;
            } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
          } catch (t) {
            i = e, c = 1, u = t;
          } finally {
            f = 1;
          }
        }
        return {
          value: t,
          done: y
        };
      };
    }(r, o, i), !0), u;
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n] ? t(t([][n]())) : (regeneratorDefine(t = {}, n, function () {
      return this;
    }), t),
    u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
  function f(e) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), regeneratorDefine(u), regeneratorDefine(u, o, "Generator"), regeneratorDefine(u, n, function () {
    return this;
  }), regeneratorDefine(u, "toString", function () {
    return "[object Generator]";
  }), (module.exports = _regenerator = function _regenerator() {
    return {
      w: i,
      m: f
    };
  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
}
module.exports = _regenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(156);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=main.js.map
