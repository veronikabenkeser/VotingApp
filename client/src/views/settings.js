define(['jquery',
    'underscore',
    'src/models/user',
    'text!src/templates/settings.html',
    'backbone',
    // 'backbone-validation',
    'eventBus',
    'app'
], function($, _, User, SettingsTemplate, Backbone, EventBus, app) {
    var SettingsView = Backbone.View.extend({
        el: "#content",
        template: _.template(SettingsTemplate),
        initialize: function() {
            this.on('invalid', this.showErrors);
        },
        events: {

            'click .save': 'saveChanges',
            'change input': 'onInputChange',
            'keyup input': 'onInputChange'

        },

        render: function() {
            //this.el is what we defined in tagName
            $(this.el).html(this.template);
            return this;
        },
        saveChanges: function(e) {
            e.preventDefault();
            var self = this;

            if (app.getUser().id) {
                var formValues = {
                    id: app.getUser().id,
                    oldPassword: $('#oldPassword').val(),
                    newPassword: $('#newPassword').val()
                };

                var errors = this.validate(formValues);
                if (!errors) {
                    this.saveNewPassword(formValues);

                }
                else {
                    console.log("ERRORS FOUND");
                }
            }
        },
        saveNewPassword: function(formValues) {
            $.ajax({
                    url: '/api/users/' + formValues.id,
                    type: 'PUT',
                    dataType: "json",
                    data: formValues
                })
                .done(function(response) {
                    EventBus.trigger("app:goHome");
                    console.log('password changed');
                })
                .fail(function(response) {
                    $('.alert-warning').show();
                    console.log("error - password not changed");
                });
        },
        validate: function(attrs) {
            $('.alert-warning').hide();
            var self = this;
            var errors = this.errors = {};

            if (attrs.oldPassword != null) {

                if (!attrs.oldPassword) {
                    errors.oldPassword = 'Your old password is required.';
                    console.log('Password isEmpty validation called');
                }
            }

            if (attrs.newPassword != null) {

                if (!attrs.newPassword) {
                    errors.newPassword = 'Your new password is required.';
                    console.log('Password isEmpty validation called');
                }
                else if (!User.prototype.validators.minLength(attrs.newPassword, 6)) {
                    console.log('password is too short');
                    errors.newPassword = 'Your new password is too short';
                }
            }

            if (!_.isEmpty(errors)) {
                self.trigger('invalid', errors);
                return errors;
            }
        },
        onInputChange: function(e) {
            var fieldName = e.target.id;
            var fieldValue = e.target.value;

            var tempObj = {};
            tempObj[fieldName] = fieldValue;
            var errors = this.validate(tempObj);

            if (!errors) {
                this.removeValidationErr(fieldName);
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
        }
    });

    return SettingsView;
});