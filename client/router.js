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
'eventBus'],
function(Backbone, Polls,PollsView, PollView, HomeView, AddPollView, Poll, User, SignupView, LoginView, WelcomeView,EventBus){
    var AppRouter = Backbone.Router.extend({
        initialize:function(){
             // setup the ajax links for the html5 push navigation
        $("body").on("click","a:not(a[data-bypass])",function(e){
                // block the default link behavior
                e.preventDefault();
                // take the href of the link clicked
                var href = $(this).attr("href");
                // pass this link to Backbone
                Backbone.history.navigate(href,true);
        });
        
        this.homeView = new HomeView();
        this.homeView.render();
        this.bindApplicationEvents();
        
        },
        routes:{
            "":"home",
            "home":"home",
            "polls":"showPolls",
            "login":"showLogin",
            "signup":"showSignup",
             "polls/add":"addPoll",
            "polls/:id": "pollDetails"
           
        },
        // initialize: function(){
        //     this.polls = new Polls();
        //     this.pollsView = new PollsView({collection: this.polls});
        //     // this.PollsView.render();
        //     // $('#content').html(this.PollsView.el);
            
        // },
        home:function(){
            console.log("going home");
            EventBus.trigger('home:displayView', new WelcomeView());
            
        },
        showSignup:function(){
            var user = new User();
            EventBus.trigger('home:displayView', new SignupView({model: user}));
        },
        showLogin:function(){
            var user = new User();
             EventBus.trigger('home:displayView', new LoginView({model: user}));
        },
        bindApplicationEvents:function(){
            EventBus.on('router:navigate',this._navigate,this);
        },
        _navigate:function(context){
            console.log("NAVIGATING TO");
            console.log(context.route);
            this.navigate(context.route, context.options);
        },
        home0: function(){
            //If the user is logged in, show the user's home
            // if(){
                
            // } else{
            console.log("you're home");
            if(!this.homeView){
               this.homeView= new HomeView();
  
            }
            $('#content').html(this.homeView.el);
            // }
        },
        showPolls:function(){
            var polls= new Polls();
            polls.fetch()//fires collection reset event
                .done(function(){
                    EventBus.trigger('home:displayView', new PollsView({collection: polls}));
                })
                .fail(function(){
                    console.log("error fetching the collection");
                });
     
          
        },
        showPolls0: function(){
            var self= this;
            this.polls = new Polls();
             this.pollsView = new PollsView({collection:this.polls}); 
            this.polls.fetch({//fires collection reset event
                success: function(){
                   
            // $('#content').html(self.pollsView.render().el);
            console.log("SHOWING POLLS nowww");
                }
            });
        //       this.pollsView = new PollsView({collection: this.polls});
        //   $('#content').html(self.pollsView.render().el);
        },
        
        addPoll:function(){
            console.log('adding poll inside of client router');
            //new model
          var poll = new Poll();
          this.addPollView = new AddPollView({model:poll});
        //   $("#content").html(pollView.render().el);
         
         $('#content').html(this.addPollView.render().el);
        },
        showLogin0: function(){
            console.log('showing login in');
            var user = new User();
            var loginView = new LoginView({model:user});
            $("#content").html(loginView.render().el);
        },
        showSignup0: function(){
             console.log('showing signup');
             var user = new User();
             var signupView = new SignupView({model: user});
             $('#content').html(signupView.render().el);
             
        },
        pollDetails: function(id){ //get request to polls/:id (link from the model)
        console.log("IN poll details!");
            var poll = new Poll({_id: id});
            poll.fetch({success: function(){
                var pollView = new PollView({model: poll});
                // console.log(pollView.render().el);
                $("#polls").html(pollView.el);
              
            }});
        }
    });
    
    //  Backbone.history.start({pushState:true});
  
    return AppRouter;
});