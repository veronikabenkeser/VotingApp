define(['jquery',
    'underscore',
    'backbone',
    'src/collections/polls',
    'src/models/poll',
    'src/models/user',
    'src/models/option',
    'text!src/templates/newpoll.html',
    'eventBus',
    'app',
    'src/views/polls'
], function($, _, Backbone, Polls, Poll, User, Option, NewpollTemplate, EventBus, app, PollsView) {
    var NewPollView = Backbone.View.extend({
        tagname: 'div',
        className: 'pollContainer',
        template: _.template(NewpollTemplate),
        events: {
            // 'change': 'change'
            'click #submit': 'addPoll',
            'click #add-option': 'addOption',
            'keyup input': 'validate',

        },
        initialize: function() {
             EventBus.on('savePoll', this.savePoll, this);
            //   this.render();
        },

        render: function() {
            //this.el is what we defined in tagName
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        
         addOption:function(){
            var field = '<div class="form-group"><input class="form-control options" type="text" /></div>';
            $('#addPoll').append(field);
        },
        validate: function(){
            var nameLength = $("#name").val();
            var option1Length = $("#option1").val();
            var option2Length = $("#option2").val();
            if (nameLength && option1Length && option2Length){
                $('button#submit').prop('disabled', false);
            } else {
                $('button#submit').prop('disabled', true);
            }
        },
        addPoll: function(e) {
            e.preventDefault();
            var self = this;
            var formData = {};
            formData.name = $('#addPoll #name').val();
            formData.options = [];


            $('#addPoll .options').each(function(index, opt) {
                var val = $(opt).val();
                if(val){
                formData.options.push({
                    'text': val,
                    'votes': 0
                });
                }
            });

            //If a user is signed in, add the poll to the user's profile
            //If the user is no longer signed in, save the poll in local storage and redirect to log in screen
          
                self.savePoll(formData, app.getUser().id);
            
        },
        saveLocally:function(formData){
           EventBus.trigger("app:recordPoll", formData);
        },
        savePoll:function(formData, userId){
            var self = this;
             $.ajax({
                        url: '/api/users/' + userId + '/polls',
                        type: 'POST',
                        dataType: "json",
                        data: formData
                    })
                    .done(function(poll) {
                        self.showLink(poll.slug);
                        //clear poll from local storage
                        app.deleteLocalPoll();
                    })
                    .fail(function(err) {
                       self.saveLocally(formData);
                         self.showPollNotSaved();
                         
                    });
        },
        showLink: function(slug){
             EventBus.trigger('router:navigate', {
                        route: 'polls/add',
                        options: {
                            trigger: true
                        }
                    });
          
             this.render();
             $('#add-poll-form').hide();
             var link = 'https://try4-autumncat.c9users.io/polls/'+slug;
             $("#poll-link").attr("href", link);
             $('.twitter-share-button').attr('data-url',link)
             $('#poll-link').text(link);
             $('.poll-saved').show();
        },
        showPollNotSaved:function(){
            $('#add-poll-form').hide();
            $('.poll-not-saved').show();
        }
    });
    return NewPollView;
});