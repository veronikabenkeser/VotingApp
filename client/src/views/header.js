define(['jquery',
    'underscore',
    'text!src/templates/header.html',
    'backbone',
    'eventBus',
    'app'
], function($, _, HeaderTemplate, Backbone, EventBus, app) {
    var HeaderView = Backbone.View.extend({

        el: '#header', //put the content into the header id in the Ahome.html template
        template: _.template(HeaderTemplate),
        initialize: function() {
            this.bindPageEvents();
        },
        bindPageEvents: function() {
            EventBus.on('home:updateUserInfo', this.updateUserInfo, this);
        },
        updateUserInfo: function() {
            this.model = app.getUser();
            this.render();
        },
        render: function() {
            // this.$el.html(this.template);
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return HeaderView;
});