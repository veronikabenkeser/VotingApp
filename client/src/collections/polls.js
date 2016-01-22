define(["backbone", "src/models/poll"], function(Backbone, Poll) {
    var Polls = Backbone.Collection.extend({
        model: Poll
    });
    return Polls;
});
