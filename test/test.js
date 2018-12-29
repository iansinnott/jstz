const expect = require('chai').expect;
const assert = require('assert')
const jstz = require('../dist/jstz.min.js');
const timezones = require('./utils/timezones')
const { exec } = require('child_process');

describe('API', function() {
  it('Should have a "determine" method.', function () {
    expect(jstz).to.respondTo('determine');
  });
  it('Timezone instance has a name method that returns a string', function() {
    var timezone = jstz.determine();
    expect(timezone).to.respondTo('name');
    expect(timezone.name()).to.be.a('string');
  });
  it('Timezone instance has an stdTimezoneOffset method that returns a number', function() {
    var timezone = jstz.determine();
    expect(timezone).to.respondTo('stdTimezoneOffset');
    expect(timezone.stdTimezoneOffset()).to.be.a('number');
  });
  it('Timezone instance has a timezoneOffset method that returns a number', function() {
    var timezone = jstz.determine();
    expect(timezone).to.respondTo('timezoneOffset');
    expect(timezone.timezoneOffset()).to.be.a('number');
  });
});

describe('Functionality', function() {

  before(function(){
    expect(timezones).to.be.a('array', 'time zones are invalid or not an array');
  })

  describe('determine()', function() {
      timezones.forEach(
        function(timezone){
          beforeEach(function(){
            assert.notEqual(timezone, undefined);           
          })
        
          it(`${timezone} should equal what jstz determines`, function(done){

            const checkTZ = function(err, stdout){
              if (err) {        
                console.error(`getActualTz module failed`);
                return;
              }

              const actual_tz = stdout              
              done(assert.equal(actual_tz, timezone, `Time Zone ${timezone} failed (Expected: ${timezone} but got ${actual_tz} instead)`))
            }
            //Hypotheticaly we should just be able to call jstz.determine directly after setting the process.env.TZ.
            //However that doesn't work, so we spawn a child process instead and that does work. ¯\_(ツ)_/¯.
            exec(`node test/utils/getActualTz.js ${timezone}`, checkTZ);           
          })
      })   
  });
});