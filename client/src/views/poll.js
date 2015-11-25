define(['jquery',
'underscore',
'backbone',
'text!src/templates/poll.html'
], function($,_,Backbone,pollTemplate){
    var PollView = Backbone.View.extend({
    tagname:'div',
     className: 'pollContainer',
    // template:_.template($('#pollTemplate').html()),
    template: _.template(pollTemplate),
    events:{
        'click .delete':'deletePoll'
    },
    initialize:function(){
       this.render();
    },
    deletePoll: function(){
     //Delete model
     this.model.destroy({
         success: function(){
             
             alert("Poll deleted successfully");
             //Delete view
     this.remove();
            //  window.history.back();
            
         }
     });
     
    },
     render: function() {
        //this.el is what we defined in tagName
        this.$el.html( this.template( this.model.toJSON()) );
        return this;
    }
});
return PollView;
});