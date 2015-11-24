// Entry point to the app. Configuring how RequireJS loads the rest of the app 
require.config({
    // baseUrl:"src",
    paths:{
        'jquery':'libs/jquery/dist/jquery',
        'underscore':'libs/underscore/underscore',
        'backbone':'libs/backbone/backbone',
        'text': 'libs/text/text'
        
    },
    shim:{
        'underscore': {
            exports: '_' //This line tells RequireJS that the script in 'lib/underscore.js' creates a global variable called _ instead of defining a module. 
        }
    }
});

require(['jquery','underscore','backbone','src/views/polls'],function($,_,Backbone,PollsView){
    $(function(){
        new PollsView();
    });
});