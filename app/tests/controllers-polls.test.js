var app = require("./../../server");
var proxyquire = require("proxyquire");
var sinon = require("sinon");
var PollStub = sinon.stub();
var polls = proxyquire('../controllers/polls', {
    '../models/poll': PollStub
});
var req = {};
var res = {};

describe('PollsController', function() {
    beforeEach(function() {
        res = {
            json: sinon.spy(),
            send: sinon.spy()
        };
        req = {
            params: {
                id: 1
            }
        };

        PollStub.find = function(callback) {
            callback(null, {}); //mirroring function(err, polls) in the poll.js 
            //controller. Error is null. Result: res.json({}) where 
            //res is overriden by res = {json: sinon.spy()}
        };
        PollStub.save = function(callback) {
            callback(null, req.body); //assume error is null
        };
        PollStub.findById = function(query, callback) {
            callback(null, {});
        };
    });

    describe('getAllPolls', function() {

        it('should be defined', function() {
            console.log(polls.getAllPolls.toString());
            expect(polls.getAllPolls).to.be.a('function');
        });

        it('should send json if found', function() {
            polls.getAllPolls(req, res);
            expect(res.json).calledOnce;
        });

        it('should send error if not found', function() {
            var error = {};
            PollStub.find = function(callback) {
                callback(error, {});
            };
            polls.getAllPolls(req, res);
            expect(res.send).calledWith(error);
        });
    });

    describe('addPoll', function() {

        beforeEach(function() {

            req.body = {
                name: 'testing',
                option1: 'opt1',
                option2: 'opt2'
            };
        });

        it('should be defined', function() {
            expect(polls.addPoll).to.be.a('function');
        });

        it('should call the models save function', function() {
            PollStub.prototype.save = sinon.spy();
            polls.addPoll(req, res);
            expect(PollStub.prototype.save).calledOnce;
        });

        it('should return json on save', function() {
            PollStub.prototype.save = function(callback) {
                callback(null, req.body); //err is null
            };
            polls.addPoll(req, res);
            expect(res.json).calledWith(req.body);
        });

        it('should return an error on failed save', function() {
            PollStub.prototype.save = function(callback) {
                callback({}, req.body); //{} is the err obj
            };
            polls.addPoll(req, res);
            expect(res.json).calledWith({
                success: false,
                message: 'Poll was not saved.'
            });
        });
    });

    describe('getById', function() {
        it('should be defined', function() {
            expect(polls.getById).to.be.a('function');
        });

        it('returns json if found', function() {
            polls.getById(req, res);
            expect(res.json).calledOnce;
        });

        it('returns an error if not found', function() {
            PollStub.findById = function(query, callback) {
                callback({}, {});
            };
            polls.getById(req, res);
            expect(res.json).calledWith({
                error: 'Poll not found.'
            });
        });
    });

    describe('deletePoll', function() {

        it('should be defined', function() {
            expect(polls.deletePoll).to.be.a('function');
        });

        it('return json if poll was deleted successfully', function() {
            PollStub.remove = function(query, callback) {
                callback(null, {});
            };
            polls.deletePoll(req, res);
            expect(res.json).calledWith({
                message: 'This poll has been successfully deleted.'
            });
        });

        it('return an error if unable to delete poll', function() {
            var error = {};
            PollStub.remove = function(query, callback) {
                callback(error, {});
            };
            polls.deletePoll(req, res);
            expect(res.send).calledWith(error);
        });
    });
});
