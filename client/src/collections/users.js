define(["backbone", "src/models/user"], function(Backbone, User) {
    var Users = Backbone.Collection.extend({
        model: User,
        url: '/api/users' 
    });
    return Users;
});
