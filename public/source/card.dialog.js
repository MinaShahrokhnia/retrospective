var CardDialogView = Marionette.View.extend({
    template: _.template(`
        <div id='card-dialog'>
            <form>
                <div class="form-row">
                    <div class="form-group">
                        <textarea class="form-control" id="card-body" placeholder="Please enter your topic" rows="5"></textarea>
                    </div>
                </div>    
                <div class="form-row">    
                    <div class="form-group">
                        <input type="text" id="card-tags" class="form-control" placeholder="Please select a tag for your topic"/>
                    </div>
                </div>    
            </form>
        </div>  
    `)
});

var CardDialog = {
    init: function( channelName, tags ) {
        var self = this;
        var cardDialogView = new CardDialogView();
        var cardDialog = cardDialogView.render().$el;
        this.dialog = cardDialog.dialog({
            autoOpen: false,
            title: 'Add new topic',
            height: 350,
            width: 500,
            modal: true,
            open: function() {
                cardDialog.find('#card-tags').tokenfield({
                    autocomplete: {
                      source: tags,
                      delay: 100
                    },
                    limit: 1,
                    showAutocompleteOnFocus: true
                });
            },
            buttons: {
                Add: function() {
                    var selectedTag = cardDialog.find('#card-tags').tokenfield('getTokens')[0];
                    Backbone.Radio.trigger(channelName, 'add:card', {
                        title: cardDialog.find('#card-body').val(),
                        tag: selectedTag.label,
                        color: selectedTag.value,
                        collectionName: channelName
                    });
                    self.dialog.dialog('close');
                },
                Cancel: function() {
                    self.dialog.dialog('close');
                }
            },
            create: function() {
                $(this).closest(".ui-dialog")
                    .find(".ui-dialog-buttonset")
                    .find('button:first') // the first button
                    .addClass("btn btn-success");
                $(this).closest(".ui-dialog")
                    .find(".ui-dialog-buttonset")
                    .find('button')
                    .eq(1)
                    .addClass("btn btn-danger");
            }
        });
    },
    open: function() {
        this.dialog.dialog('open');
    }    
}