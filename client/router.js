//Client-side route map
define(['backbone',
        'src/collections/polls',
        'src/views/polls',
        'src/views/poll',
        'src/views/Ahome',
        'src/views/Aaddpoll',
        'src/models/poll',
        'src/models/user',
        'src/views/signup',
        'src/views/login',
        'src/views/welcome',
        'src/views/authorizedHomepage',
        'src/views/settings',
        'eventBus',
        'app'
    ],
    function(Backbone, Polls, PollsView, PollView, HomeView, AddPollView, Poll,
        User, SignupView, LoginView, WelcomeView, AuthorizedHomepageView, SettingsView, EventBus, app) {
        var AppRouter = Backbone.Router.extend({
            initialize: function() {
                // setup the ajax links for the html5 push navigation
                $("body").on("click", "a:not(a[data-bypass])", function(e) {
                    // block the default link behavior
                    e.preventDefault();
                    // take the href of the link clicked
                    var href = $(this).attr("href");
                    // pass this link to Backbone
                    Backbone.history.navigate(href, true);//routing all a href elements in links (in templates) to the backbone router.
                });

                this.homeView = new HomeView();
                this.homeView.render();
                this.bindApplicationEvents();

            },
            routes: {
                "": "home",
                "home": "home",
                "polls": "showPolls",
                "login": "showLogin",
                'logout': 'logout',
                "signup": "showSignup",
                "polls/add": "addPoll",
                "polls/:id": "pollDetails",
                "mypolls": "showMyPolls",
                "settings":"showSettings"

            },
            // initialize: function(){
            //     this.polls = new Polls();
            //     this.pollsView = new PollsView({collection: this.polls});
            //     // this.PollsView.render();
            //     // $('#content').html(this.PollsView.el);

            // },
            home: function() {
                console.log("going home");
                if (app.isAuthenticated()) {
                    EventBus.trigger('home:displayView', new AuthorizedHomepageView());
                }
                else {
                    EventBus.trigger('home:displayView', new WelcomeView());
                }

            },
            showSignup: function() {
                var user = new User();
                EventBus.trigger('home:displayView', new SignupView({
                    model: user
                }));
            },
            showLogin: function() {
                var user = new User();
                EventBus.trigger('home:displayView', new LoginView({
                    model: user
                }));
            },
            logout: function() {
                EventBus.trigger("app:logout");
            },
            bindApplicationEvents: function() {
                EventBus.on('router:navigate', this._navigate, this);
            },
            _navigate: function(context) {
                console.log("NAVIGATING TO");
                console.log(context.route);
                this.navigate(context.route, context.options);
            },
            home0: function() {
                //If the user is logged in, show the user's home
                // if(){

                // } else{
                console.log("you're home");
                if (!this.homeView) {
                    this.homeView = new HomeView();

                }
                $('#content').html(this.homeView.el);
                // }
            },
            showPolls: function() {
                var polls = new Polls(null, {url:'/api/polls/'});
                polls.fetch() //fires collection reset event
                    .done(function() {
                        EventBus.trigger('home:displayView', new PollsView({
                            collection: polls
                        }));
                    })
                    .fail(function() {
                        console.log("error fetching the collection");
                    });


            },
            showPolls0: function() {
                var self = this;
                this.polls = new Polls(null, {url:'/api/polls/'});
                this.pollsView = new PollsView({
                    collection: this.polls
                });
                this.polls.fetch({ //fires collection reset event
                    success: function() {

                        // $('#content').html(self.pollsView.render().el);
                        console.log("SHOWING POLLS nowww");
                    }
                });
                //       this.pollsView = new PollsView({collection: this.polls});
                //   $('#content').html(self.pollsView.render().el);
            },

            addPoll: function() {
                console.log('adding poll inside of client router');
                //new model
                var poll = new Poll();
                this.addPollView = new AddPollView({
                    model: poll
                });
                //   $("#content").html(pollView.render().el);

                $('#content').html(this.addPollView.render().el);
            },
            showLogin0: function() {
                console.log('showing login in');
                var user = new User();
                var loginView = new LoginView({
                    model: user
                });
                $("#content").html(loginView.render().el);
            },
            showSignup0: function() {
                console.log('showing signup');
                var user = new User();
                var signupView = new SignupView({
                    model: user
                });
                $('#content').html(signupView.render().el);

            },
            pollDetails: function(id) { //get request to polls/:id (link from the model)
                console.log("IN poll details!");
                var poll = new Poll({
                    _id: id
                });
                poll.fetch({
                    success: function() {
                        var pollView = new PollView({
                            model: poll
                        });
                        // console.log(pollView.render().el);
                        $("#polls").html(pollView.el);

                    }
                });
            },
            showSettings:function(){
                   var user = new User();
                 if (app.isAuthenticated()) {
                    EventBus.trigger('home:displayView', new SettingsView({
                        model: user
                    }));
                }
                else {
                    EventBus.trigger('home:displayView', new LoginView({
                            model: user
                    }));
                }
            },
            showMyPolls: function(){
                //  if (app.isAuthenticated()) {
                //     EventBus.trigger('home:displayView', new AuthorizedHomepageView());
                // }
                // else {
                //     EventBus.trigger('home:displayView', new WelcomeView());
                // }
                var user = app.getUser();
                if(user){ //if the user is not null 
                var pollsArr = user.polls;
                // var ids = Object.keys(pollsObj).map(function (key) {return pollsObj[key]});
              
              console.log(pollsArr);
              pollsArr.forEach(function(pollId){
                  var poll = new Poll({_id: pollId});
                  poll.fetch();
              });
              
                // var polls = new Polls(); //new polls collection
                // polls.fetch({
                //     traditional: true,
                //     data: {
                //       poll_ids : idsArray
                //     }
                // })
                //     .done(function(data){
                //         console.log("DONE@");
                //         console.log(data);
                //     })
                //     .fail(function() {
                //         console.log("error fetching the collection");
                //     });
             
            //  user.polls.fetch({reset:true}) //fetching from /api/users/:user_id/polls
            //     .done(function(data){
            //         console.log('here is the data'+data);
            //     })
            //     .fail(function(err){
            //         console.log("error fetching the collection");
            //         console.log(err);
            //     })
                 
               //get this user's polls
            //   var mypolls = Polls(); //new polls collection
               //You don't need to create a separate mypollCollection, unless the behavior for this collection is different from the pollsCollection.
              
               
               
                    // EventBus.trigger('home:displayView', new PollsView());
                    
                    
                } else {
                    console.log("user is null");
                }
            }
        });

        //  Backbone.history.start({pushState:true});

        return AppRouter;
    });