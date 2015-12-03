define(['underscore','backbone','backboneValidation'],function(_,Backbone,Backbone_Validation){
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
       // your model needs to have Validation Methods on it first
    _(this).extend(Backbone.Validation);
    },
    // validate: function(attrs, options){
        
    // },
    validation: {
       name: {
           required:true,
           msg: "Please enter your name."
       },
       email : [{
           required: true,
           msg: "Please enter an email address."
       }, {
           pattern: 'email',
           msg: "Please enter a valid email."
       }],
       password: [{
           required:true,
           msg: "Please enter a password."
       },{
           range: [7,15],
           msg: "Password must be 7-15 characters long."
       }]
    }
 
});

User.bind('validated', function(isValid, model, errors) {
  // do something
  console.log("ISVALID IS "+isValid);
});
return User;
});