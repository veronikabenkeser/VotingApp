process.env.NODE_ENV = 'test';

var request = require("supertest");
var app = require("./../../server");
var server;

describe('app routes', function() {
    before(function(done) {
        server = app.listen(3000, function(err, result) {
            if (err) return done(err);
            done();
        });
    });

    it('app should exist', function(done) {
        expect(app).to.exist;
        done();
    });

    after(function(done) {
        server.close();
        done();
    });


    describe('Request to the root path', function() {

        it('Returns a 200 status code', function(done) {
            request(app)
                .get('/')
                .expect(200, done);
        });
    });
    
    describe('Request to the polls path',function() {
        it('Returns a 200 status code',function(done){
            request(app)
                .get('/api/polls')
                .expect(200, done);
        });
        it('Returns JSON format',function(done) {
            request(app)
                .get('/api/polls')
                .expect('Content-Type',/json/,done);
        });
    });
    
    describe('User',function() {
        var token='',
            id='';
        
        it('should correctly add a user to a database',function(done) {
              var user = {
                name: 'user1',
                email: 'user1@gmail.com',
                password: '123'
                
            };
            request(app)
            .post('/api/users')
            .send(user)
            .end(function(err, res) {
                expect(res.status).to.equal(200);
                done();
            });
         });
        
        it('should return an error when trying to save a duplicate user',function(done) {
            
            var user = {
                name: 'user1',
                email: 'user1@gmail.com',
                password: '123'
            };
            
            request(app)
            .post('/api/users')
            .send(user)
            .end(function(err,res){
                expect(res.status).to.equal(400);
                done();
            });
        });
        
        it('should get a valid token for user1',function(done) {
           request(app)
            .post('/api/authenticate')
            .send({email: 'user1@gmail.com', password: '123'})
            .end(function(err,res){
                token = res.body.token;
                id=res.body._id;
                done();
            });
            
        });
        
        it('should modify user',function(done) {
            var link = '/api/users/'+id;
            request(app)
            .put(link)
            .set('x-access-token',token)
            .send({email: 'Superuser1@gmail.com'})
            .end(function(err,res){
                expect(200);
                console.log('res json');
                console.log('kitty');
                console.log(res);
                // expect(res.body.name).to.equal('user1');
                expect(res.status).to.equal(200);
                done();
            });
            
        });
        
         it('should correctly delete a user from the database',function(done) {
             
             //get a new token
             request(app)
            .post('/api/authenticate')
            .send({email: 'Superuser1@gmail.com', password: '123'})
            .end(function(err,res){
                token = res.body.token;
                id=res.body._id;
                
            });
            
          request(app)
            .delete('/api/users/1')
            .set('x-access-token', token)
            .expect(200,done);
            });
         });
});
