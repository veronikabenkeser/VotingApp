define(['underscore', 'backbone', 'src/collections/polls'], function(_, Backbone, Polls) {
  var User = Backbone.Model.extend({
    urlRoot: "/api/users",
    idAttribute: '_id',
    defaults: {
      _id: null,
      name: '',
      email: '',
      password: '',
      registeredVotes: ''
    },
    initialize: function() {
      this.polls = new Polls();
      this.polls.url = '/api/users/' + this.id + '/polls/';
    },
    parse: function(response) {
      return response;
    },
    patterns: {
      specialCharacters: '[^a-zA-Z 0-9]+',
      digits: '[0-9]',
      email: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9][a-zA-Z0-9.-]*[.]{1}[a-zA-Z]{2,6}$'
    },
    validators: {
      minLength: function(value, minLength) {
        return value.length >= minLength;
      },
      maxLength: function(value, maxLength) {
        return value.length <= maxLength;
      },
      isEmail: function(value) {
        return new RegExp(User.prototype.patterns.email).test(value);
      }
    },
    validate: function(attrs) {
      var self = this;

      var errors = this.errors = {};

      if (typeof attrs.password !== 'undefined') {
        if (!attrs.password) {
          errors.password = 'password is required';
        }
        else if (!User.prototype.validators.minLength(attrs.password, 6)) {
          errors.password = 'password is too short';
        }
      }
      if (typeof attrs.name !== 'undefined') {
        if (!attrs.name) {
          errors.name = 'Name is required';
        }

        else if (!User.prototype.validators.minLength(attrs.name, 2)) {
          errors.name = 'name is too short';
        }

        else if (!User.prototype.validators.maxLength(attrs.name, 15))
          errors.name = 'name is too large';
      }

      if (typeof attrs.email !== 'undefined') {
        console.log("what is it");
        console.log(attrs.email);
        if (!attrs.email) {
          errors.email = 'Email is required';
        }

        else if (!User.prototype.validators.isEmail(attrs.email)) {
          errors.email = 'Email is invalid';
        }
      }

      if (!_.isEmpty(errors)) {
        self.trigger('invalid', errors);
        return errors;
      }
      else {
        return false;
      }
    }
  });
  return User;
});