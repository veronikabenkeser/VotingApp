define(['jquery','backbone','src/collections/polls','src/views/poll'],function($,Backbone, Polls,PollView){
var AppView = Backbone.View.extend({
    // el: '#app',
    initialize: function(){
        this.listenTo(Polls, 'add', this.addOne);
    },
    addOne: function(poll){
        var view = new PollView({model:poll});
        $('#poll-list').append(view.render().el);
    }
});
return AppView;
});