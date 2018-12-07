var StopView = Marionette.View.extend({
    template: _.template(`
        <h4>
            <a href="#" class="add-card"><i class="fa fa-plus-square-o" aria-hidden="true"></i></a>
            <span>&nbsp;</span>
            <span>Stop</span>
            </h4>
        <hr/>
        <ul id="cards"></ul>
    `),
    regions: {
       cards: '#cards'
    },
    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    onAttach: function() {
        var self = this;
        this.showChildView('cards', new StopCollectionView());
        socket.on('update:tags', function( tags ) {
            self.options.tags = tags;
        });
        this.$el.find('.add-card').on('click', function() {
            event.preventDefault();
            CardDialog.init('StopChannel', self.options.tags);
            CardDialog.open();
        });
        socket.on('update:StopChannel', function( cards ) {
            stopCollection.reset();
            stopCollection.set(cards);
        });
        Backbone.Radio.on('StopChannel', 'test:event', function( card ) {
            socket.emit("update:vote", {
                card: {
                    id: card.id,
                    userId: self.options.user.get('id'),
                    collectionName: card.collectionName
                }
            });
        });
        Backbone.Radio.on('StopChannel', 'add:card', function( card ) {
            socket.emit("add:card", {
                card: {
                    id: self.guid(),
                    username: self.options.user.get('username'),
                    userId: self.options.user.get('id'),
                    title: card.title,
                    tag: card.tag,
                    color: card.color,
                    vote: 0,
                    voters: [],
                    collectionName: card.collectionName
                }
            });
        });
    }
});
        
var StopCollection = Backbone.Collection.extend({});
var stopCollection = new StopCollection();
var StopCollectionView = Marionette.CollectionView.extend({
    childView: CardView,
    collection: stopCollection
});