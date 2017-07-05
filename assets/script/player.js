cc.Class({
    extends: cc.Component,

    properties: {
        player: cc.Node,
        speed: 250,
        _time: 0,
        _range: cc.p(0, 0),
        _acc: cc.p(0, 0),
    },

    // use this for initialization
    onLoad: function () {
        cc.inputManager.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
        var screenSize = cc.view.getVisibleSize();
        this._range.x = screenSize.width / 2 - this.player.width / 2;
        this._range.y = screenSize.height / 2 - this.player.height / 2;

        this.playerAnim = this.player.getComponent(cc.Animation);
        this.lastAnimName = null;

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    onDestroy: function () {
        cc.inputManager.setAccelerometerEnabled(false);
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
        this.playerAnim.stop();
    },

    onDeviceMotionEvent: function (event) {
        this._acc.x = event.acc.x;
        this._acc.y = event.acc.y;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var player = this.player, range = this._range;
        this._time += 1;
        this.playerMove = this._acc.x * dt * (this.speed + this._time);
        player.x += this.playerMove;
        if (this.playerMove > 0) {
            this.playAnimByName("right0");
        } else if (this.playerMove <= 0) {
            this.playAnimByName("left0");
        }
        player.x = cc.clampf(player.x, -range.x, range.x);
        if (player.x <= -range.x || player.x >= range.x) {
            this._time = 0;
        }
    },

    playAnimByName: function (name) {
        // 通过判断是否需要更改动画
        if (this.lastAnimName != name) {
            this.playerAnim.stop();
            this.playerAnim.play(name);
            this.lastAnimName = name;
        }
    },

    onCollisionEnter: function (other, self) {
        // tag 1 为向右的碰撞 tag 2 为向左的碰撞
        if (this.playerMove > 0 && self.tag == 1) {
            console.log(other.node.name);
        } else if (this.playerMove <= 0 && self.tag == 2) {
            console.log(other.node.name);
        }
    }
});
