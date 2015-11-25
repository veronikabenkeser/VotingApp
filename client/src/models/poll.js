define(['underscore','backbone'],function(_,Backbone){
    var Poll = Backbone.Model.extend({
        urlRoot:"/api/polls",
    idAttribute: '_id',
    defaults:{
        name:'No name',
        option1:'Unknown',
        option2:'Unknown'
    },
    initialize: function(){
        console.log("This model has been initialized");
    },
    clear: function(){
        this.destroy();
        this.view.remove();
    }
});
return Poll;
});