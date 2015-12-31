define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/pollDetails.html',
     'chart-js',
     'src/views/chart',
     'eventBus',
     'src/models/poll',
     'app'
], function($, _, Backbone, pollDetailsTemplate, Chart,ChartView,EventBus,Poll,app) {
    var PollDetailsView = Backbone.View.extend({
        el:'#content',
        template: _.template(pollDetailsTemplate),
        events: {
            'click #delete': 'deletePoll',
            'click #vote' : 'vote',
            'click #add-option': 'addOption'
        },
        initialize: function(opts) {
            this.opts = opts;
             _.bindAll(this, 'render');
            this.listenTo(this.model, "change", this.render);
            this.render();
        },
        
        addOption:function(){
            var button = '<td class ="voting-options"><input type="radio" class ="new-items" name="items" value=""></td>';
            var field =' <td style="font-size:16px;">'+'<input type="text" name="new-option">'+'</td>';
            var full=  '<tr>'+button+field+'</tr>';
            $('#poll-options-table tbody').append(full);
        },
        deletePoll: function() {
            //Delete model
            var self = this;
            this.model.destroy().done(function() { //model is automatically removed from the collection
                self.remove(); ////Delete view or self.render() to redraw
            });
        },
        vote:function(){
            var self = this;
            var newOptionsArr=[];
            
            //Go through all of the newly added fields;
            $('input[name=new-option]').each(function(){
                var text= $(this).val();
                if(text){
                newOptionsArr.push(text);
                //Set the value field of the radio box 
                $(this).parent().siblings().find('input').val(text);
                }
            });
            
            //Find the selected option
            var voteId= $('input[class=old-items]:checked', '.voting-options').val();
            var voteName = $('input[class=new-items]:checked', '.voting-options').val();
            
            if(!voteId && !voteName){
                alert('You cannot select an empty option');
            }else{
                this.recordVote(newOptionsArr,voteId,voteName);
            }
        },
        recordVote:function(newOptionsArr, voteId,voteName){
            var self = this;
            var obj={
                'newOptionsArr':newOptionsArr,
                'voteId':voteId,
                'voteNewOptionName':voteName,
                // 'voter': app.getUser().id
                'voter':this.opts.user.attributes._id
            };
              $.ajax({
                        // url: '/api/polls/'+this.model.attributes.slug,
                        url: '/api/polls/'+this.model.id,
                        type: 'PUT',
                        dataType: "json",
                        data: obj
                    })
                    .done(function(poll) {
                        //server responds with a populated poll
                        var p = new Poll(poll);
                        self.showChart(p);
                        app.initializeUser();
                    })
                    .fail(function(err) {
                        //self.showPollNotSaved();
                    });
        },
        getRandomColor:function(){
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        showChart: function(poll){
            EventBus.trigger('home:displayView', new ChartView({
                    model:poll
                }));
        },
        render: function() {
            //this.el is what we defined in tagName
            this.$el.html(this.template({poll:this.model.toJSON(),user:this.opts.user.toJSON()}));
            return this;
        }  
    });
    return PollDetailsView;
});