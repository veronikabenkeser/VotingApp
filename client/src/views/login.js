define(['jquery',
    'underscore',
    'src/models/user',
    'text!src/templates/login.html',
    'backbone',
    'src/collections/users',
    'eventBus',
    'globals',
    'app'

], function($, _, User, LoginTemplate, Backbone, Users, EventBus, globals, app) {

    var LoginView = Backbone.View.extend({
        el: "#content",
        template: _.template(LoginTemplate),
        events: {
            'click .login': 'login'
        },
        login: function(e) {
            e.preventDefault();
            $('.alert-warning').hide();
            var self = this;
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
                    var unsavedPoll = app.getUnsavedPoll();
                    if (unsavedPoll) {
                        self.savePollFromStorage(unsavedPoll, app.getUser().id);
                    }
                    else {
                        EventBus.trigger("app:goHome");
                    }
                })
                .fail(function(response) {
                    $('.alert-warning').show();
                });
        },
        savePollFromStorage: function(poll, userId) {
            if (poll && userId) {
                EventBus.trigger('savePoll', poll, userId);
            }
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        }
    });
    return LoginView;
});