define(['jquery',
'underscore',
'backbone',
'src/models/user',
'text!src/templates/signup.html',
'backboneValidation'
], function($,_,Backbone, User,SignupTemplate,Backbone_Validation){
    var SignupView = Backbone.View.extend({
        tagname:'div',
        className: 'signup-container',
        template: _.template(SignupTemplate),
        events:{
            // 'change': 'validate',
            'click .signup':'registerUser'
        },
        initialize: function(){
            //validation binding
            var myModel = new User();
            Backbone.Validation.bind(this,{
                model: myModel
            });
            console.log("validation binding done");
        }, 
        render: function(){
            //this.el is what we defined in tagName
            $(this.el).html(this.template(this.model.toJSON()) );
            //  this.$el.html( this.template( this.model.toJSON()) );
            return this;
        },
        registerUser: function(e){
          
            
             e.preventDefault();
      var formData ={};
      $('#signup-form div').children('input').each(function(index,elem){
        //   if($(elem).val() !=''){
              
              formData[elem.id] = $(elem).val();
        //   }
      });
      
        this.model = new User(formData);
        if(this.model.isValid("email")){
            console.log('validating email');
        }
        var isValid = this.model.isValid();
       
            //validate entered info
            
            //check whether this username already exists in the database
            
            //if not, save the user in the database and login the user into the site
            this.model.save(null,{
          wait: true,//don't update the client side model until the server side trip is successful
          success: function(model){//will occur when the server successfully returns a response
            //   self.render();
              console.log("SAVED");
             
            //the server responds to the POST req with JSON representing the saved model
              console.log(model);
               console.log(model.id);
            //  myRouter.navigate('polls/'+model.id, {trigger:true});
          },
          error: function(model,error){
              console.log(model.toJSON());
              console.log("ERROR OCCURED");
        }
        });
        },
        validate:function(){
            
        }
    });
    
    return SignupView;
});