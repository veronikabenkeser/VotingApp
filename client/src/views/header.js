define(['jquery',
'underscore',
'text!src/templates/header.html',
'backbone'

], function($,_, HeaderTemplate,Backbone){
    var HeaderView = Backbone.View.extend({
        
        el: '#header',//put the content into the header id in the Ahome.html template
        template: _.template(HeaderTemplate),
        render: function(){
            this.$el.html(this.template());
            return this;
        }
    });
    
    return HeaderView;
});

