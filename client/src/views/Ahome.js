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
        // tagname:'div',
        //  className: 'home-div',
        el: '#home', //homeview goes into the home id of the index.html file
        // template:_.template($('#pollTemplate').html()),
        template: _.template(HomeTemplate),
        // events:{
        //     'click #vote':'viewPolls',
        //     'click #add-poll':'addPoll'
        // },
        initialize: function() {
            //   this.render();
            this.contentView = null;

            console.log("Ahome view initializing");
            //Set up the view to listen to messages
            this.bindPageEvents();
        },

        render: function() {
            var self = this;
            console.log("WHAT IS it " + app.initializeUser());
            //If user has been authenticated, load user's id. If not , create a new user
            app.initializeUser().done(function() {
                self.$el.html(self.template());
                self.headerView = new HeaderView({
                    model: app.getUser()
                });
                self.headerView.render();
                return self;
            });

            //this.el is what we defined in tagName
            // $(this.el).html(this.template);
            //-- this.$el.html(this.template());

            // this.headerView = new HeaderView();
            // this.headerView = new HeaderView({model: new User()});

            // --this.headerView.render();
            // --return this;
        },
        bindPageEvents: function() {
            EventBus.on('home:displayView', this.displayView, this);
        },
        displayView: function(view) {
                console.log("HERE");
                if (this.contentView !== null) {
                    console.log("this" + this);
                    console.log('"this.contentView"' + this.contentView);
                    this.contentView.close();
                    this.contentView = null;
                }
                this.contentView = view;
                if (this.contentView) {
                    this.contentView.render();
                }
            }
            // viewPolls: function(){
            // //  e.preventDefault();
            //  var self= this;
            //         this.polls = new Polls();
            //          this.pollsView = new PollsView({collection:this.polls}); 
            //         this.polls.fetch({//fires collection reset event
            //             success: function(){

        //         $('#content').html(self.pollsView.render().el);
        //         console.log("SHOWING POLLS");
        //             }
        //         });
        // },
        // addPoll:function(){

        // }
    });
    return HomeView;
});