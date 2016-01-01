define(['jquery',
    'underscore',
    'src/models/user',
    'text!src/templates/signup.html',
    'backbone',
    // 'backbone-validation',
    'eventBus',
    'globals'
], function($, _, User, SignupTemplate, Backbone, EventBus, globals) {
    var SignupView = Backbone.View.extend({
        // tagname:'div',
        el: "#content",
        // className: 'signup-container',
        template: _.template(SignupTemplate),
        initialize: function() {
            //TODO: implement validation after the user changes his password, etc.
            //this.listenTo(this.model, 'change',this.validate0);
            this.listenTo(this.model, 'invalid', this.showErrors);
        },
        events: {

            'click .signup': 'registerUser',
            'change input': 'onInputChange',
            'keyup input': 'realTimeOnInputChange'

        },
        onInputChange: function(e) {
            var fieldName = e.target.id;
            var fieldValue = e.target.value;
            this.model.set(fieldName, fieldValue);

            var tempObj = {};
            tempObj[fieldName] = fieldValue;
            var errors = this.model.validate(tempObj);

            if (!errors) {
                this.removeValidationErr(fieldName);
            }
        },
        realTimeOnInputChange: function(e) {
            $('.alert-warning').hide();
            var fieldName = e.target.id;
            if ($('#' + fieldName).parent().hasClass('error')) {
                this.onInputChange(e);
                // this.removeValidationErr(fieldName);
            }
        },
        showErrors: function(errors) {
            for (var key in errors) {
                if (errors.hasOwnProperty(key)) {
                    this.showValidationError(key, errors[key]);
                }
            }
        },
        showValidationError: function(fieldName, message) {
            $('#' + fieldName).parent().addClass('error');
            $('#' + fieldName).next().html(message);
        },
        removeValidationErr: function(fieldName) {
            $('#' + fieldName).parent().removeClass('error');
            $('#' + fieldName).next().html('');
        },

        render: function() {
            //this.el is what we defined in tagName
            $(this.el).html(this.template(this.model.toJSON()));
            //  this.$el.html( this.template( this.model.toJSON()) );
            return this;
        },
        registerUser: function(e) {
            e.preventDefault();
            $('.alert-warning').hide();
            var self = this;
            $('#signup-form div').children('input').each(function(index, elem) {
                self.model.set(elem.id, $(elem).val());

            });


            //Save the new user and authenticate the user upon a successful save.
            self.model.save(null, { //issues a post request to the link in user model.

                wait: true, //don't update the client side model until the server side trip is successful
                success: function(model) {
                    //   self.render();

                    //the server responds to the POST req with JSON representing the saved model
                    var dataObj = {
                        email: model.get('email'),
                        password: model.get('password')
                    };

                    $.ajax({
                            url: globals.urls.AUTHENTICATE,
                            type: 'POST',
                            dataType: "json",
                            data: dataObj
                        })
                        .done(function(response) {
                            EventBus.trigger("app:authenticated", response);
                            EventBus.trigger("app:goHome");

                        })
                        .fail(function(response) {
                              console.log(response);

                        });

                },
                error: function(model, error) {
                     $('.alert-warning').show();
                }
            });
        },
        setValues: function(e) {
            e.preventDefault();
            var fieldName = e.target.id;
            var fieldValue = e.target.value;
            this.model.set({
                fieldName, fieldValue
            }, {
                validate: true,
                validateAll: false
            });
        }
    });

    return SignupView;
});