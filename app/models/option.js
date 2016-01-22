var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OptionSchema = new Schema({
    text: String,
    votes: Number
});

OptionSchema.methods.addVote = function() {
    var option= this;
    option.votes +=1;
    return;
};

module.exports = mongoose.model('Option', OptionSchema);
