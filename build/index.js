"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arrayPrefer", {
  enumerable: true,
  get: function get() {
    return _arrayPrefer.default;
  }
});
exports.StudyFolder = void 0;

var _arrayPrefer = _interopRequireDefault(require("array-prefer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright 2018- Paul Brewer, Economic and Financial Technology Consulting LLC */

/* This file is open source software.  The MIT License applies to this software. */

/* eslint-disable no-console */
class StudyFolder {
  constructor(props) {
    Object.keys(props).forEach(k => {
      this[k] = props[k];
    });
  }

  async getConfig() {
    const folder = this;
    const config = await this.download({
      name: 'config.json'
    });
    const shouldFixName = config.name && this.name && this.name.length && config.name !== this.name;
    const shouldFixDescription = config.description && this.description && this.description.length && config.description !== this.description;
    if (shouldFixName) config.name = this.name;
    if (shouldFixDescription) config.description = this.description;

    if (!this.readOnly) {
      if (shouldFixName || shouldFixDescription) await this.upload({
        name: 'config.json',
        contents: config,
        force: true
      });
    }

    return {
      config,
      folder
    };
  }

  async setConfig(_ref) {
    let {
      config
    } = _ref;

    if (config && typeof config === 'object') {
      if (this.name && config.name !== this.name) throw new Error("mismatch at StudyFolder:setConfig configuration name ".concat(config.name, " should equal the folder name ").concat(this.name));
      await this.upload({
        name: 'config.json',
        contents: config
      });

      if (this.description !== config.description) {
        this.description = config.description;

        if (!this.readOnly) {
          await this.update({
            description: config.description
          });
        }
      }
    }

    return this;
  }

  async unimplemented(what) {
    throw new Error("".concat(what, " is unimplemented in StudyFolder base class and needs to be defined in a subclass"));
  }

  async search() {
    // (name)
    this.unimplemented('search');
  }

  async listFiles() {
    let files = await this.search();

    if (this.hintFileId) {
      files = (0, _arrayPrefer.default)(files, f => f.id === this.hintFileId, 1);
    }

    return files;
  }

  async fileId(name) {
    const files = await this.search(name);
    const fileId = files && files[0] && files[0].id;
    return fileId;
  }

  async download() {
    // ({name,id})
    this.unimplemented('download');
  }

  async update() {
    // (metadata)
    if (this.readOnly) {
      throw new Error("cannot update readOnly StudyFolder");
    }

    this.unimplemented('update');
  }

  async upload() {
    // {name, contents, blob, onProgress, force}
    if (this.readOnly) {
      throw new Error("cannot upload readOnly StudyFolder");
    }

    this.unimplemented('upload');
  }

}

exports.StudyFolder = StudyFolder;