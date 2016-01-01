var app = require("./../../server");
var proxyquire = require("proxyquire");
var sinon = require("sinon");
var UserStub = sinon.stub();
var PollStub = sinon.stub();
var OptionStub = sinon.stub();
var users = proxyquire('../controllers/users', {
    '../models/user': UserStub,
    '../models/poll': PollStub,
    '../models/option': OptionStub
});

var req = {};
var res = {};
var thisObj={};

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
        var mockFindOne = {
            select: function (query) {
                return this;
            },
            exec: function (callback) {
                callback(null, UserStub);
            }
        };
        UserStub.findOne = function(){
            return mockFindOne;
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
            expect(res.json).calledWith({message: "New user created.", success: true});
        });
        it('should return error on failed save due to duplicate username', function() {
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
    describe('changeSettings', function() {
        
         beforeEach(function(){
             req.body = {
                oldPassword: '123',
                newPassword: '321'
            };
            UserStub.comparePassword = function(){
                return true;
            };
        });
         
        it('should be defined', function() {
            expect(users.changeSettings).to.be.a('function');
        });

        it('returns json when the password is changed successfully', function() {
            users.changeSettings(req, res);
            expect(res.json).calledWith({
                message: 'Password has been updated.'
            });
        });
        
        it('TWO returns an error if the passwords dont match',function() {
            UserStub.comparePassword = function(){
                return false;
                user.changeSettings(req,res);
                expect(res.status(400)).calledWith({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            }
        });

        it('returns an error if the user cannot be found', function() {
            var err={};
            var mockFindOne2 = {
                select: function (query) {
                    return this;
                },
                exec: function (callback) {
                    callback(err, null);
                }
            };
            UserStub.findOne = function(){
                return mockFindOne2;
            };
            users.changeSettings(req,res);
            expect(res.status(400).json).calledWith(err);
        });

        it('THREE returns an error if the user was not saved successfully', function() {
            var err={};
            UserStub.save = function(callback){
                 callback(err, {});
            };
            users.changeSettings(req, res);
            expect(res.status(500).json).calledWith({
                error: err
            });
        });
    });
    describe('add a poll',function() {
        it('should be defined',function(){
            expect(users.addPoll).to.be.a('function');
        });
        
        it('FOUR should add the poll to the polls collection', function() {
            
             req.body = {
                name: 'Poll1',
                options: [{text:'option1', votes:0},{text:'option2', votes:1}]
            };
            
            var optObj={};
            OptionStub.save = function(callback){
                console.log('here now');
                callback(null,optObj);
            };
           
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