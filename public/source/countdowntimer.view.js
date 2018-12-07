var CountdownTimerView = Marionette.View.extend({

    template: _.template(`
        <li class="nav-item">
            <input id="countdown-value" class="form-control mr-sm-2" type="text"
            style="width: 80px; text-align: center; font-weight: bold;" maxlength="3">
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" id='start-timer'>
                <i class="fa fa-play" aria-hidden="true"></i>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" id='pause-timer'>
                <i class="fa fa-pause" aria-hidden="true"></i>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" id='stop-timer'>
                <i class="fa fa-stop" aria-hidden="true"></i>
            </a>
        </li>
    `),

    initialize: function (options) {
        _.bindAll(this, "checkTime");
        _.bindAll(this, "updateTime");
    },

    onRender: function() {
        this.$el = this.$el.children();
        this.$el.unwrap();
        this.setElement(this.$el);
    },

    onAttach: function () {

        socket.on('disable:timer', function() {
            $('#countdown-value').prop('disabled', true);
        });

        socket.on('enable:timer', function() {
            $('#countdown-value').prop('disabled', false);
        });

        var self = this;
        this.$resultsDiv = $('#countdown');
        $('#start-timer').on('click', function () {
            var time = self.currentTime / 60 || ($('#countdown-value').val() == "" ? 1 : $('#countdown-value').val());
            self.initialTime = time;
            if ( $('#countdown-value').val() != '' ) {
                // $('#countdown-value').prop('disabled', true);
                socket.emit('disable:timer');
            }
            self.updateTimer();
            
        });
        $('#stop-timer').on('click', function () {
            clearInterval(self.intervalId);
            $('#countdown-value').val('');
            $('#countdown').empty();
            // $('#countdown-value').prop('disabled', false);
            socket.emit('enable:timer');
            self.currentTime = 0;
        });
        $('#pause-timer').on('click', function () {
            clearInterval(self.intervalId);
            self.initialTime = self.currentTime / 60;
        });

        socket.on('update:timer', this.updateTime);
    },

    toMMSS: function (sec) {
        var seconds = parseInt(sec, 10);
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var seconds = seconds - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return minutes + ':' + seconds;
    },

    updateTimer: function () {
        this.currentTime = this.initialTime * 60;
        this.checkTime();
        this.intervalId = setInterval(this.checkTime, 1000);
    },

    updateTime: function( time ) {
        console.log(time);
        $('#countdown-value').val(this.toMMSS(time));
        if (time == 0) {
            clearInterval(this.intervalId);
            $('body').attr("class", "done");
        }

        this.currentTime = time;
        this.$resultsDiv.text(this.toMMSS(time));
        $('body').attr("class", "doing");
    },

    checkTime: function () {
        this.currentTime = --this.currentTime;
        socket.emit('change:timer', { value: this.currentTime });
    }

});