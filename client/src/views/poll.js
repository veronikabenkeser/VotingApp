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
    deletePoll: function(){
     //Delete model
     this.model.destroy();
     //Delete view
     this.remove();
    },
     render: function() {
        //this.el is what we defined in tagName
        this.$el.html( this.template( this.model.attributes ) );

        return this;
    }
});
return PollView;
});