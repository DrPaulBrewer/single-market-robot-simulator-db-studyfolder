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

  it('constructor should throw error if properties unsupplied', ()=>{
    function bad(){
      new StudyFolder(); // eslint-disable-line no-new
    }
    bad.should.throw(/^expected an Object, got:/);
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

});
