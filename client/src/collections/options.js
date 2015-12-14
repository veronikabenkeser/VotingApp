define(["backbone", "src/models/poll"], function(Backbone, Poll) {
    var Options = Backbone.Collection.extend({
        model: Option,
        url: '/options' //retrieve models from a server using collection.fetch()
    });
    return Options;
});
