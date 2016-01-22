define(['underscore', 'backbone', '../collections/options'], function(_, Backbone, Options) {
    var Option = Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            text: ''
        }
    });
    return Option;
});