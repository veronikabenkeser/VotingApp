var pollModel = require('./../models/poll');
var userModel =require("./../models/user")

describe('Models',function(){
    describe('User',function(){
        var userSchema= userModel.schema.paths;
        
        it('User model exists.',function(){
            expect(userModel).to.exist;
       
        });
        it('User model has an email string field',function(){
            expect(userSchema.email).to.exist;
            expect(userSchema.email.instance).to.equal('String');
        });
        it('User model has a password string field',function() {
            expect(userSchema.password).to.exist;
            expect(userSchema.password.instance).to.equal("String");
        });
        it('Password is required inside of the user model.',function(){
            expect(userSchema.password).to.have.property('required');
        });
    });
    describe('Poll',function(){
        var pollSchema = pollModel.schema.paths;
        
        it('Poll model exists.',function(){
            expect(pollModel).to.exist;
        });
        it('Poll model has a name string field',function(){
            expect(pollSchema.name).to.exist;
            expect(pollSchema.name.instance).to.equal('String');
        });
        it('Poll model has at at least 3 properties',function() {
            var count=0;//because
            for(var key in pollSchema){
                if(pollSchema.hasOwnProperty(key)){
                    count++;
                }
            }
            expect(count).to.be.at.least(5);
            expect(pollSchema).to.have.ownProperty('option1');
            expect(pollSchema).to.have.ownProperty('option2');
        });
    });
});
