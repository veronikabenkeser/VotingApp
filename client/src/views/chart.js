define(['jquery',
    'underscore',
    'backbone',
    'text!src/templates/pollChart.html',
    'chart-js'
], function($, _, Backbone, ChartTemplate,Chart) {
    var ChartView = Backbone.View.extend({
            template: _.template(ChartTemplate),
            el:'#content',
            initialize: function(opts) {
                this.opts=opts;
                 _.bindAll(this, 'render');
                // this.render();
            },
            events:{
                'click #view-results': 'viewResults',
                'click #delete-poll': 'deletePoll'
            },
            getRandomColor:function(){
                var letters = '0123456789ABCDEF'.split('');
                var color = '#';
                for (var i = 0; i < 6; i++ ) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            },
            render: function(){
            var self =this;
            var data=[];
            self.model.toJSON().options.forEach(function(option){ 
           
                    var obj = {
                        value: parseInt(option.votes,10),
                        color: self.getRandomColor(),
                        highlight: "#FF5A5E", 
                        label: option.text
                    };
                    data.push(obj);
                });
                 self.$el.html(this.template(self.model.toJSON()));
                // self.$el.html(this.template(self.model.toJSON()));
                var ctx = $("#myChart").get(0).getContext("2d");
                var myDoughnutChart = new Chart(ctx).Doughnut(data);
                document.getElementById('js-legend').innerHTML = myDoughnutChart.generateLegend();
                return this;
            }
        });
    return ChartView;
});