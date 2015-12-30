define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/pollDetails.html',
     'text!src/templates/pollChart.html',
     'chart-js',
     'src/views/chart',
     'eventBus',
     'src/models/poll'
], function($, _, Backbone, pollDetailsTemplate, ChartTemplate,Chart,ChartView,EventBus,Poll) {
    var PollDetailsView = Backbone.View.extend({
        el:'#content',
        templates:{
            'details': _.template(pollDetailsTemplate),
            'chart': _.template(ChartTemplate)
        },
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

            //  this.model.destroy({ //model is automatically removed from the collection
            //      success: function(){

            //          console.log("Poll deleted successfully");
            //          //Delete view
            //  self.remove();
            //         // //  window.history.back();

            //      }
            //  });

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
                'voteNewOptionName':voteName
            };
              $.ajax({
                        url: '/api/polls/'+this.model.attributes.slug,
                        type: 'PUT',
                        dataType: "json",
                        data: obj
                    })
                    .done(function(poll) {
                        //server responds with a populated poll
                        var p = new Poll(poll);
                        self.showChart(p);
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
        showChart0:function(poll){
            var self =this;
            var data=[];
            poll.options.forEach(function(option){ 
                var obj = {
                    value: parseInt(option.votes,10),
                    color: self.getRandomColor(),
                    highlight: "#FF5A5E", 
                    label: option.text
                };
                data.push(obj);
            });
            self.$el.html(this.templates.chart(self.model.toJSON()));
            var ctx = $("#myChart").get(0).getContext("2d");
            var myDoughnutChart = new Chart(ctx).Doughnut(data);
            document.getElementById('js-legend').innerHTML = myDoughnutChart.generateLegend();
            return this;
        },
        render: function() {
            //this.el is what we defined in tagName
            this.$el.html(this.templates.details({poll:this.model.toJSON(),user:this.opts.user.toJSON()}));
            return this;
        }  
    });
    return PollDetailsView;
});