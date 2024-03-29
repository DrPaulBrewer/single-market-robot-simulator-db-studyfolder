/* eslint-env node, mocha */

// import assert from 'assert';
import 'should';
import {StudyFolder, expectSafeObject, configFileName} from '../src/index.mjs';

function testInvokesUnimplemented(missing){
  const expectedErr = `${missing} is unimplemented`;
  return function(method){
    describe(`.${method}`, ()=>{
      it('will return rejected promise: '+expectedErr, ()=>{
        async function bad(){
          const f = new StudyFolder({});
          return f[method]();
        }
        const regexp = new RegExp(expectedErr);
        return bad().should.be.rejectedWith(regexp);
      });
    });
  };
}

describe('expectSafeObject', ()=>{
  const failedObj = [
    42,
    Number.NaN,
    'hello',
    undefined
  ];
  const goodObj = {b:52};
  const evilObj = JSON.parse('{"__proto__": {"hack":true}}');
  [0,1,2,3].forEach((i)=>{
    const item = failedObj[i];
    const expected = 'expected an Object, got:'+typeof(item);
    it(`expectSafeObject(${item}) should throw ${expected}`, ()=>{
      function bad(){
        expectSafeObject(item);
      }
      bad.should.throw(expected);
    });
  });
  it('expectedSafeObject(proto-altering object) should throw', function(){
    function evil(){
      expectSafeObject(evilObj);
    }
    evil.should.throw();
  });
  it('expectedSafeObject({b:52}) should return {b:52}', function(){
    expectSafeObject(goodObj).should.deepEqual(goodObj);
  });
});

describe('StudyFolder', ()=>{
  it('constructor should be a function', ()=>{
    StudyFolder.should.be.type('function');
  });

  it('constructor should not throw error if properties undefined', ()=>{
    const sf = new StudyFolder();
    sf.should.be.type('object');
    Object.keys(sf).should.deepEqual([]);
  });

  it('constructor should initialize properly', ()=>{
    const f1 = new StudyFolder({color: 'blue'});
    Object.keys(f1).should.deepEqual(['color']);
    f1.color.should.equal('blue');
  });

  ['getConfig','download'].forEach(testInvokesUnimplemented('download'));
  ['search','listFiles','fileId'].forEach(testInvokesUnimplemented('search'));
  testInvokesUnimplemented('upload')('upload');
  testInvokesUnimplemented('update')('update');


  describe('.getConfig', ()=>{
    it('should pass stubbed .download result', async ()=>{
      const f = new StudyFolder({});
      f.download = async ()=>({b:52});
      const result = await f.getConfig();
      result.should.deepEqual({b:52});
    });
  });

  describe('.setConfig', function(){
    it('.setConfig({config:{}}) throws upload is unimplemented', ()=>{
      async function bad(){
        const s = new StudyFolder();
        return s.setConfig({config: {}});
      }
      return bad().should.be.rejectedWith(/upload is unimplemented/);
    });
    it('if .upload is stubbed, .setConfig calls upload correctly', async ()=>{
      const s = new StudyFolder();
      const data = {x:74};
      const expected = {
        name: configFileName,
        contents: data
      };
      let check = null;
      s.upload = async (options)=>{ check = options; };
      await s.setConfig({config:data});
      check.should.deepEqual(expected);
    });
  });

  describe('with shimmed .search pointing to 3 files', function(){
    let sf,files;
    beforeEach(function(){
      sf = new StudyFolder();
      files = [
        {name: 'A', id:123},
        {name: 'B', id:456},
        {name: 'C', id:789}
      ];
      sf.search = async function(name){
        if (name===undefined){
          return files;
        }
        if (name==='A')
          return [files[0]];
        if (name==='B')
          return [files[1]];
        if (name==='C')
          return [files[2]];
      };
    });
    it('.search() should return files a,b,c', async()=>{
      const found = await sf.search();
      found.should.deepEqual(files);
    });
    [
      ['A',123],
      ['B',456],
      ['C',789]
    ].forEach(([name,id])=>{
      it(`.fileId('${name}') should be ${id}`, async ()=>{
        const fileid = await sf.fileId(name);
        fileid.should.equal(id);
      });
    });
    it('.listFiles() should return files a,b,c', async ()=>{
      const found = await sf.listFiles();
      found.should.deepEqual(files);
    });
    describe('effect of folder.hintFileId', function(){
      it('hintFileId:123, .listFiles() will return files a,b,c', async()=>{
        sf.hintFileId = 123;
        const found = await sf.listFiles();
        found.should.deepEqual(files);
      });
      it('hintFileId:456, .listFiles() will return files b,a,c', async()=>{
        sf.hintFileId = 456;
        const found = await sf.listFiles();
        found.should.deepEqual([files[1],files[0],files[2]]);
      });
      it('hintFileId:789, .listFiles() will return files c,a,b', async()=>{
        sf.hintFileId = 789;
        const found = await sf.listFiles();
        found.should.deepEqual([files[2],files[0],files[1]]);
      });
    });
    describe('prepUpload with no zip files in folder', ()=>{
      it('should reject missing name', async ()=>{
        return sf.prepUpload({}).should.be.rejected();
      });
      [
        {name: "hello.json", contents: "hello world"},
        {name: "number.json", contents: 34},
        {name: "undefined.json"},
        {name: "null.json", contents:null}
      ].forEach((options)=> it(
          `should reject ${options.name} upload with ${typeof(options.contents)} contents`,
          async ()=>(sf.prepUpload(options).should.be.rejected())
      )
      );
      it("should accept .json upload, convert to blob, resolving to {folderFiles, folderHasZipFiles:false, existingFile:undefined}", async()=>{
        const expected = {
          folderFiles:files,
          folderHasZipFiles: false,
          existingFile: undefined
        };
        const contents = {
          hello: "world",
          favoriteNumber: 53
        };
        const expectedJSON = JSON.stringify(contents,null,2);
        const expectedSize = expectedJSON.length;
        const expectedMimeType = 'application/json';
        const options = {
          name: "good.json",
          contents
        }
        const result = await sf.prepUpload(options);
        result.should.deepEqual(expected);
        options.blob.size.should.equal(expectedSize);
        options.size.should.equal(expectedSize);
        options.mimeType.should.deepEqual(expectedMimeType);
        const text = await options.blob.text();
        text.should.deepEqual(expectedJSON);
      });
      it("should reject .zip upload without blob", async()=>(
         sf.prepUpload({name: "noblob.zip"}).should.be.rejected()
      ));
      it("should accept .zip upload if blob is defined, resolving to {folderFiles, folderHasZipFiles:false, existingFile:undefined}", async()=>{
        const expected = {
          folderFiles:files,
          folderHasZipFiles: false,
          existingFile: undefined
        };
        const options ={
          name:"blob.zip",
          blob: new Blob(['Hello'])
        };
        const result = await sf.prepUpload(options);
        options.mimeType.should.deepEqual("application/zip");
        result.should.deepEqual(expected);
      });
      it("should reject chart.png upload because not .zip or .json", async()=>(
         sf.prepUpload({name: "chart.png"}).should.be.rejected()
      ));
    });
  });

  describe('with shimmed .search pointing to config.json and 20220101.zip', function() {
    let sf, files;
    beforeEach(function () {
      sf = new StudyFolder();
      files = [
        {name: 'config.json', id: 1},
        {name: '20220101.zip', id: 2}
      ];
      sf.search = async function (name) {
        if (name === undefined) {
          return files;
        }
        if (name === 'config.json')
          return [files[0]];
        if (name === '20220101.zip')
          return [files[1]];
      };
    });
    it('should reject upload of config.json as policy violation', async ()=>(
       sf.prepUpload({name:"config.json", contents:{}}).should.be.rejectedWith(/May not save a new config.json/)
    ));
    it('should reject upload of 20220101.zip as policy violation', async ()=> {
      const options = {
        name: "20220101.zip",
        blob: new Blob([''])
      };
      return await sf.prepUpload(options)
          .should
          .be
          .rejectedWith(/May not overwrite existing zip file/);
    });
    it('should accept upload of 20220222.zip', async ()=> {
      const options = {
        name: "20220222.zip",
        blob: new Blob([''])
      };
      const result = await sf.prepUpload(options);
      result.should.deepEqual({
        folderFiles:files,
        folderHasZipFiles: true,
        existingFile: undefined
      });
    });
  });

  describe('readOnly:true support', function(){
    it('new StudyFolder({readOnly:true}) sets this.readOnly', function(){
      const ro = new StudyFolder({readOnly:true});
      ro.readOnly.should.deepEqual(true);
    });
    it('.upload should throw read-only error', function(){
      const ro = new StudyFolder({readOnly:true});
      return ro.upload().should.be.rejectedWith(/read-only/);
    });
    it('.update should throw read-only error',  function(){
      const ro = new StudyFolder({readOnly:true});
      return ro.update().should.be.rejectedWith(/read-only/);
    });
  });
});
