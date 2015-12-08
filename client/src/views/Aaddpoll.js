define(['jquery',
    'underscore',
    'backbone',
    'src/models/poll',
    'text!src/templates/newpoll.html'
], function($, _, Backbone, Poll, NewpollTemplate) {
    var NewPollView = Backbone.View.extend({
        tagname: 'div',
        className: 'pollContainer',
        // template:_.template($('#pollTemplate').html()),
        template: _.template(NewpollTemplate),
        events: {
            'click .add': 'beforeAddPoll',
            'change': 'change'
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
        change: function(e) {
            console.log("CHANGE!");

            //Apply changes to the model
            var fieldName = e.target.id;
            var fieldValue = e.target.value;
            //change a property inside of the model
            this.model.set(fieldName, fieldValue);

            var inputcheck = this.model.validateField(e.target.id);
            if (inputcheck.isValid) {
                this.removeValidationErr(fieldName);
            }
            else {
                this.displayValidationErr(fieldName, inputcheck.message);
            }
        },

        beforeAddPoll: function(e) {
            console.log("ADD BUTTON CLICKED");
            e.preventDefault();
            var formData = {};
            $('#addPoll div').children('input').each(function(index, elem) {
                //   if($(elem).val() !=''){
                console.log("NOT EMPTY");
                formData[elem.id] = $(elem).val();
                //   }
            });


            this.model = new Poll(formData);
            var inputcheck = this.model.validateAll();
            if (!inputcheck.isValid) {
                console.log(inputcheck.messages);
                //display validation errors;
                for (var key in inputcheck.messages) {
                    if (inputcheck.messages.hasOwnProperty(key)) {
                        this.displayValidationErr(key, inputcheck.messages[key]);
                    }
                }
                return false;
            }
            this.addPoll();
            return false;
        },

        addPoll: function() {
            var self = this;
            this.model.save(null, {
                wait: true, //don't update the client side model until the server side trip is successful
                success: function(model) { //will occur when the server successfully returns a response
                    //   self.render();
                    console.log("SAVED");

                    //the server responds to the POST req with JSON representing the saved model
                    console.log(model);
                    console.log(model.id);
                    myRouter.navigate('polls/' + model.id, {
                        trigger: true
                    });
                },
                error: function(model, error) {
                    console.log(model.toJSON());
                    console.log("ERROR OCCURED");
                }
            });

            //   $('#addPoll div').children('input').each(function(index,elem){
            //       if($(elem).val() !=''){
            //           console.log("NOT EMPTY");
            //           formData[elem.id] = $(elem).val();
            //       }
            //   });
            //   var self=this;
            //   this.model = new Poll(formData);
            //   this.model.save(null,{
            //       success: function(model){
            //           self.render();
            //           console.log("AYYA");
            //           router.navigate('polls/'+model.id,false);
            //       },
            //       error: function(){
            //           console.log("ERROR OCCURED");
            //       }
            //   });
        },
        displayValidationErr: function(fieldName, message) {
            //display the error message above the field
            var validationErr = $('<div>' + message + '</div>');
            validationErr.addClass(fieldName + '-error');
            $('#form-error').append(validationErr);
        },
        removeValidationErr: function(fieldName) {
            $("." + fieldName + "-error").remove();
        }

        //   this.collection.add(new app.Poll(formData));
        //       this.collection.create(formData,{wait:true, success: this.sucCall});// Equivalent to instantiating a model with a hash of attributes, saving the model to the server, and adding the model to the set after being successfully created. Returns the new model
        //   },
        //   sucCall:function(){
        //       console.log("ADDED CORRECTLY");
        //   }
    });
    return NewPollView;
});