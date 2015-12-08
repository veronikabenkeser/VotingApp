var request = require("supertest");
var app = require("./../../server");

describe('Request to the root path',function(){
  it('Returns a 200 status code', function(done){
      request(app)
       .get('/')
       .expect(200, done);
  });
  it('Returns a HTML format',function(done){
      request(app)
      .get('/')
      .expect('Content-Type',/html/,done);
  });
});

describe('Listing polls on api/polls',function(){
   it('Returns 200 status code',function(done){
       request(app)
        .get('/api/polls')
        .expect(200, done);
   }); 
   
   //Check content type
  it('Returns JSON format',function(done) {
      request(app)
      .get('/api/polls')
      .expect('Content-Type',/json/,done);
  });
});

