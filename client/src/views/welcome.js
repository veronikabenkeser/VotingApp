define(['jquery',
'underscore',
'text!src/templates/welcome.html',
'backbone'

], function($,_, WelcomeTemplate,Backbone){
    var WelcomeView = Backbone.View.extend({
        
        el: '#content',
        template: _.template(WelcomeTemplate),
        render: function(){
            this.$el.html(this.template());
            return this;
        }
    });
    
    return WelcomeView;
});

