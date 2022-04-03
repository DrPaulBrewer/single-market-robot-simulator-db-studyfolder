/* eslint-env node, mocha */

// import assert from 'assert';
import 'should';
import {StudyFolder} from '../src/index.mjs';

function testInvokesUnimplemented(missing){
  return function(method){
    describe(`.${method}`, ()=>{
      it(`will return rejected promise if .${missing} is unimplemneted`, ()=>{
        async function bad(){
          const f = new StudyFolder({});
          return f[method]();
        }
        bad().should.be.rejectedWith(/`${missing} is unimplemented`/);
      });
    });
  };
}

describe('StudyFolder', ()=>{
  it('constructor should be a function', ()=>{
    StudyFolder.should.be.type('function');
  });

  it('constructor should not throw error if properties unsupplied', ()=>{
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
  testInvokesUnimplemented('update')('update');
  testInvokesUnimplemented('upload')('upload');

  describe('.setConfig', function(){
    it('.setConfig({config:{}}) throws upload unimplemented', ()=>{
      async function bad(){
        const s = new StudyFolder();
        return s.setConfig({config: {}});
      }
      bad().should.be.rejectedWith(/upload unimplemented/);
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
      console.log(typeof(sf));
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
  });

});
