define(['underscore', 'backbone','../collections/options','backbone-relational'], function(_, Backbone,Options) {
    var Poll = Backbone.Model.extend({
    //  var Option = Backbone.RelationalModel.extend({
        //  urlRoot:'/api/options',
         idAttribute: '_id',
         defaults: {
             text:''
    }
     });
return Option;
});