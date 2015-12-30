//Client-side route map
define(['backbone',
        'src/collections/polls',
        'src/views/polls',
        'src/views/pollDetails',
        'src/views/Ahome',
        'src/views/dashboard',
        'src/views/Aaddpoll',
        'src/views/chart',
        'src/models/poll',
        'src/models/user',
        'src/views/signup',
        'src/views/login',
        'src/views/authorizedHomepage',
        'src/views/settings',
        'eventBus',
        'app'
    ],
    function(Backbone, Polls, PollsView, PollDetailsView, HomeView, DashboardView, AddPollView, ChartView, Poll,
        User, SignupView, LoginView, AuthorizedHomepageView, SettingsView, EventBus, app) {
        var AppRouter = Backbone.Router.extend({
            initialize: function() {
                // setup the ajax links for the html5 push navigation
                $("body").on("click", "a:not(a[data-bypass])", function(e) {
                    e.preventDefault();
                    var href = $(this).attr("href");
                    if ($(e.currentTarget).prop('target') === '_blank') {
                        window.open(href, '_blank');
                        return;
                    } 
                    // pass this link to Backbone
                    Backbone.history.navigate(href, true); //routing all a href elements in links (in templates) to the backbone router.
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
                "polls/:id/results": 'pollResults',
                "mypolls": "showMyPolls",
                "settings": "showSettings"

            },
            home: function() {
                // console.log("going home");
                // if (app.isAuthenticated()) {
                //     EventBus.trigger('home:displayView', new AuthorizedHomepageView());
                // } 
                var user = app.getUser();
                console.log('here is user');
                console.log(user);
                EventBus.trigger('home:displayView', new DashboardView({
                    model:user
                }));
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
            showPolls: function() {
                var polls = new Polls();
                //   var user = app.getUser();
                polls.url = '/api/polls/';
                //populate collection from server
                polls.fetch() //fires a GET request to 'api/polls/' and fires a collection reset event
                    .done(function() {
                        EventBus.trigger('home:displayView', new PollsView({
                            collection: polls,
                            user: new User()
                        }));
                    })
                    .fail(function(err) {
                        console.log("error fetching the collection");
                    });
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
            pollDetails: function(id) { //get request to polls/:id (link from the model)
                console.log("IN poll details!");
                var poll = new Poll({
                    _id: id
                });
                // poll.fetch({
                //     success: function() {
                //         var pollView = new PollView({
                //             model: poll
                //         });
                //         // console.log(pollView.render().el);
                //         $("#polls").html(pollView.el);

                //     }
                // });
                
                poll.fetch()
                .done(function() {
                    console.log('poll');
                    console.log(poll);
                            EventBus.trigger('home:displayView', new PollDetailsView({
                               model: poll,
                               user: app.getUser()
                            }));
                        })
                        .fail(function(err) {
                            console.log("error fetching the poll");
                        });
            },
            pollResults:function(id){
                var poll= new Poll({
                    _id: id
                });
                poll.fetch()
                    .done(function(){
                          EventBus.trigger('home:displayView', new ChartView({
                               model: poll
                            }));
                    })
                    .fail(function(err){
                         console.log("error fetching the poll");
                        
                    });
            },
            showSettings: function() {
                var user = new User();
                if (app.isAuthenticated()) {
                    EventBus.trigger('home:displayView', new SettingsView({
                        model: user
                    }));
                } else {
                    EventBus.trigger('home:displayView', new LoginView({
                        model: user
                    }));
                }
            },
            showMyPolls: function() {
                var user = app.getUser();
                if (user.id) {//If the user is logged in/authenticated, his/her polls collection will get fetched.
                    //user.polls is a collection inside of the user model
                    user.polls.fetch() //fires a GET request to 'api/users/:user_id/polls/' and fires a collection reset event
                        .done(function() {
                            EventBus.trigger('home:displayView', new PollsView({
                                collection: user.polls,
                                user: user
                            }));
                        })
                        .fail(function(err) {
                            console.log("error fetching the collection");
                        });

                }
                else {
                    EventBus.trigger('home:displayView', new LoginView({
                        model: user
                    }));
                }
            }
        });
        
        return AppRouter;
    });