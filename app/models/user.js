var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

var UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    
    polls: [{
        type: Schema.Types.ObjectId,
        ref: 'Poll'
    }],
    registeredVotes: []
});

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();
    console.log("hashing password before saving it in the database");
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
