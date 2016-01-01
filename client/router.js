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
                  Backbone.history.start({
                    pushState: true
                });
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
                "polls/:slug": "pollDetails",
                "polls/:id/results": 'pollResults',
                "mypolls": "showMyPolls",
                "settings": "showSettings"

            },
            home: function() {
                var user = app.getUser();
                console.log("USERR");
                console.log(user._id);
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
                // var user = new User();
                // console.log('the user here ');
                // console.log(user);
                EventBus.trigger('home:displayView', new LoginView());
            },
            logout: function() {
                EventBus.trigger("app:logout");
                EventBus.trigger('header:updateUserInfo');
                EventBus.trigger('router:navigate', {
                    route: 'home',
                    options: {
                        trigger: true
                }
            });
            },
            bindApplicationEvents: function() {
                EventBus.on('router:navigate', this._navigate, this);
            },
            _navigate: function(context) {
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
                        alert("error fetching the collection");
                    });
            },
            addPoll: function() {
                var poll = new Poll();
                this.addPollView = new AddPollView({
                    model: poll
                });
                $('#content').html(this.addPollView.render().el);
            },
            
            pollDetails: function(slug) { //get request to polls/:id (link from the model)
                var self = this;
                var poll = new Poll({
                    _id: slug
                });
                
                //If the registered user has already voted in this poll, the user will not be
                //able to vote again and will instead see the results of the poll
                poll.fetch()
                  .done(function() {
                    if(app.getUser().attributes.registeredVotes.indexOf(poll.id) !==-1){
                        self.pollResults(poll.id);
                    }else{
                        EventBus.trigger('home:displayView', new PollDetailsView({
                            model: poll,
                            user: app.getUser()
                        }));
                    }
                })
                    .fail(function(err) {
                        alert("Error fetching the poll");
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
                         alert("Error fetching the poll");
                        
                    });
            },
            showSettings: function() {
                var user = new User();
                if (app.isAuthenticated()) {
                    EventBus.trigger('home:displayView', new SettingsView({
                        model: user
                    }));
                } else {
                    EventBus.trigger('home:displayView', new LoginView());
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
                            alert(err);
                        });

                }
                else {
                    EventBus.trigger('home:displayView', new LoginView());
                }
            }
        });
        
        return AppRouter;
    });