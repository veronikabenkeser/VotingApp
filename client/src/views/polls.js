define(['jquery', 
        'underscore',
        'backbone', 
        'src/collections/polls', 
        'src/views/pollDetails',
         'src/views/poll',
        'text!src/templates/polls.html',
         'text!src/templates/poll.html'
        ], function($, _, Backbone, Polls, PollDetailsView, PollView, pollsTemplate, pollTemplate) {
            
    var PollsView = Backbone.View.extend({
        el: '#content',
        template: _.template(pollsTemplate),
        initialize: function(opts) {
             this.opts=opts;
             _.bindAll(this, 'render');
            //this.collection is the argument inside of new PollsView({collection: ... })
            this.collection.on('reset', this.render, this);
            // this.collection.on('add', this.renderPoll, this);
             this.render();
        },
        events: {
            'click #add': 'addPoll'
        },
        render: function(){
            this.$el.html(this.template({user:this.opts.user.toJSON()}));
            this.collection.forEach(function(item){
                this.renderPoll(item);
            },this);
            return this;
        },
    //Render a poll by creating a PollView and appending the element to the polls element
      renderPoll: function(item){
          var pollView = new PollView({
              model: item,
              user:this.opts.user
          });
          this.$el.find(".list-group").append(pollView.render().el);
          return this;
      }
    });
    return PollsView;
});

