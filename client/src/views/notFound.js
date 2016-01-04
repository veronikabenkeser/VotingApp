define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/notFound.html',
    'eventBus'
], function($, _, Backbone, notFoundTemplate, EventBus) {
    var notFoundView = Backbone.View.extend({
        el: "#content",
        template: _.template(notFoundTemplate),
        initialize: function() {
            this.render();
        },
        
        render:function(){
            this.$el.html(this.template);
            return this;
        }
    });
    return notFoundView;
});