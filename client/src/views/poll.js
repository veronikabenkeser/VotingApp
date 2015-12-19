define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/poll.html',
    'text!src/templates/unauthPoll.html'
], function($, _, Backbone, pollTemplate, unauthPollTemplate) {
    var PollView = Backbone.View.extend({
        // tagname: 'div',
        el:'#content',
        className: 'pollContainer',
        tagname: 'li',
        // template:_.template($('#pollTemplate').html()),
        templates:{
            authorized: _.template(pollTemplate),
            notAuthorized: _.template(unauthPollTemplate)
        },
        events: {
            'click .delete': 'deletePoll'
        },
        initialize: function(opts) {
            this.opts = opts;
             _.bindAll(this, 'render');
            this.listenTo(this.model, "change", this.render);
            this.render();
            
        },
        deletePoll: function() {
            //Delete model
            var self = this;
            this.model.destroy().done(function() { //model is automatically removed from the collection
                self.remove(); ////Delete view or self.render() to redraw
            });

            //  this.model.destroy({ //model is automatically removed from the collection
            //      success: function(){

            //          console.log("Poll deleted successfully");
            //          //Delete view
            //  self.remove();
            //         // //  window.history.back();

            //      }
            //  });

        },
        render: function() {
            console.log("VAT");
            console.log(this.opts.authorizedUser);
            //this.el is what we defined in tagName
            if(this.opts.authorizedUser){
               this.$el.html(this.templates.authorized(this.model.toJSON()));
            }else{
                this.$el.html(this.templates.notAuthorized(this.model.toJSON()));
            }
            return this;
        }  
    });
    return PollView;
});