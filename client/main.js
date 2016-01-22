require.config({
    paths: {
        'jquery': 'libs/jquery/dist/jquery',
        'bootstrap-js': 'libs/bootstrap/dist/js/bootstrap',
        'underscore': 'libs/underscore/underscore',
        'backbone': 'libs/backbone/backbone',
        'text': 'libs/text/text',
        'chart-js': 'libs/Chart.js/Chart.min',
        'backbone-relational': 'libs/backbone-relational/backbone-relational'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone-relational': {
            deps: ['underscore', 'backbone'],
            exports: 'backbone-relational'
        },
        'bootstrap-js': {
            deps: ['jquery'],
            exports: 'bootstrap_js'
        },
        'chart-js': {
            exports: 'Chart'
        }
    }
});

require(['jquery', 'bootstrap-js', 'underscore', 'backbone', 'router', 'eventBus', 'globals', 'app', 'chart-js'], function($, bootstrap_js, _, Backbone, AppRouter, EventBus, globals, app, Chart) {
    $(function() {

        //To prevent memory leaks when views are changed/closed
        _.extend(Backbone.View.prototype, {
            close: function() {
                if (this.beforeClose) {
                    //Perform any cleanup specific to this view.
                    this.beforeClose();
                }

                if (this.model) {
                    //Remove all callbacks for this view's model.
                    this.model.off(null, null, this);
                    this.model = null;
                }

                if (this.collection && this.collection.off) {
                    //Remove all callback for this view's collection.
                    this.collection.off(null, null, this);
                    this.collection = null;
                }

                //Remove all delegated events
                this.undelegateEvents();
                //Turn off view's events
                this.off(null, null, this);
                //Remove all markup.
                this.$el.empty();
            }
        });

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

                403: function(context) {
                    EventBus.trigger("app:logout");
                    EventBus.trigger('router:navigate', {
                        route: 'login',
                        options: {
                            trigger: true
                        }
                    });
                }
            },

            beforeSend: function(xhr) {
                var token = window.localStorage.getItem(globals.auth.TOKEN_KEY);
                xhr.setRequestHeader('x-access-token', token);
            }
        });

        var router = new AppRouter();
    });
});
