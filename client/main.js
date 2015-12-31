// Entry point to the app. Configuring how RequireJS loads the rest of the app 
require.config({
    // baseUrl:"client",
    paths: {
        'jquery': 'libs/jquery/dist/jquery',
        'bootstrap-js':'libs/bootstrap/dist/js/bootstrap',
        'underscore': 'libs/underscore/underscore',
        'backbone': 'libs/backbone/backbone',
        'text': 'libs/text/text',
        // 'chart-js': 'libs/Chart.js/Chart',
        'chart-js': 'libs/Chart.js/Chart.min',
        'backbone-relational':'libs/backbone-relational/backbone-relational'
            // 'backbone-validation':'libs/backbone.validation/dist/backbone-validation'
            // 'bootstrap': "libs/bootstrap/dist/css/bootstrap.min"

    },
    shim: {
        'underscore': {
            exports: '_' //This line tells RequireJS that the script in 'lib/underscore.js' creates a global variable called _ instead of defining a module. 
        },
        'backbone-relational':{
            deps: ['underscore','backbone'],
            exports: 'backbone-relational'
        },
        'bootstrap-js':{
            deps: ['jquery'],
            exports:'bootstrap_js'
        },
        'chart-js':{
            exports: 'Chart'
        }
        
        
        // backbone: {
        //     //These script dependencies should be loaded before loading backbone.js
        //     deps: ['underscore', 'jquery'],
        //     //Once loaded, use the global 'Backbone' as the module value.
        //     exports: 'Backbone'
        // },
        // 'bootstrap': {"deps":['jquery']}
        // 'backbone-validation':{"deps":['backbone']}
        // 'backbone':{
        //     "deps": [ "underscore", "jquery" ],
        //      "exports": "Backbone"
        // },
        // 'backbone.validateAll': {
        //     "deps": ["backbone"]
        // }

    }
    // map:{
    //     '*': {
    //         'backbone':'backbone.validateAll'
    //     }
    // }
});

// require(['jquery','underscore','backbone','src/views/polls'],function($,_,Backbone,PollsView){
//     $(function(){
//         new PollsView();

//     });
// });

require(['jquery','bootstrap-js', 'underscore', 'backbone', 'router', 'eventBus', 'globals', 'app', 'chart-js'], function($, bootstrap_js, _, Backbone, AppRouter, EventBus, globals, app, Chart) {
    $(function() {


        //To prevent memory leaks when views are changed/closed
        _.extend(Backbone.View.prototype, {
            //Handle cleanup of view
            close: function() {
                if (this.beforeClose) {
                    //Perform any cleanup specific to this view.
                    this.beforeClose();
                }

                if (this.model) { //if the view has a model associated with it
                    //Remove all callbacks for this view's model.
                    this.model.off(null, null, this);
                    this.model = null;
                }

                //if the view has a collection associated with it and the 
                //collection has an off method
                if (this.collection && this.collection.off) {
                    //Remove all callback for this view's collection.
                    this.collection.off(null, null, this);
                    this.collection = null;
                }

                //Remove all delegated events
                this.undelegateEvents();
                this.off(null, null, this); //turn off view's events

                //Remove all markup.
                this.$el.empty();
            }
        });
        //Global change to ajax handling
        //Any ajax call that gest a 401 error will get trapped and
        // the user will be taken to the login page
        $.ajaxSetup({
            statusCode: {
                401: function(context) {
                    EventBus.trigger('router:navigate', {
                        route: 'login',
                        options: {
                            trigger: true
                        }
                    });

                },
                //when token has expired
                403: function(context){
                    EventBus.trigger("app:logout");
                    EventBus.trigger('router:navigate', {
                        route: 'login',
                        options:{
                            trigger:true
                        }
                    });
                }
            },
            //if the user got a token,
            //include the token in the header of all 
            //of the AJAX calls.
            //before ajax req is sent to api links
            beforeSend: function(xhr) {
                var token = window.localStorage.getItem(globals.auth.TOKEN_KEY);
                xhr.setRequestHeader('x-access-token', token);
            }
        });

        var router = new AppRouter();
        // Backbone.history.start({
        //     pushState: true
        // });
    });
});
