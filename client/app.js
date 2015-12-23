define([
    'jquery',
    'src/models/user',
    'globals',
    'eventBus'

], function($, User, globals, EventBus) {
    var user;

    function savePollInLocalStorage(poll){
        console.log('LOCAL POLl');
        window.localStorage.setItem(globals.extraInfo.unsavedPoll,JSON.stringify(poll));
    }
    
    function authenticated(response) { //response from server at api/authenticate
        window.localStorage.setItem(globals.auth.TOKEN_KEY, response.token);
        window.localStorage.setItem(globals.auth.USER_KEY, response._id);
        initializeUser();
        // EventBus.trigger('router:navigate', {
        //     route: 'home',
        //     options: {
        //         trigger: true
        //     }
        // });
    }
    
    function goHome(){
         EventBus.trigger('router:navigate', {
            route: 'home',
            options: {
                trigger: true
            }
        });
    }

    function isAuthenticated() {
        return window.localStorage.getItem(globals.auth.TOKEN_KEY);
    }

    function initializeUser() {
        var d = $.Deferred();
        console.log("user here");
        console.log(user);
        if (isAuthenticated() && !user) {
            user = new User({
                _id: window.localStorage.getItem(globals.auth.USER_KEY)
            });
            user.fetch().done(function() { //populates all the properties on the user, including, name, email, polls, etc
                EventBus.trigger('home:updateUserInfo');
                d.resolve();
            });
        }
        else {
            d.resolve();
        }
        return d.promise();
    }

    function getUser() {
        return user || new User();
    }
    
    function getUnsavedPoll(){
        console.log("unsaved poll that is getting returned in app.js : ");
        var objStr = JSON.parse(window.localStorage.getItem(globals.extraInfo.unsavedPoll));
       console.log(objStr);
        
        // return JSON.parse(window.localStorage.getItem(globals.extraInfo.unsavedPoll));
        return objStr;
    }

    function logOut() {
        window.localStorage.removeItem(globals.auth.TOKEN_KEY);
        window.localStorage.removeItem(globals.auth.USER_KEY);
        user = null;
        EventBus.trigger('home:updateUserInfo');
        EventBus.trigger('router:navigate', {
            route: 'home',
            options: {
                trigger: true
            }
        });
    }

    EventBus.on("app:authenticated", authenticated, this);
    EventBus.on("app:logout", logOut);
    EventBus.on("app:recordPoll", savePollInLocalStorage,this);
    EventBus.on("app:goHome",goHome);
    return {
        isAuthenticated: isAuthenticated,
        initializeUser: initializeUser,
        getUser: getUser,
        logOut: logOut,
        getUnsavedPoll: getUnsavedPoll
    };

});