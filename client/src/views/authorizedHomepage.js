define(['jquery',
    'underscore',
    'text!src/templates/authorizedHomepage.html',
    'backbone'

], function($, _, AuthorizedHomepageTemplate, Backbone) {
    var AuthorizedHomepageView = Backbone.View.extend({

        el: '#content',
        template: _.template(AuthorizedHomepageTemplate),
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });

    return AuthorizedHomepageView;
});
