define(['jquery',
    'underscore',
    'src/models/user',
    'text!src/templates/login.html',
    'backbone',
    'src/collections/users',
    'eventBus',
    'globals',
    'app'
    // 'backbone-validation',

], function($, _, User, LoginTemplate, Backbone, Users, EventBus, globals,app) {

    var LoginView = Backbone.View.extend({
        // tagName: 'div',
        // className:'login-container',
        el: "#content",
        template: _.template(LoginTemplate),
        events: {
            'click .login': 'login'
        },
        login: function(e) {
            EventBus.trigger("app:logout");
            $('.alert-warning').hide();
            var self = this;
            e.preventDefault();
            //   var url = "/api/authenticate";
            var formValues = {
                email: $('#email').val(),
                password: $('#password').val()
            };
            
            $.ajax({
                    url: globals.urls.AUTHENTICATE,
                    type: 'POST',
                    dataType: "json",
                    data: formValues
                })
                .done(function(response) {
                    EventBus.trigger("app:authenticated", response);
                    var unsavedPoll=app.getUnsavedPoll();
                    if(unsavedPoll){
                        self.savePollFromStorage(unsavedPoll, app.getUser().id);
                    } else {
                         EventBus.trigger("app:goHome");
                    }
                })
                .fail(function(response) {
                    $('.alert-warning').show();
                });
        },
        savePollFromStorage:function(poll, userId){
            if(poll && userId){
                EventBus.trigger('savePoll', poll, userId);
            }
        },
        render: function() {
            // $(this.el).html(this.template(this.model.toJSON()));
            //  this.$el.html(this.template(this.model.toJSON()));
              this.$el.html(this.template);

            //  this.$el.html( this.template( this.model.toJSON()) );
            return this;
        }
    });
    return LoginView;
});