define(['jquery',
    'underscore',
    'src/models/user',
    'text!src/templates/settings.html',
    'backbone',
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
            $(this.el).html(this.template);
            return this;
        },
        saveChanges: function(e) {
            e.preventDefault();
            var self = this;

            if (app.getUser().id) {
                var formValues = {
                    oldPassword: $('#oldPassword').val(),
                    newPassword: $('#newPassword').val()
                };
                var errors = this.validate(formValues);
                if (!errors) {
                    this.saveNewPassword(formValues);

                }
            }
        },
        saveNewPassword: function(formValues) {
            $.ajax({
                    url: '/api/users/' + app.getUser().id,
                    type: 'PUT',
                    dataType: "json",
                    data: formValues
                })
                .done(function(response) {
                    EventBus.trigger("app:goHome");
                })
                .fail(function(response) {
                    $('.alert-warning').show();
                });
        },
        validate: function(attrs) {
            $('.alert-warning').hide();
            var self = this;
            var errors = this.errors = {};

            if (attrs.oldPassword != null) {

                if (!attrs.oldPassword) {
                    errors.oldPassword = 'Your old password is required.';
                }
            }

            if (attrs.newPassword != null) {

                if (!attrs.newPassword) {
                    errors.newPassword = 'Your new password is required.';
                }
                else if (!User.prototype.validators.minLength(attrs.newPassword, 6)) {
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