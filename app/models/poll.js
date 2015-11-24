var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Poll Schema
var PollSchema = new Schema({
    name: String,
    option1: String,
    option2: String
});

module.exports = mongoose.model('Poll', PollSchema);