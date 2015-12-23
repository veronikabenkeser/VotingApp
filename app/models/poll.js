var mongoose = require("mongoose");
var friendly = require('mongoose-friendly');
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
        type: Schema.Types.ObjectId,
        ref: 'Option'
    }]
});

PollSchema.plugin(friendly, {
  source: 'name',  // Attribute to generate the friendly version from. 
  friendly: 'slug', // Attribute to set the friendly version of source. 
  addIndex: true,   // Sets {unique: true} as index for the friendly attribute. 
  findById: true    // Turns findById into an alias for findByFriendly. 
});

module.exports = mongoose.model('Poll', PollSchema);