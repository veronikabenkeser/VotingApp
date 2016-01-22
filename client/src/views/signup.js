define(['jquery',
    'underscore',
    'src/models/user',
    'text!src/templates/signup.html',
    'backbone',
    'eventBus',
    'globals'
], function($, _, User, SignupTemplate, Backbone, EventBus, globals) {
    var SignupView = Backbone.View.extend({
        el: "#content",
        template: _.template(SignupTemplate),
        initialize: function() {
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
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        registerUser: function(e) {
            e.preventDefault();
            $('.alert-warning').hide();
            var self = this;
            $('#signup-form div').children('input').each(function(index, elem) {
                self.model.set(elem.id, $(elem).val());

            });

            self.model.save(null, {

                wait: true,
                success: function(model) {
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
                            alert(response.message);

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