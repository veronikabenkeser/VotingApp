define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/pollDetails.html'
], function($, _, Backbone, pollDetailsTemplate) {
    var PollDetailsView = Backbone.View.extend({
        // tagname: 'div',
        el:'#content',
        className: 'pollContainer',
        tagname: 'li',
        template: _.template(pollDetailsTemplate),
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
            //this.el is what we defined in tagName
                this.$el.html(this.template({poll:this.model.toJSON(),user:this.opts.user.toJSON()}));
            return this;
        }  
    });
    return PollDetailsView;
});