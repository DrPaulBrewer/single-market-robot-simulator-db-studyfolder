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
        if (typeof(props)==='object') {
            expectSafeObject(props);
            Object.assign(this, props);
        }
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

    async prepUpload(options){
        const {name, contents, force} = options;
        /* c8 ignore start */
        if (typeof Blob !== 'function') {
            throw new Error("Critical Error: Blob is not available on this platform");
        }
        /* c8 ignore stop */
        if (!name)
            throw new Error("Error: prepUpload: missing file name");
        if (name.endsWith(".json"))  {
            const typeOfContents = typeof(contents);
            if (typeOfContents!=='object'){
                throw new Error(`Upload of .json file requires contents to be an object, got ${typeOfContents}`);
            }
            expectSafeObject(contents);
            options.blob = new Blob(
                [JSON.stringify(contents, null, 2)],
                {type: 'application/json'}
            );
            options.mimeType = 'application/json';
        } else if (name.endsWith(".zip")) {
            options.mimeType = 'application/zip';
            if (!options.blob)
                throw new Error("Upload of .zip file requires blob input, blob not found");
        } else {
            throw new Error(`Upload Policy Violation: Only .json and .zip file uploads supported (${name})`);
        }
        options.size = options.blob.size;
        const folderFiles = await this.listFiles();
        const folderHasZipFiles = folderFiles.some((f)=>(f.name.endsWith(".zip")));
        const existingFile = folderFiles.find((f)=>(name===f.name));
        if (!force){
            // optional policies go here
            if ((name==='config.json') && folderHasZipFiles){
                throw new Error("Upload Policy Violation:  May not save a new config.json file into a study folder with existing .zip file data");
            }
            if ((name.endsWith(".zip")) && existingFile){
                throw new Error("Upload Policy Violation: May not overwrite existing zip file "+name);
            }
        }
        return {folderFiles, folderHasZipFiles, existingFile};
    }
}
