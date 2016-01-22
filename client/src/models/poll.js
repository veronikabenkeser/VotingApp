define(['underscore', 'backbone', 'src/collections/options'], function(_, Backbone, Options) {
    var Poll = Backbone.Model.extend({
        urlRoot: "/api/polls",
        idAttribute: "_id",
        clear: function() {
            this.destroy();
            this.view.remove();
        }
    });
    return Poll;
});