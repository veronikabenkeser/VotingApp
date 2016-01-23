process.env.NODE_ENV = 'test';

var request = require("supertest");
var app = require("./../../server");
var server;
var mongoose = require("mongoose");
var User = require("../models/user");

describe('app routes', function() {
    before(function(done) {
        server = app.listen(3000, function(err, result) {
            if (err) return done(err);
            done();
        });
    });
    
    //Delete all users from the test database after tests are done.
    after(function() {
         User.collection.remove({});
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

    describe('Request to the polls path', function() {
        it('Returns a 200 status code', function(done) {
            request(app)
                .get('/api/polls')
                .expect(200, done);
        });
        it('Returns JSON format', function(done) {
            request(app)
                .get('/api/polls')
                .expect('Content-Type', /json/, done);
        });
    });

    describe('User', function() {
        var token = '',
            id = '';

        it('should correctly add a user to a database', function(done) {
            var user = {};
            user.name = 'user1';
            user.email = 'user1@gmail.com';
            user.password = '123';

            request(app)
                .post('/api/users')
                .send(user)
                .end(function(err, res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('should return an error when trying to save a duplicate username', function(done) {
            var user = {};
            user.name = 'user';
            user.email = 'user1@gmail.com';
            user.password = '12345';

            request(app)
                .post('/api/users')
                .send(user)
                .end(function(err, res) {
                    expect(res.status).to.equal(400);
                    done();
                });
        });

        it('should authenticate user', function(done) {
            request(app)
                .post('/api/authenticate')
                .send({
                    email: 'user1@gmail.com',
                    password: '123'
                })
                .end(function(err, res) {
                    expect(res.status).to.equal(200);
                    token = res.body.token;
                    id = res.body._id;
                    done();
                });
        });

        it('should successfully change users password', function(done) {
            var link = '/api/users/' + id;
            request(app)
                .put(link)
                .set('x-access-token', token)
                .send({
                    oldPassword: '123',
                    newPassword: '321'
                })
                .end(function(err, res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });
});
