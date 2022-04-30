/* Copyright 2018- Paul Brewer, Economic and Financial Technology Consulting LLC */
/* This file is open source software.  The MIT License applies to this software. */

/* eslint-disable no-console */

import arrayPrefer from 'array-prefer';
import {scan} from 'secure-json-parse';
export {arrayPrefer};

export const configFileName = 'config.json';

export function expectSafeObject(obj){
  const t = typeof(obj);
  if (t!=='object')
    throw new TypeError("expected an Object, got:"+t);
  scan(obj);
  return obj;
}

export class StudyFolder {
    constructor(props){
      if (props!==undefined)
        expectSafeObject(props);
      Object.assign(this,props);
    }

    async getConfig(){
        const folder = this;
        const config = await folder.download({ name: configFileName });
        expectSafeObject(config);
        return config;
    }

    async setConfig({config}){
        const folder = this;
        expectSafeObject(config);
        await folder.upload({ name: configFileName,  contents: config});
    }

    unimplemented(what){
      throw new Error(`${what} is unimplemented in StudyFolder base class`);
    }

    readOnlyError(){
      throw new Error("cannot modify a read-only StudyFolder");
    }

    async search(){ // (name)
      this.unimplemented('search');
    }

    async listFiles(){
      let files = await this.search();
      if (this.hintFileId){
        files = arrayPrefer(files, (f)=>(f.id===this.hintFileId), 1);
      }
      return files;
    }

    async fileId(name){
        const files = await this.search(name);
        const fileId = files && files[0] && files[0].id;
        return fileId;
    }

    async download(){ // ({name,id})
        this.unimplemented('download');
    }

    async update(){ // (metadata)
      if (this.readOnly)
        this.readOnlyError();
      else
        this.unimplemented('update');
    }

    async upload(){
      // {name, contents, blob, onProgress, force}
      if (this.readOnly)
        this.readOnlyError();
      else
        this.unimplemented('upload');
    }
}
