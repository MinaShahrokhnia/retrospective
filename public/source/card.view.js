var CardView = Marionette.View.extend({
    template: _.template(`
        <div class="card">
            <div class="card-body">
                <div class="text-right"><i class="fa fa-bookmark fa-2x" style="color: <%= color %>"  aria-hidden="true"></i></div>
                <span><%= username %></span>
                <hr/>
                <h4 class="card-title"><%= title %></h4>
                <hr/>
                <p>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm">
                                <span style="background-color:<%= color %>" class="badge badge-success"><%= tag %></span>
                            </div>
                            <div class="col-sm">
                                <div class="text-right buttons">
                                    <a class="vote-button"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></a><b> <%= vote %></b>
                                    <a class="delete-button"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </p>
            </div>
        </div>
    `),
    tagName: 'li',
    onAttach: function() {
        var self = this;
        self.$el.find('.delete-button').on('click', function() {
            socket.emit("remove:card", {
                card: {
                    id: self.model.get('id'),
                    collectionName: self.model.get('collectionName')
                }
            });
        });

        self.$el.find('.vote-button').on('click', function() {
            Backbone.Radio.trigger(self.model.get('collectionName'), 'test:event', {
                id: self.model.get('id'),
                collectionName: self.model.get('collectionName')
            });
        });
    }
});