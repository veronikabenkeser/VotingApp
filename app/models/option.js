var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OptionSchema = new Schema({
    text: String,
    votes: Number
});

//Compare the password with the encrypted password in the database 
OptionSchema.methods.addVote = function() {
    var option= this;
    option.votes +=1;
    return;
};

module.exports = mongoose.model('Option', OptionSchema);
