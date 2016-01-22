define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/Ahome.html',
    'src/views/header',
    'src/collections/polls',
    'src/views/polls',
    'src/models/user',
    'eventBus',
    'app'
], function($, _, Backbone, HomeTemplate, HeaderView, Polls, PollsView,
    User, EventBus, app) {
    var HomeView = Backbone.View.extend({
        el: '#home',
        template: _.template(HomeTemplate),
        initialize: function() {
            this.contentView = null;
            this.bindPageEvents();
        },

        render: function() {
            var self = this;
            self.$el.html(self.template);
            //If user has been authenticated, load user's id. If not , create a new user.
            app.initializeUser()
                .done(function() {
                    self.headerView = new HeaderView({
                        model: app.getUser()
                    });
                    self.headerView.render();
                    return self;
                });
        },
        bindPageEvents: function() {
            EventBus.on('home:displayView', this.displayView, this);
        },
        displayView: function(view) {

            if (this.contentView !== null) {
                this.contentView.close();
                $('#subView').empty();
                this.contentView = null;
            }
            this.contentView = view;
            if (this.contentView) {
                this.$el.find('#subView').append(this.contentView.render().el);
            }
        }
    });
    return HomeView;
});