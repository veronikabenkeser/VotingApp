define(['jquery',
'underscore',
'src/models/user',
'text!src/templates/login.html',
'backbone'
// 'backbone-validation',

], function($,_, User,LoginTemplate,Backbone){

    var LoginView = Backbone.View.extend({
        tagName: 'div',
        className:'login-container',
        template: _.template(LoginTemplate),
        
        initialize: function(){
            
        },
        events:{
            'click .login': 'loginUser'
        },
        loginUser: function(){
           // this.validateFormat();
            //if passes validation, send a post request to try to log in with these credentials
            
        },
        validateFormat: function(){
            
        },
        render: function(){
             $(this.el).html(this.template(this.model.toJSON()));
             
            //  this.$el.html( this.template( this.model.toJSON()) );
            return this;
        }
    });
    return LoginView;
});