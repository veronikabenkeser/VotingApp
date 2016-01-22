define(["backbone", "src/models/poll"], function(Backbone, Poll) {
    var Options = Backbone.Collection.extend({
        model: Option,
        url: '/options'
    });
    return Options;
});
