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
], function($, _, Backbone, HomeTemplate, HeaderView,  Polls, PollsView,
    User, EventBus, app) {
    var HomeView = Backbone.View.extend({
        el: '#home', //homeview goes into the home id of the index.html file
        template: _.template(HomeTemplate),
        initialize: function() {
            // this.render();
            this.contentView = null;
            console.log("Ahome view initializing");
            //Set up the view to listen to messages
            this.bindPageEvents();
        },

        render: function() {
            var self = this;
            //render this template to make sure the DOM is ready to accept elements from other views
            self.$el.html(self.template);
            //If user has been authenticated, load user's id. If not , create a new user
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
                    $('#content').empty();
                    this.contentView = null;
                }
                this.contentView = view;
                if (this.contentView) {
                    //render the view into the content div of the home div
                    this.$el.find('#content').append(this.contentView.render().el);
                }
        }
    });
    return HomeView;
});