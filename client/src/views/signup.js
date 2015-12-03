define(['jquery',
'underscore',
'src/models/user',
'text!src/templates/signup.html',
'backbone'
// 'backbone-validation',

], function($,_, User,SignupTemplate,Backbone){
    var SignupView = Backbone.View.extend({
        tagname:'div',
        className: 'signup-container',
        template: _.template(SignupTemplate),
        events:{
            // 'change input[type!="submit"]': 'validate0',
            // // 'change': 'validate0',
            'click .signup':'registerUser',
            'change input': 'onInputChange',
            // 'keyup input':'onInputChange'
            // 'change':'onInputChange'
            'keyup input':'realTimeOnInputChange'
            
        },
        onInputChange:function(e){
            console.log("onInputchange");
            console.log(e.target.id);
             console.log(e.target.value);
             
             var fieldName=e.target.id;
             var fieldValue=e.target.value;
            this.model.set(fieldName, fieldValue);
            console.log("BL"+this.model.get(fieldName));
            
            // var result = this.model.validateOne(e.target.id, e.target.value);
            //bcakbone validation on set
            var tempObj={};
            tempObj[fieldName]=fieldValue;
            var errors = this.model.validate(tempObj);
            console.log("errors is "+errors);
            if(!_.isEmpty(errors)){
                console.log('error obj is not empty');
                this.showErrors(errors);
            }else{
                console.log("error obj is empty");
                this.removeValidationErr(fieldName);
            }
        },
        realTimeOnInputChange:function(e){
            console.log("KEYDOWN");
             var fieldName=e.target.id;
         if( $('#'+fieldName).parent().hasClass('error')){
             console.log("REAL TIME ");
             this.onInputChange(e);
            // this.removeValidationErr(fieldName);
         }   
        },
       showErrors: function(errors){
           for(var key in errors){
               if(errors.hasOwnProperty(key)){
                   this.showValidationError(key,errors[key]);
               }
           }
       },
       showValidationError:function(fieldName, message){
           $('#'+fieldName).parent().addClass('error');
           $('#'+fieldName).next().html(message);
       },
       removeValidationErr:function(fieldName){
            $('#'+fieldName).parent().removeClass('error');
           $('#'+fieldName).next().html('');
       },
        initialize: function(){
          var user = new User();  
          this.listenTo(this.model, 'invalid', this.onModelInvalid);
        //   this.listenTo(this.model, 'change',this.validate0);
        },
        // initialize: function(){
        //     var myModel = new User();
        //      Backbone.Validation.bind(this, {
        //      model: myModel
            // valid: function(view, attr){
            //     console.log("AU VALID");
            // },
            // invalid: function(view,attr, error){
            //     console.log("FINALLY INVALID");
            // }
    // });
        
        render: function(){
            //this.el is what we defined in tagName
            $(this.el).html(this.template(this.model.toJSON()) );
            //  this.$el.html( this.template( this.model.toJSON()) );
            return this;
        },
        registerUser: function(e){
          
            
             e.preventDefault();
         
             
             
    //   var formData ={};
    var self = this;
      $('#signup-form div').children('input').each(function(index,elem){
        //   if($(elem).val() !=''){
        console.log("ELEM(id ) "+ elem.id);
             
              console.log("ELEM(VAL ) "+ $(elem).val());
            //   formData[elem.id] = $(elem).val();
             self.set(elem.id, $(elem).val());
        //   }
      });
      
      
        // this.model = new User(formData);
        
        
    //     this.model.validate();
        
      
    //     var isValid = this.model.isValid();
    //   console.log("VALID?? "+isValid);
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
        setValues:function(e){
             e.preventDefault();
            var fieldName = e.target.id;
        var fieldValue = e.target.value;
        console.log("VALUES SET: ");
        console.log("fieldname "+fieldName);
         this.model.set({fieldName,fieldValue}, {validate:true, validateAll:false});
         
        },
        validate0:function(e){
             e.preventDefault();
             var fieldName = e.target.id;
        var fieldValue = e.target.value;
        console.log("NAME "+ fieldName);
        console.log('this model '+this.model.keys());
        //     console.log("change to model detected automatically");
        // this.model.set(fieldName,fieldValue);
            this.model.set({"password":"v"},{validate:true, validateAll:false});
            console.log("this models "+ this.model.fieldName+ " Is "+ this.model.get(fieldName));
            // this.model.set({fieldName,fieldValue}, {validate:true, validateAll:false});
        },
        validate2:function(e){
            console.log("GOING TO VALIDATE ON CHANGE");
             //Apply changes to the model
             
        var fieldName = e.target.id;
        var fieldValue = e.target.value;
        //change a property inside of the model
       
        this.model.set({fieldName,fieldValue}, {validate:true, validateAll:false});
    
        },
        onModelInvalid: function(model, errors){
            console.log("MODEL IS INvALID");
        }
    });
    
    return SignupView;
});