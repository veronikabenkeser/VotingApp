define([
    'jquery',
    'src/models/user',
    'globals',
    'eventBus'

], function($, User, globals, EventBus) {
    var user;

    function authenticated(response) {
        window.localStorage.setItem(globals.auth.TOKEN_KEY, response.token);
        window.localStorage.setItem(globals.auth.USER_KEY, response._id);
        initializeUser();
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
        if (isAuthenticated() && !user) {
            user = new User({
                _id: window.localStorage.getItem(globals.auth.USER_KEY)
            });
            user.fetch().done(function() {
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
    return {
        isAuthenticated: isAuthenticated,
        initializeUser: initializeUser,
        getUser: getUser,
        logOut: logOut
    };

});