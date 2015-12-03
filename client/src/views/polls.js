define(['jquery','backbone','src/collections/polls','src/views/poll'],function($,Backbone,Polls,PollView){
var PollsView = Backbone.View.extend({
    el:'#content',
    initialize:function(){
        console.log("HI");
        // this.collection = new Polls();
        // this.collection.fetch({reset:true});//populating our polls view from the database
        // // this.render();
        // this.listenTo(this.collection, 'add', this.renderPoll);
        // this.listenTo(this.collection, 'reset', this.render);
        this.collection.on('reset',this.render,this);
        this.collection.on('add', this.renderPoll,this);
    },
    events:{
       'click #add': 'addPoll' 
    },
    //Render all polls by rendering each poll
    render: function(){
        this.collection.forEach(function(item){
            this.renderPoll(item);
        },this);
        return this;
    },
    //Render a poll by creating a PollView and appending the element to the polls element
  renderPoll: function(item){
      var pollView = new PollView({
          model: item
      });
      this.$el.append(pollView.render().el);
    // this.$el.html(pollView.render().el);
      return this;
  }
//   addPoll: function(e){
//       e.preventDefault();
//       var formData ={};
//       $('#addPoll div').children('input').each(function(index,elem){
//           if($(elem).val() !=''){
//               formData[elem.id] = $(elem).val();
//           }
//       });
//     //   this.collection.add(new app.Poll(formData));
//       this.collection.create(formData);// Equivalent to instantiating a model with a hash of attributes, saving the model to the server, and adding the model to the set after being successfully created. Returns the new model
//   }
    
});

return PollsView;
});