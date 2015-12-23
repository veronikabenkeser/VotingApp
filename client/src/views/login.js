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

        initialize: function() {

        },
        events: {
            'click .login': 'login'
        },
        login: function(e) {
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
                //  .fail(function(jqXHr, textStatus, errorThrown){
                .fail(function(response) {
                    console.log("req failed");
                    //   console.log(jqXHr.responseText);
                    self.$('.alert-warning').text(response.message).show();

                });
        },
        savePollFromStorage:function(poll, userId){
            console.log("TRYING TO SAVE POLL FROM STORAGE");
            console.log('poll'+poll);
            console.log('user id '+ userId);
            if(poll && userId){
                EventBus.trigger('savePoll', poll, userId);
            }
        },

        // this.validateFormat();
        //if passes validation, send a post request to try to log in with these credentials
        //       var formData ={};

        //   $('#login-form div').children('input').each(function(index,elem){
        //     //   if($(elem).val() !=''){


        //     console.log("ELEM(id ) "+ elem.id);

        //           console.log("ELEM(VAL ) "+ $(elem).val());
        //           formData[elem.id] = $(elem).val();

        //     //   }
        //   });
        //  var user = new User(formData);
        //  user.fetch({
        //     success: function (user) {
        //         console.log(user.toJSON());
        //     },
        //     error:function(err){
        //         console.log("ERRROORRR");
        //     }
        // });
        //     },
        //     validateFormat: function(){

        //     },
        render: function() {
            // $(this.el).html(this.template(this.model.toJSON()));
             this.$el.html(this.template(this.model.toJSON()));

            //  this.$el.html( this.template( this.model.toJSON()) );
            return this;
        }
    });
    return LoginView;
});