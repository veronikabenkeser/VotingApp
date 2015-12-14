define(['jquery',
    'underscore',
    'src/models/user',
    'text!src/templates/signup.html',
    'backbone',
    // 'backbone-validation',
    'eventBus'
], function($, _, User, SignupTemplate, Backbone, EventBus) {
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

            if (errors === undefined) {
                console.log("error obj is empty");
                this.removeValidationErr(fieldName);
            }
        },
        realTimeOnInputChange: function(e) {
            console.log("KEYDOWN");
            var fieldName = e.target.id;
            if ($('#' + fieldName).parent().hasClass('error')) {
                console.log("REAL TIME ");
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
            var self = this;
            $('#signup-form div').children('input').each(function(index, elem) {

                -self.model.set(elem.id, $(elem).val()); + self.model.set(elem.id, $(elem).val());

            });


            //automatically validating according to the model beofre save
            self.model.save(null, { //issues a post request to the link in user model.

                wait: true, //don't update the client side model until the server side trip is successful
                success: function(model) { //will occur when the server successfully returns a response
                    //   self.render();
                    console.log("SAVED");

                    //the server responds to the POST req with JSON representing the saved model
                    console.log(model);
                    console.log(model.id);
                    //  myRouter.navigate('polls/'+model.id, {trigger:true});
                    EventBus.trigger('router:navigate', {
                        route: '',
                        options: {
                            trigger: true
                        }
                    });
                },
                error: function(model, error) {
                    console.log(model.toJSON());
                    console.log("ERROR OCCURED");
                }
            });
        },
        setValues: function(e) {
            e.preventDefault();
            var fieldName = e.target.id;
            var fieldValue = e.target.value;
            console.log("VALUES SET: ");
            console.log("fieldname " + fieldName);
            this.model.set({
                fieldName, fieldValue
            }, {
                validate: true,
                validateAll: false
            });
        },
        validate0: function(e) {
            e.preventDefault();
            var fieldName = e.target.id;
            var fieldValue = e.target.value;
            //     console.log("change to model detected automatically");
            // this.model.set(fieldName,fieldValue);
            this.model.set({
                "password": "v"
            }, {
                validate: true,
                validateAll: false
            });
            console.log("this models " + this.model.fieldName + " Is " + this.model.get(fieldName));
            // this.model.set({fieldName,fieldValue}, {validate:true, validateAll:false});
        }
    });

    return SignupView;
});