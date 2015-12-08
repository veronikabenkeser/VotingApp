define(["backbone", "src/models/user"], function(Backbone, User) {
    var Users = Backbone.Collection.extend({
        model: User,
        url: '/api/users' //links to the url where the models can be fetched

    });
    return Users;
});
