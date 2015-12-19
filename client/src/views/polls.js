define(['jquery', 
        'underscore',
        'backbone', 
        'src/collections/polls', 
        'src/views/poll',
        'text!src/templates/polls.html',
        'text!src/templates/unauthPolls.html'
        ], function($, _, Backbone, Polls, PollView, pollsTemplate, unauthPollsTemplate) {
            
    var PollsView = Backbone.View.extend({
        el: '#content',
        templates:{
            authorized: _.template(pollsTemplate),
            unauthorized: _.template(unauthPollsTemplate),
        }, 
        initialize: function(options) {
               this.options = options;
             _.bindAll(this, 'render');
            // // this.render();

           //this.collection is the argument inside of new PollsView({collection: ... })
            this.collection.on('reset', this.render, this);
            // this.collection.on('add', this.renderPoll, this);
             this.collection.on('add', this.kop, this);
             this.render();
        },
        events: {
            'click #add': 'addPoll'
        },
        render:function(){
            if(this.options.authorizedUser){
                this.$el.html(this.templates.authorized({polls: this.collection.toJSON()}));
            } else {
               this.$el.html(this.templates.unauthorized({polls: this.collection.toJSON()}));
            }
            return this; 
        },
        kop:function(){
            console.log('just heard a collection add event');
        },
        //Render all polls by rendering each poll
        // render: function() {
        //     this.collection.forEach(function(item) {
        //         this.renderPoll(item);
        //     }, this);
        //     return this;
        // },
        //Render a poll by creating a PollView and appending the element to the polls element
        renderPoll: function(item) {
            console.log('item here' +item);
                var pollView = new PollView({
                    model: item
                });
                this.$el.append(pollView.render().el);
                // this.$el.html(pollView.render().el);
                return this;
            }
            //   addPoll: function(e){
            //       e.preventDefault();
            //       var formData ={};
            //       $('#addPoll div').children('input').each(function(index,elem){
            //           if($(elem).val() !=''){
            //               formData[elem.id] = $(elem).val();
            //           }
            //       });
            //     //   this.collection.add(new app.Poll(formData));
            //       this.collection.create(formData);// Equivalent to instantiating a model with a hash of attributes, saving the model to the server, and adding the model to the set after being successfully created. Returns the new model
            //   }

    });

    return PollsView;
});

