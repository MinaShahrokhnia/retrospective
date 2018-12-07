var ApplicationView = Marionette.View.extend({
    template: _.template(`
    <div class="container-fluid">
        <div id="topbar"></div>
        <div id="continue"></div>
        <div id="stop"></div>
        <div id="start"></div>
    </div>
    `),
    regions:{
        topbar: '#topbar',
        continue: '#continue',
        stop: '#stop',
        start: '#start' 
    },
    onAttach: function(){
        this.showChildView('topbar', new TopbarView({
            model: this.options.user
        }));
        this.showChildView('continue', new ContinueView({
            user: this.options.user,
            tags: this.options.tags,
        }));
        this.showChildView('stop', new StopView({
            user: this.options.user,
            tags: this.options.tags
        }));
        this.showChildView('start', new StartView({
                user: this.options.user,
                tags: this.options.tags
        }));
    }
});