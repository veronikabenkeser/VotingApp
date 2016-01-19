define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/poll.html',
    'eventBus',
    'app',
    'src/views/chart'
], function($, _, Backbone, pollTemplate,EventBus,app,ChartView) {
    var PollView = Backbone.View.extend({
            template: _.template(pollTemplate),
            initialize: function(opts) {
                this.opts=opts;
                 _.bindAll(this, 'render');
                this.render();
            },
            events:{
                'click #view-results': 'showResults',
                'click #delete-poll': 'deletePoll'
            },
            render: function(){
                this.$el.html(this.template({poll:this.model.toJSON(), user: this.opts.user.toJSON()}));
                return this;
            },
            deletePoll:function(){
                var self=this;
                  $.ajax({
                        url: '/api/users/' + app.getUser().id + '/polls/'+this.model.id,
                        type: 'DELETE',
                        dataType: "json"
                    })
                    .done(function() {
                        self.remove(); ////Delete view or self.render() to redraw
                        
                    })
                    .fail(function(err) {
                       alert(err);
                    });
            },
            showResults:function(){
                  EventBus.trigger('router:navigate', {
                        route: 'polls/'+this.model.id+'/results',
                        options: {
                            trigger: true
                        }
                    });
            }
            
            
        });
    return PollView;
});