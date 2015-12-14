var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OptionSchema = new Schema({
    text: String
});

module.exports = mongoose.model('Option', OptionSchema);
