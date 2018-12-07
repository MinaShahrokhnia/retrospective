var TopbarView = Marionette.View.extend({
    template: _.template(`
        <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="#">
                Retrospective App - 
                <span id="username" style="font-size: 80%"><%= username %></span>
                -
                <button id="export-to-csv" class="btn btn-success">export to csv</button>
            </a>
            <ul id="countdown-timer" class="nav nav-pills"></ul>
        </nav>
    `),
    regions: {
        countdownTimer: "#countdown-timer"
    },
    onAttach: function(){
        this.showChildView('countdownTimer', new CountdownTimerView({
            initialTime: $('#countdown-value')
        })); 

        $('#export-to-csv').click(function() {
            socket.emit('export:csv');
        });
    }
});
