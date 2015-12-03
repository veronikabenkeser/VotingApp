var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

var UserSchema = new Schema({
    name: String,
    email: {type: String, required : true, index: {unique: true}},
    password: {type:String, required: true, select: false}
    //By setting select to false , the password will not be returned when listing 
    //our users, unless it is explicitly called.
   
});

UserSchema.pre('save',function(next){
    var user = this;
    
    if(!user.isModified('password'))return next();
    
    bcrypt.hash(user.password, null,null, function(err,hash){
        if (err) return next(err);
       
        user.password = hash;
        next();
    });
});

//Compare the password with the encrypted password in the database 
UserSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);







