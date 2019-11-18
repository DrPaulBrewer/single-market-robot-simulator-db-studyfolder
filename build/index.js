'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StudyFolder = exports.arrayPrefer = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright 2018- Paul Brewer, Economic and Financial Technology Consulting LLC */
/* This file is open source software.  The MIT License applies to this software. */

/* eslint-disable no-console */

var _arrayPrefer = require('array-prefer');

var _arrayPrefer2 = _interopRequireDefault(_arrayPrefer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.arrayPrefer = _arrayPrefer2.default;

var StudyFolder = exports.StudyFolder = function () {
    function StudyFolder(props) {
        var _this = this;

        _classCallCheck(this, StudyFolder);

        Object.keys(props).forEach(function (k) {
            _this[k] = props[k];
        });
    }

    _createClass(StudyFolder, [{
        key: 'getConfig',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var folder, config, shouldFixName, shouldFixDescription;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                folder = this;
                                _context.next = 3;
                                return this.download({ name: 'config.json' });

                            case 3:
                                config = _context.sent;
                                shouldFixName = config.name && this.name && this.name.length && config.name !== this.name;
                                shouldFixDescription = config.description && this.description && this.description.length && config.description !== this.description;

                                if (shouldFixName) config.name = this.name;
                                if (shouldFixDescription) config.description = this.description;

                                if (this.readOnly) {
                                    _context.next = 12;
                                    break;
                                }

                                if (!(shouldFixName || shouldFixDescription)) {
                                    _context.next = 12;
                                    break;
                                }

                                _context.next = 12;
                                return this.upload({
                                    name: 'config.json',
                                    contents: config,
                                    force: true
                                });

                            case 12:
                                return _context.abrupt('return', { config: config, folder: folder });

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getConfig() {
                return _ref.apply(this, arguments);
            }

            return getConfig;
        }()
    }, {
        key: 'setConfig',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref2) {
                var config = _ref2.config;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(config && (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object')) {
                                    _context2.next = 10;
                                    break;
                                }

                                if (!(this.name && config.name !== this.name)) {
                                    _context2.next = 3;
                                    break;
                                }

                                throw new Error('mismatch at StudyFolder:setConfig configuration name ' + config.name + ' should equal the folder name ' + this.name);

                            case 3:
                                _context2.next = 5;
                                return this.upload({ name: 'config.json', contents: config });

                            case 5:
                                if (!(this.description !== config.description)) {
                                    _context2.next = 10;
                                    break;
                                }

                                this.description = config.description;

                                if (this.readOnly) {
                                    _context2.next = 10;
                                    break;
                                }

                                _context2.next = 10;
                                return this.update({ description: config.description });

                            case 10:
                                return _context2.abrupt('return', this);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function setConfig(_x) {
                return _ref3.apply(this, arguments);
            }

            return setConfig;
        }()
    }, {
        key: 'unimplemented',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(what) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                throw new Error(what + ' is unimplemented in StudyFolder base class and needs to be defined in a subclass');

                            case 1:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function unimplemented(_x2) {
                return _ref4.apply(this, arguments);
            }

            return unimplemented;
        }()
    }, {
        key: 'search',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                // (name)
                                this.unimplemented('search');

                            case 1:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function search() {
                return _ref5.apply(this, arguments);
            }

            return search;
        }()
    }, {
        key: 'listFiles',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                var _this2 = this;

                var files;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.search();

                            case 2:
                                files = _context5.sent;

                                if (this.hintFileId) {
                                    files = (0, _arrayPrefer2.default)(files, function (f) {
                                        return f.id === _this2.hintFileId;
                                    }, 1);
                                }
                                return _context5.abrupt('return', files);

                            case 5:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function listFiles() {
                return _ref6.apply(this, arguments);
            }

            return listFiles;
        }()
    }, {
        key: 'fileId',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(name) {
                var files, fileId;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.search(name);

                            case 2:
                                files = _context6.sent;
                                fileId = files && files[0] && files[0].id;
                                return _context6.abrupt('return', fileId);

                            case 5:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fileId(_x3) {
                return _ref7.apply(this, arguments);
            }

            return fileId;
        }()
    }, {
        key: 'download',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                // ({name,id})
                                this.unimplemented('download');

                            case 1:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function download() {
                return _ref8.apply(this, arguments);
            }

            return download;
        }()
    }, {
        key: 'update',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (!this.readOnly) {
                                    _context8.next = 2;
                                    break;
                                }

                                throw new Error("cannot update readOnly StudyFolder");

                            case 2:
                                this.unimplemented('update');

                            case 3:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function update() {
                return _ref9.apply(this, arguments);
            }

            return update;
        }()
    }, {
        key: 'upload',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (!this.readOnly) {
                                    _context9.next = 2;
                                    break;
                                }

                                throw new Error("cannot upload readOnly StudyFolder");

                            case 2:
                                this.unimplemented('upload');

                            case 3:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function upload() {
                return _ref10.apply(this, arguments);
            }

            return upload;
        }()
    }]);

    return StudyFolder;
}();