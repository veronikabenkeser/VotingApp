//Client-side route map
define(['backbone',
'src/collections/polls',
'src/views/polls',
'src/views/poll',
'src/views/userhomepage',
'src/models/poll'],
function(Backbone, Polls,PollsView, PollView, UserHomepageView, Poll){
    var AppRouter = Backbone.Router.extend({
        routes:{
            // "":"home",
            "login":"showLogin",
            "signup":"showSignup",
             "polls/add":"addPoll",
            "polls/:id": "pollDetails",
           
        },
        // initialize: function(){
        //     this.Polls = new Polls();
        //     this.PollsView = new PollsView({collection: this.Polls});
        //     this.PollsView.render();
        //     $('#polls').append(this.PollsView.el);
            
        // },
       
        home: function(){
            this.Polls.fetch();
        },
        
        addPoll:function(){
            console.log('adding poll inside of client router');
          var poll = new Poll();
          var pollView = new UserHomepageView({model:poll});
          $("#polls").html(pollView.el);
        },
        showLogin: function(){
            
        },
        showSignup: function(){
           
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
    return AppRouter;
});