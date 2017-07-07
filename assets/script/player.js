cc.Class({
    extends: cc.Component,

    properties: {
        player: cc.Node,  // 角色节点
        speed: 250,  // 初始速度
        _time: 0,  // 随时间增加的速度值
        _rangeX: 0,  // 边界坐标
        _acc: cc.p(0, 0),  // 设备重力感应数据
    },

    // use this for initialization
    onLoad: function () {
        cc.inputManager.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
        var screenSize = cc.view.getVisibleSize();
        this._rangeX = screenSize.width / 2 + this.player.x / 3;

        this.playerAnim = this.player.getComponent(cc.Animation);
        this.lastAnimName = null;

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.redAppleCount = 0;
        this.yellowAppleCount = 0;
        this.greenAppleCount = 0;

        this.playAnimByName("right0");
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
        var player = this.player, range = this._rangeX;
        this._time += 1;
        this.playerMove = this._acc.x * dt * (this.speed + this._time);
        player.x += this.playerMove;
        if (this.playerMove >= 0) {
            this.player.scaleX = 1;
        } else if (this.playerMove < 0) {
            this.player.scaleX = -1;
        }
        player.x = cc.clampf(player.x, -range, range);
        if (player.x <= -range || player.x >= range) {
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
            if (other.node.name == "redApple") {
                this.redAppleCount += 1;
            }
            if (other.node.name == "yellowApple") {
                this.yellowAppleCount += 1;
            }
            if (other.node.name == "greenApple") {
                this.greenAppleCount += 1;
            }
            other.node.destroy();
    },

});
