cc.Class({
    extends: cc.Component,

    properties: {
        player: cc.Node,
        speed: 250,
        _time: 0,
        _range: cc.p(0, 0),
        _acc: cc.p(0, 0)
    },

    // use this for initialization
    onLoad: function () {
        cc.inputManager.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);

        var screenSize = cc.view.getVisibleSize();
        this._range.x = screenSize.width / 2 - this.player.width / 2;
        this._range.y = screenSize.height / 2 - this.player.height / 2;
    },

    onDestroy: function () {
        cc.inputManager.setAccelerometerEnabled(false);
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
    },

    onDeviceMotionEvent: function (event) {
        this._acc.x = event.acc.x;
        this._acc.y = event.acc.y;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var player = this.player, range = this._range;
        this._time += 5;
        var playerMove = this._acc.x * dt * (this.speed + this._time);
        player.x += playerMove;
        player.x = cc.clampf(player.x, -range.x, range.x);
        if (player.x <= -range.x || player.x >= range.x) {
            this._time = 0;
        }
    },
});
