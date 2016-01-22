define([
    'jquery',
    'src/models/user',
    'globals',
    'eventBus'
], function($, User, globals, EventBus) {
    var user;

    function savePollInLocalStorage(poll) {
        window.localStorage.setItem(globals.extraInfo.unsavedPoll, JSON.stringify(poll));
    }

    function authenticated(response) { //response from server at api/authenticate
        window.localStorage.setItem(globals.auth.TOKEN_KEY, response.token);
        window.localStorage.setItem(globals.auth.USER_KEY, response._id);
        initializeUser();
    }

    function goHome() {
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
                EventBus.trigger('header:updateUserInfo');
                d.resolve();
            });

        }
        else if (isAuthenticated() && user) {
            user.fetch().done(function() {
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

    function getUnsavedPoll() {
        var objStr = JSON.parse(window.localStorage.getItem(globals.extraInfo.unsavedPoll));
        return objStr;
    }

    function logOut() {
        window.localStorage.removeItem(globals.auth.TOKEN_KEY);
        window.localStorage.removeItem(globals.auth.USER_KEY);
        user = null;
    }

    function deleteLocalPoll() {
        window.localStorage.removeItem(globals.extraInfo.unsavedPoll);
    }

    EventBus.on("app:authenticated", authenticated, this);
    EventBus.on("app:logout", logOut);
    EventBus.on("app:recordPoll", savePollInLocalStorage, this);
    EventBus.on("app:goHome", goHome);

    return {
        isAuthenticated: isAuthenticated,
        initializeUser: initializeUser,
        getUser: getUser,
        logOut: logOut,
        getUnsavedPoll: getUnsavedPoll,
        deleteLocalPoll: deleteLocalPoll
    };

});