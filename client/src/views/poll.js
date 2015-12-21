define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/poll.html'
], function($, _, Backbone, pollTemplate) {
    var PollView = Backbone.View.extend({
        template: _.template(pollTemplate),
            initialize: function(opts) {
                this.opts=opts;
                 _.bindAll(this, 'render');
                this.render();
            },
            render: function(){
                this.$el.html(this.template({poll:this.model.toJSON(), user: this.opts.user.toJSON()}));
                return this;
            }
        });
    return PollView;
});