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
        'src/views/settings',
        'src/views/notFound',
        'eventBus',
        'app'
    ],
    function(Backbone, Polls, PollsView, PollDetailsView, HomeView, DashboardView, AddPollView, ChartView, Poll,
        User, SignupView, LoginView, SettingsView, NotFoundView, EventBus, app) {
        var AppRouter = Backbone.Router.extend({
            initialize: function() {

                $("body").on("click", "a:not(a[data-bypass])", function(e) {
                    e.preventDefault();

                    var href = $(this).attr("href");
                    if ($(e.currentTarget).prop('target') === '_blank') {
                        window.open(href, '_blank');
                        return;
                    }

                    Backbone.history.navigate(href, true);
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
                "settings": "showSettings",
                '*notFound': 'notFound'

            },
            notFound: function() {
                EventBus.trigger('home:displayView', new NotFoundView());
            },
            home: function() {
                var user = app.getUser();
                EventBus.trigger('home:displayView', new DashboardView({
                    model: user
                }));
            },
            showSignup: function() {
                var user = new User();
                EventBus.trigger('home:displayView', new SignupView({
                    model: user
                }));
            },
            showLogin: function() {
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
                polls.url = '/api/polls/';
                polls.fetch()
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

            pollDetails: function(slug) {
                var self = this;
                var poll = new Poll({
                    _id: slug
                });

                poll.fetch()
                    .done(function() {
                        if (app.getUser().attributes.registeredVotes.indexOf(poll.id) !== -1) {
                            self.pollResults(poll.id);
                        }
                        else {
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
            pollResults: function(id) {
                var poll = new Poll({
                    _id: id
                });
                poll.fetch()
                    .done(function() {
                        EventBus.trigger('home:displayView', new ChartView({
                            model: poll
                        }));
                    })
                    .fail(function(err) {
                        alert("Error fetching the poll");

                    });
            },
            showSettings: function() {
                var user = new User();
                if (app.isAuthenticated()) {
                    EventBus.trigger('home:displayView', new SettingsView({
                        model: user
                    }));
                }
                else {
                    EventBus.trigger('home:displayView', new LoginView());
                }
            },
            showMyPolls: function() {
                var user = app.getUser();
                if (user.id) {
                    //user.polls is a collection inside of the user model
                    user.polls.fetch()
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