var request = require("supertest");
var app = require("./../../server")

describe('Request to the root path',function(){
  it('Returns a 200 status code', function(done){
      request(app)
       .get('/')
       .expect(200)
       .end(function(error){
           if(error)throw error;
           done();//teling mocha when the test has finished
   });
  });
});
