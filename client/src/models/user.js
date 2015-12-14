define(['underscore', 'backbone', '../collections/polls'], function(_, Backbone, Polls) {
  var User = Backbone.Model.extend({
    urlRoot: "/api/users",
    idAttribute: '_id',
    defaults: {
      _id: null,
      name: '',
      email: '',
      password: ''
    },
    initialize: function() {
      this.polls = new Polls();
      this.polls.url = '/api/users/' + this.id + '/polls';
    },
    patterns: {
      specialCharacters: '[^a-zA-Z 0-9]+',

      digits: '[0-9]',

      email: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9][a-zA-Z0-9.-]*[.]{1}[a-zA-Z]{2,6}$'
    },
    validators: {
      minLength: function(value, minLength) {
        console.log("REAL VAL OF VAL " + value);
        return value.length >= minLength;

      },
      maxLength: function(value, maxLength) {
        return value.length <= maxLength;

      },
      isEmail: function(value) {
        return new RegExp(User.prototype.patterns.email).test(value);

      }
      //   hasSpecialCharacter: function(value) {
      //     return User.prototype.validators.pattern(value, User.prototype.patterns.specialCharacters);
      //   }
    },
    validate: function(attrs) {
      var self = this;
      console.log("here it is " + attrs.name);


      var errors = this.errors = {};

      if (attrs.password != null) {
        if (!attrs.password) {
          errors.password = 'password is required';
          console.log('Password isEmpty validation called');
        }

        else if (!User.prototype.validators.minLength(attrs.password, 6)) {
          console.log('password is too short');
          errors.password = 'password is too short';
        }
      }
      if (attrs.name != null) {

        if (!attrs.name) {
          errors.name = 'Name is required';
          console.log('NameisEmpty validation called');
        }
        
        else if (!User.prototype.validators.minLength(attrs.name, 2)) {
          errors.name = 'name is too short';
          console.log("name is too short. here it is " + attrs.name);
        }
        
        else if (!User.prototype.validators.maxLength(attrs.name, 15))
          errors.name = 'name is too large';
      }
      
      if (attrs.email != null) {
        if (!attrs.email) {
          errors.email = 'Email is required';
          console.log('Email isEmpty validation called');
        }
        
        else if (!User.prototype.validators.isEmail(attrs.email)) {
          console.log('email is invalid.');
          errors.email = 'Email is invalid';
        }
      }
      
      if (!_.isEmpty(errors)) {
        self.trigger('invalid', errors);
        return errors;
      }
    }
  });
  return User;
});