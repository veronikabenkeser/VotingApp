define(['jquery',
'underscore',
'backbone',
'text!src/templates/Ahome.html',
'src/collections/polls',
'src/views/polls'
], function($,_,Backbone,HomeTemplate,Polls, PollsView){
    var HomeView = Backbone.View.extend({
    tagname:'div',
     className: 'home-div',
    // template:_.template($('#pollTemplate').html()),
    template: _.template(HomeTemplate),
    // events:{
    //     'click #vote':'viewPolls',
    //     'click #add-poll':'addPoll'
    // },
    initialize:function(){
      this.render();
     
    },
    
     render: function() {
        //this.el is what we defined in tagName
        $(this.el).html(this.template);
        return this;
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