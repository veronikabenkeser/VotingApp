var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Poll Schema
// var PollSchema = new Schema({
//     name: String,
//     option1: String,
//     option2: String
// });

//  var PollSchema = new Schema({
//      name: String,
//      options: [{
//          type: Schema.Types.ObjectId,
//       ref: 'Option'
//     }]
//  });

var PollSchema = new Schema({
    name: String,
    options: [{
        text: String
    }]
});

module.exports = mongoose.model('Poll', PollSchema);