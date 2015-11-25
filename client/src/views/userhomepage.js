define(['jquery',
'underscore',
'backbone',
'text!src/templates/newpoll.html'
], function($,_,Backbone,newpollTemplate){
    var UserHomepageView = Backbone.View.extend({
    tagname:'div',
     className: 'pollContainer',
    // template:_.template($('#pollTemplate').html()),
    template: _.template(newpollTemplate),
    events:{
        'click .add':'addPoll'
    },
    initialize:function(){
      this.render();
    this.model.on('change',this.render,this);
    },
    addPoll: function(){
     this.model.save();
    },
     render: function() {
        //this.el is what we defined in tagName
        this.$el.html( this.template( this.model.toJSON()) );
        return this;
    }
    });
    return UserHomepageView;
});
     