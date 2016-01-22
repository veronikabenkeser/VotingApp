define(['jquery',
    'underscore',
    'text!src/templates/dashboard.html',
    'backbone',
    'eventBus',
    'app'

], function($, _, DashboardTemplate, Backbone, EventBus, app) {
    var DashboardView = Backbone.View.extend({
        el: "#content",
        template: _.template(DashboardTemplate),
        initialize: function() {},
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    return DashboardView;
});
