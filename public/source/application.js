var Application = Marionette.Application.extend({
    region: '#retro-app',
    initialize: function() {
        socket.on('export:csv', function( cards ) {
            console.log(cards);

            JSONToCSVConvertor(cards, "Retro", true);
        });
    },
    onStart: function() {
        this.showView(new ApplicationView({
            user: this.options.user,
            tags: this.options.tags,
        }));
    }
});

