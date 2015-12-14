define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/poll.html'
], function($, _, Backbone, pollTemplate) {
    var PollView = Backbone.View.extend({
        tagname: 'div',
        className: 'pollContainer',
        // template:_.template($('#pollTemplate').html()),
        template: _.template(pollTemplate),
        events: {
            'click .delete': 'deletePoll'
        },
        initialize: function() {
            this.model.fetch();
    this.model.bind('change', this.render, this);
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
            //this.el is what we defined in tagName
        
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });
    return PollView;
});