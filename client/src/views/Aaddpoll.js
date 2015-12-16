define(['jquery',
    'underscore',
    'backbone',
    'src/collections/polls',
    'src/models/poll',
    'src/models/user',
    'src/models/option',
    'text!src/templates/newpoll.html',
    'eventBus',
    'app',
    'src/views/polls'
], function($, _, Backbone, Polls, Poll, User, Option, NewpollTemplate, EventBus, app, PollsView) {
    var NewPollView = Backbone.View.extend({
        tagname: 'div',
        className: 'pollContainer',
        // template:_.template($('#pollTemplate').html()),
        template: _.template(NewpollTemplate),
        events: {
            // 'change': 'change'
            'click .add': 'addPoll'

        },
        initialize: function() {
            //   this.render();
        },

        render: function() {
            //this.el is what we defined in tagName
            $(this.el).html(this.template(this.model.toJSON()));
            //  this.$el.html( this.template( this.model.toJSON()) );
            return this;
        },
        // change: function(e) {
        //     console.log("CHANGE!");

        //     //Apply changes to the model
        //     var fieldName = e.target.id;
        //     var fieldValue = e.target.value;
        //     //change a property inside of the model
        //     this.model.set(fieldName, fieldValue);

        //     var inputcheck = this.model.validateField(e.target.id);
        //     if (inputcheck.isValid) {
        //         this.removeValidationErr(fieldName);
        //     }
        //     else {
        //         this.displayValidationErr(fieldName, inputcheck.message);
        //     }
        // },
        displayValidationErr: function(fieldName, message) {
            //display the error message above the field
            var validationErr = $('<div>' + message + '</div>');
            validationErr.addClass(fieldName + '-error');
            $('#form-error').append(validationErr);
        },
        removeValidationErr: function(fieldName) {
            $("." + fieldName + "-error").remove();
        },
        addPoll: function(e) {
            console.log("ADD BUTTON CLICKED");
            e.preventDefault();
            var self = this;

            var formData = {};
            formData.name = $('#addPoll #name').val();
            formData.options = [];


            $('#addPoll .options').each(function(index, opt) {
                var val = $(opt).val();
                formData.options.push({
                    'text': val
                });
            });

            //If a user is signed in, get the user's id and add this poll to the user's profile
            var currentUser = app.getUser();
            if (currentUser && currentUser.id) {

                $.ajax({
                        url: '/api/users/' + currentUser.id + '/polls',
                        type: 'POST',
                        dataType: "json",
                        data: formData
                    })
                    .done(function(response) {
                         self.render();
                         $('.poll-saved').show();
                    })
                    .fail(function(err) {
                          $('.poll-not-saved').show();
                    });

            }
            else {
                var poll = new Poll(formData);
                poll.save(null, {
                    success: function(poll) {
                        self.render();
                        $('.poll-saved').show();
                    },
                    error: function(err) {
                        $('.poll-not-saved').show();
                    }
                });

            }
        }
    });
    return NewPollView;
});