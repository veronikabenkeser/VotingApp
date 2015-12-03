// Entry point to the app. Configuring how RequireJS loads the rest of the app 
require.config({
    // baseUrl:"client",
    paths:{
        'jquery':'libs/jquery/dist/jquery',
        'underscore':'libs/underscore/underscore',
        'backbone':'libs/backbone/backbone',
        'text': 'libs/text/text'
        // 'backbone-validation':'libs/backbone.validation/dist/backbone-validation'
        // 'bootstrap': "libs/bootstrap/dist/css/bootstrap.min"
        
    },
    shim:{
        'underscore': {
            exports: '_' //This line tells RequireJS that the script in 'lib/underscore.js' creates a global variable called _ instead of defining a module. 
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

require(['jquery','underscore','backbone','router'],function($,_,Backbone,AppRouter){
    $(function(){
      myRouter = new AppRouter();
      Backbone.history.start({pushState:true});
   
    });
});
