define(["backbone", "src/models/poll"], function(Backbone, Poll) {
    var Polls = Backbone.Collection.extend({
        model: Poll
        // url: '/api/polls' //retrieve models from a server using collection.fetch()

    });
    return Polls;
});
