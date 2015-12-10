var request = require("supertest");
var app = require("./../../server");
var proxyquire = require("proxyquire");
var sinon = require("sinon");
var UserStub = sinon.stub();
var users = proxyquire('../controllers/users', {
    '../models/user': UserStub
});

var req = {};
var res = {};

describe('UsersController',function(){
    beforeEach(function(){
        res = {
            json: sinon.spy(),
            send: sinon.spy()
        };
        req={
            params:{
                id:1
            }
        };
        
        UserStub.save = function(callback) {
            callback(null, req.body); //assume error is null
        };
        UserStub.findById = function(query,callback){
            callback(null,{});
        };
        UserStub.remove = function(query,callback){
            callback(null,{});
        };
    });
    
    describe('addUser',function() {
        
          beforeEach(function(){
            
            req.body={
                name:'Abc',
                email: 'email@gmail.com',
                password: '123'
            };
        });
        
        it('should be defined',function(){
            expect(users.addUser).to.be.a('function');
        });
        
        it('should return json on save',function() {
            //because creating an instance of User in users.js in controllers
            UserStub.prototype.save = function(callback) {
                callback(null, req.body); //assume error is null
        };
            users.addUser(req,res);
            expect(res.json).calledWith(req.body);
        });
        it('should return error on failed save due to duplicate user',function() {
            var error={};
            error.code = 11000;
            UserStub.prototype.save = function(callback){
                callback(error,req.body);
            };
            users.addUser(req,res);
            expect(res.json).calledWith({success: false, message : 'A user with that user name already exists.'});
        });
        
        it('should return error on failed save due to any error except the duplicate user error',function() {
            
            UserStub.prototype.save = function(callback){
                callback({},req.body);
            };
              users.addUser(req,res);
              expect(res.send).calledWith({});
        });
    });
    
    describe('getById',function() {
        it('should be defined',function(){
            expect(users.getById).to.be.a('function');
        });
        
        it('returns json if found',function() {
            users.getById(req,res);
            expect(res.json).calledOnce;
        });
        
        it('returns an error if not found',function() {
            UserStub.findById = function(query, callback){
                callback({},{});
            };
            users.getById(req,res);
            expect(res.json).calledWith({error: 'User not found.'});
        });
    });
    describe('modifyUser',function() {
        
        it('should be defined',function(){
            expect(users.modifyUser).to.be.a('function');
        });
        
        it('modified object gets modified',function() {
              req.body={
                name:'Abc',
                email: 'email@gmail.com'
            };
            
            var oldObj = {};
            oldObj.name='A';
            oldObj.email='e@gmail.com';
            oldObj.password='123';
            oldObj.save = function(callback){
                callback(null,oldObj);
            };
            UserStub.findById = function(query, callback){
                callback(null, oldObj);
                return;
            };
            
            users.modifyUser(req,res);
            
            //different way of testing it:
            // var spy=sinon.spy();
            // spy(oldObj);
            // sinon.assert.calledWith(spy,sinon.match({name:"Abc"}));
            expect(oldObj.password).to.equal('123');
            expect(oldObj.email).to.equal('email@gmail.com');
            expect(oldObj.name).to.equal('Abc');
        });
        
        it('returns an error if cannot be found',function() {
            UserStub.findById = function(query, callback){
                callback({},{});
            };
            users.modifyUser(req,res);
            expect(res.send).calledWith({});
        });
    });
    describe('deleteUser',function() {
        it('should be defined',function(){
            expect(users.deleteUser).to.be.a('function');
        });
        it();
        it();
    });
    
});