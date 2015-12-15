define(['jquery',
    'underscore',
    'text!src/templates/authorizedHomepage.html',
    'backbone',
    'eventBus'

], function($, _, AuthorizedHomepageTemplate, Backbone, EventBus, app) {
    var AuthorizedHomepageView = Backbone.View.extend({

        el: '#content',
        template: _.template(AuthorizedHomepageTemplate),
         events: {
            'click .newpoll': 'createNewPoll',
            'click .mypolls':'viewMyPolls'
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        },
        createNewPoll: function(e){
               var self = this;
            e.preventDefault();
            
             EventBus.trigger('router:navigate', {
                        route: 'polls/add',
                        options: {
                            trigger: true
                        }
                    });
            
        },
        viewMyPolls: function(e){
               var self = this;
            e.preventDefault();
            
             EventBus.trigger('router:navigate', {
                        route: 'mypolls',
                        options: {
                            trigger: true
                        }
                    });
        }
    });

    return AuthorizedHomepageView;
});
