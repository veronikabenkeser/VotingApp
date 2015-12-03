//Client-side route map
define(['backbone',
'src/collections/polls',
'src/views/polls',
'src/views/poll',
'src/views/Ahome',
'src/views/Aaddpoll',
'src/models/poll',
'src/models/user',
'src/views/signup'],
function(Backbone, Polls,PollsView, PollView, HomeView, AddPollView, Poll, User, SignupView){
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
        },
        routes:{
            "":"home",
            "polls":"showPolls",
            "login":"showLogin",
            "signup":"showSignup",
             "polls/add":"addPoll",
            "polls/:id": "pollDetails",
           
        },
        // initialize: function(){
        //     this.polls = new Polls();
        //     this.pollsView = new PollsView({collection: this.polls});
        //     // this.PollsView.render();
        //     // $('#content').html(this.PollsView.el);
            
        // },
        home: function(){
            console.log("you're home");
            if(!this.homeView){
               this.homeView= new HomeView();
  
            }
            $('#content').html(this.homeView.el);
        },
        showPolls: function(){
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
        showLogin: function(){
            console.log('showing login in');
        },
        showSignup: function(){
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