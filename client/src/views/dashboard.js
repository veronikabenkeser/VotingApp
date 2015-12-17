define(['jquery',
    'underscore',
    'text!src/templates/dashboard.html',
    'backbone',
    'eventBus',
    'app'

], function($, _, DashboardTemplate, Backbone,EventBus,app) {
    var DashboardView = Backbone.View.extend({
        el: "#content",
        template: _.template(DashboardTemplate),
        render: function() {
            console.log('trying to render dashboard view');
            this.$el.html(this.template(this.model.toJSON()));
            console.log(this.$el);
            return this;
        }
    });

    return DashboardView;
});
