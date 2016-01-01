var Poll = require('./../models/poll');
var User =require("./../models/user");
var Option = require("./../models/option");

describe('Models',function(){
    
    describe('Option',function() {
        var optionSchema = Option.schema.paths;
         it('Option model exists.',function(){
            expect(Option).to.exist;
        });
       it('Option model has an email string field',function(){
            expect(optionSchema.text.instance).to.equal('String');
        });
        it('Option model has a password string field',function() {
            expect(optionSchema.votes.instance).to.equal("Number");
        });
        it('Option mode can be saved',function() {
            var data = {text:'Option1', votes: 3};
            var option = new Option(data);
            option.save(function(err,option){
                expect(option.text).to.equal(data.text);
                expect(option.votes).to.equal(data.votes);
            });
        });
    });
    
    
    describe('User',function(){
        var userSchema= User.schema.paths;
    
        it('User model exists.',function(){
            expect(User).to.exist;
        });
        it('User model has an email string field',function(){
            expect(userSchema.email.instance).to.equal('String');
        });
        it('User model has a password string field',function() {
            expect(userSchema.password.instance).to.equal("String");
        });
        it('Password is required inside of the user model.',function(){
            expect(userSchema.password).to.have.property('required');
        });
        it('User model has a registeredVotes array',function(){
             expect(userSchema.registeredVotes.instance).to.deep.equal('Array');
        });
        it('User model has a polls array',function() {
              expect(userSchema.polls.instance).to.deep.equal('Array');
        });
        it('Polls array contains objects',function(){
            expect(userSchema.polls).to.include({});
        });
        it('User models can be saved',function() {
            var data1={text:'option1', votes:0};
            var data2 = {text: 'option2', votes:1};
            var option1 = new Option(data1);
            var option2 = new Option(data2);
            var obj = {name:'Poll1',options:[option1, option2]};
            var poll1 = new Poll(obj);
            var poll2= new Poll(obj);
            
            var data = {name:'V',email: 'v@gmail.com', password: '123', polls:[poll1,poll2], registeredVotes:[]};
            var user = new User(data);
            user.save(function(err,user){
                expect(user.name).to.qual(data.name);
                expect(user.email).to.equal(data.email);
                expect(user.password).to.equal(data.password);
                expect(user.polls).to.equal(data.polls);
                expect(user.registeredVotes).to.equal(data.registeredVotes);
            });
            
        });
    });
    
    describe('Poll',function(){
        var pollSchema = Poll.schema.paths;
        
        it('Poll model exists.',function(){
            expect(Poll).to.exist;
        });
        it('Poll model has a name string field',function(){
            expect(pollSchema.name).to.exist;
            expect(pollSchema.name.instance).to.equal('String');
        });
        
        it('Poll model has an options field that is an array',function(){
              expect(pollSchema.options.instance).to.deep.equal('Array');
        });
        it('Poll models can be saved',function() {
            var data1={text:'option1', votes:0};
            var data2 = {text: 'option2', votes:1};
            var option1 = new Option(data1);
            var option2 = new Option(data2);
            var obj = {name:'Poll1',options:[option1, option2]};
            var poll = new Poll(obj);
            poll.save(function(err,poll){
                expect(poll.name).to.qual(obj.name);
                expect(poll.options).to.equal(obj.options);
            });
            
        });
    });
});
