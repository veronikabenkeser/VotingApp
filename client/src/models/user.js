define(['underscore','backbone'],function(_,Backbone){
    var User = Backbone.Model.extend({
        urlRoot:"/api/users",
    idAttribute: '_id',
    defaults:{
        // _id: '',
        name:'',
        email:'',
        password:''
        
    },
    initialize: function(){
      
      
        
        // this.patterns={};
        // this.patterns.specialCharacters= '[^a-zA-Z 0-9]+';
        // this.patterns.digits= '[0-9]';
        //  this.patterns.email='^[a-zA-Z0-9._-]+@[a-zA-Z0-9][a-zA-Z0-9.-]*[.]{1}[a-zA-Z]{2,6}$';
        
    },
    patterns:{
          specialCharacters: '[^a-zA-Z 0-9]+',

          digits: '[0-9]',

          email: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9][a-zA-Z0-9.-]*[.]{1}[a-zA-Z]{2,6}$'
    },
    validators: {

          minLength: function(value, minLength) {
              console.log("REAL VAL OF VAL "+ value);
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
           console.log("here it is "+ attrs.name);
      

          var errors = this.errors = {};

          if(attrs.password != null) {
              if (!attrs.password) {
                  errors.password = 'password is required';
                  console.log('Password isEmpty validation called');
              }

              else if(!User.prototype.validators.minLength(attrs.password, 6)){
              console.log('password is too short');
                errors.password= 'password is too short';
              }
              else if(!User.prototype.validators.maxLength(attrs.password, 15))
                errors.firstname = 'password is too large';
          }
            if(attrs.name != null) {
               
              if (!attrs.name) {
                  errors.name = 'Name is required';
                  console.log('NameisEmpty validation called');
              }

              else if(!User.prototype.validators.minLength(attrs.name, 2)){
                   errors.name= 'name is too short';
                   console.log("name is too short. here it is "+ attrs.name);
              }
               
              else if(!User.prototype.validators.maxLength(attrs.name, 15))
                errors.name = 'name is too large';
          }

          if(attrs.email != null) {

              if (!attrs.email) {
                  errors.email = 'Email is required';
                  console.log('Email isEmpty validation called');
              }

              else if(!User.prototype.validators.isEmail(attrs.email)){
                  
              console.log('email is invalid.');
                errors.email = 'Email is invalid';
              }
          }
         
        //  return (_.isEmpty(errors))?errors:false;
        return errors;
   }
          
  
    // initialize: function(){
    //   // your model needs to have Validation Methods on it first
    // _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
    // },
    // // validate: function(attrs, options){
        
    // // },
//     validation: {
//       name: {
//           required:true,
//           msg: "Please enter your name."
//       },
//       email : [{
//           required: true,
//           msg: "Please enter an email address."
//       }, {
//           pattern: 'email',
//           msg: "Please enter a valid email."
//       }],
//       password: [{
//           required:true,
//           msg: "Please enter a password."
//       },{
//           range: [7,15],
//           msg: "Password must be 7-15 characters long."
//       }]
//     }
 
// });

// User.bind('validated', function(isValid, model, errors) {
//   // do something
//   console.log("ISVALID IS "+isValid);
 });
return User;
});



      
          
          
        //     this.validators ={};
        // this.validators.name = function(val){
        //     return val!=""?{isValid:true}:{isValid:false, message: "Please enter a name for this poll"};
        // };
        // this.validators.email = function(val){
        //     this.validate.minLength
        //      return val!=""?{isValid:true}:{isValid:false, message: "Please enter option1 for this poll"};
        // };
        // this.validators.password = function(val){
        //      return val!=""?{isValid:true}:{isValid:false, message: "Please enter option2 for this poll"};
        // };