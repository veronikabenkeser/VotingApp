var app = require("./../../server");
var proxyquire = require("proxyquire");
var sinon = require("sinon");
var UserStub = sinon.stub();
var PollStub = sinon.stub();
var users = proxyquire('../controllers/users', {
    '../models/user': UserStub,
    '../models/poll': PollStub
});

var req = {};
var res = {};

describe('UsersController', function() {
    beforeEach(function() {
        //Mock the response object
        res = {
            json: sinon.spy(),
            send: sinon.spy(),
            status: function(responseStatus) {
                return this; //make it chainable
            }
        };
        req = {
            params: {
                id: 1
            }
        };
        // res.status().json = function(){

        // };
        UserStub.save = function(callback) {
            callback(null, req.body); //assume error is null
        };
        UserStub.findById = function(query, callback) {
            callback(null, {});
        };
        UserStub.remove = function(query, callback) {
            callback(null, {});
        };
    });

    describe('addUser', function() {

        beforeEach(function() {

            req.body = {
                name: 'Abc',
                email: 'email@gmail.com',
                password: '123'
            };
        });

        it('should be defined', function() {
            expect(users.addUser).to.be.a('function');
        });

        it('should return json on save', function() {
            //because creating an instance of User in users.js in controllers
            UserStub.prototype.save = function(callback) {
                callback(null, req.body); //assume error is null
            };
            users.addUser(req, res);
            expect(res.json).calledWith(req.body);
        });
        it('should return error on failed save due to duplicate user', function() {
            var error = {};
            error.code = 11000;
            UserStub.prototype.save = function(callback) {
                callback(error, req.body);
            };
            users.addUser(req, res);
            // expect(res.json).calledWith({
            //     success: false,
            //     message: 'A user with that user name already exists.'
            // });
            expect(res.status(400).json).calledWith({
                error: 'A user with that user name already exists.'
            });
        });

        it('should return error on failed save due to any error except the duplicate user error', function() {

            UserStub.prototype.save = function(callback) {
                callback({}, req.body);
            };
            users.addUser(req, res);
            // expect(res.send).calledWith({});
            expect(res.status(500).json).calledWith({
                error: {}
            });
        });
    });

    describe('getById', function() {
        it('should be defined', function() {
            expect(users.getById).to.be.a('function');
        });

        it('returns json if found', function() {
            users.getById(req, res);
            expect(res.json).calledOnce;
        });

        it('returns an error if not found', function() {
            UserStub.findById = function(query, callback) {
                callback({}, {});
            };
            users.getById(req, res);
            expect(res.json).calledWith({
                error: 'User not found.'
            });
        });
    });
    describe('modifyUser', function() {

        it('should be defined', function() {
            expect(users.modifyUser).to.be.a('function');
        });

        it('found object gets modified', function() {
            req.body = {
                name: 'Abc',
                email: 'email@gmail.com'
            };

            var oldObj = {};
            oldObj.name = 'A';
            oldObj.email = 'e@gmail.com';
            oldObj.password = '123';
            oldObj.save = function(callback) {
                callback(null, oldObj);
            };
            UserStub.findById = function(query, callback) {
                callback(null, oldObj);
                return;
            };

            users.modifyUser(req, res);

            //different way of testing it:
            // var spy=sinon.spy();
            // spy(oldObj);
            // sinon.assert.calledWith(spy,sinon.match({name:"Abc"}));
            expect(oldObj.password).to.equal('123');
            expect(oldObj.email).to.equal('email@gmail.com');
            expect(oldObj.name).to.equal('Abc');
        });

        it('return json if poll was saved successfully', function() {

            req.body = {
                name: '',
                email: '',
                password: ''
            };


            var spy = sinon.spy();
            UserStub.findById = function(query, callback) {
                callback(null, spy);
            };
            spy.save = function(callback) {
                callback(null, {});
            };
            //spy calls the save method with {}
            users.modifyUser(req, res);
            expect(res.json).calledWith({});
        });

        it('returns an error if the user cannot be found', function() {
            UserStub.findById = function(query, callback) {
                callback({}, {});
            };
            users.modifyUser(req, res);
            expect(res.send).calledWith({});
        });

        it('returns an error if the user was not saved successfully', function() {

            req.body = {
                name: '',
                email: '',
                password: ''
            };


            var spy = sinon.spy();
            UserStub.findById = function(query, callback) {
                callback(null, spy);
            };
            spy.save = function(callback) {
                callback({}, {});
            };

            users.modifyUser(req, res);
            expect(res.status(500).json).calledWith({
                error: 'Unable to save changes.'
            });
        });
    });
    describe('deleteUser', function() {
        it('should be defined', function() {
            expect(users.deleteUser).to.be.a('function');
        });
        it('returns json if user was deleted successfully', function() {
            users.deleteUser(req, res);
            expect(res.json).calledWith({
                message: 'Your account has been deleted.'
            });
        });
        it('returns an error if the user was not deleted successfully', function() {
            UserStub.remove = function(query, callback) {
                callback({}, {});
            };
            users.deleteUser(req, res);
            expect(res.status(500).json).calledWith({
                error: 'Error deleting your account.'
            });
        });
    });
    
    describe('add a poll',function() {
        it('should be defined',function(){
            expect(users.addPoll).to.be.a('function');
        });
        
        it('should add the poll to the polls collection',function() {
           
            var obj={};
            obj.polls=[];
            PollStub.prototype.save = function(callback) {
                callback(null, req.body); //assume error is null
            };
            obj.save = function(callback) {
                callback(null, {}); //assume error is null
            };
            UserStub.findById = function(query, callback) {
                callback(null, obj);
            };
             users.addPoll(req,res);
            expect(res.json).calledWith({});
        });
        
        // it('should add the poll to the users schema',function() {
        //     users.addPoll(req,res);
        // });
    });

});