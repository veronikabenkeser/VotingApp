define(['underscore','backbone'],function(_,Backbone){
    var Poll = Backbone.Model.extend({
        urlRoot:"/api/polls",
    idAttribute: "_id",
    defaults:{
        // _id: '',
        name:'',
        option1:'',
        option2:''
    },
    // validate:function(attrs){
    //     var errors = this.errors = {};
    //     if(!attrs.name) errors.name = 'Please enter a name for this poll.';
    //     if(!attrs.option1)errors.option1='Please enter option1 for this poll';
    //      if(!attrs.option2)errors.option2='Please enter option2 for this poll';
    //     if(!_.isEmpty(errors)) return errors;
    // },
    initialize: function(){
        console.log("This model has been initialized");
        this.validators ={};
        this.validators.name = function(val){
            return val!=""?{isValid:true}:{isValid:false, message: "Please enter a name for this poll"};
        };
        this.validators.option1 = function(val){
             return val!=""?{isValid:true}:{isValid:false, message: "Please enter option1 for this poll"};
        };
        this.validators.option2 = function(val){
             return val!=""?{isValid:true}:{isValid:false, message: "Please enter option2 for this poll"};
        };
        
    },
    validateAll: function(){
        var messages={};
        for(var key in this.validators){
            if(this.validators.hasOwnProperty(key)){
                var val = this.validateField(key);
                //var val = this.validators[key](this.get(key));
                if(!val.isValid) messages[key]=val.message;
            }
        }
        return _.size(messages)>0?{isValid:false, messages: messages}:{isValid:true};
    },
    validateField: function(fieldName){
       return this.validators[fieldName](this.get(fieldName));
    },
    clear: function(){
        this.destroy();
        this.view.remove();
    }
});
return Poll;
});