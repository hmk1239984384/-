var level = require("leveldata");
cc.Class({
    extends: cc.Component,

    properties: {
        player: cc.Node,  // 角色节点
        speed: 250,  // 初始速度
        _time: 0,  // 随时间增加的速度值
        _rangeX: 0,  // 边界坐标
        _acc: cc.p(0, 0),  // 设备重力感应数据
        nodeContinueInterface: cc.Node,  // 继续界面节点组
        pauseButton: cc.Node,
        gainScore: cc.Node,   // 苹果记分板
        getAppleAudio: cc.AudioClip,  // 获得苹果时音效
        nodeShadow: cc.Node,  // 阴影节点
    },

    // use this for initialization
    onLoad: function () {
        // 开启重力感应
        cc.inputManager.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
        var screenSize = cc.view.getVisibleSize();
        this._rangeX = screenSize.width / 2 + this.player.x / 3;
        // 获取角色动画组件
        this.playerAnim = this.player.getComponent(cc.Animation);
        this.lastAnimName = null; // 初始化上一个播放的动画名字
        // 开启碰撞监听
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // 初始化得分
        this.redAppleCount = 0;
        this.yellowAppleCount = 0;
        this.greenAppleCount = 0;
        this.peachCount = 0;
        this.pearCount = 0;
        this.playAnimByName("right0"); // 播放动画
        this.levelNum = window.levelNum || 1; // 获取关卡数
        // 获取关卡中各种苹果需要的数量
        this.redAppleMaxNum = level[this.levelNum - 1].redAppleMaxNum;
        this.yellowAppleMaxNum = level[this.levelNum - 1].yellowAppleMaxNum;
        this.greenAppleMaxNum = level[this.levelNum - 1].greenAppleMaxNum;
        this.peachMaxNum = level[this.levelNum - 1].peachMaxNum;
        this.pearMaxNum = level[this.levelNum - 1].pearMaxNum;
        // 获取每种苹果的节点组
        this.scoreChildren = this.gainScore.children;
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
        this._time += 2;
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

    // 碰撞时
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
        if (other.node.name == "peach") {
            this.peachCount += 1;
        }
        if (other.node.name == "pear") {
            this.pearCount += 1;
        }

        other.node.destroy();
        if (window.isMuted === false) {
            cc.audioEngine.play(this.getAppleAudio, false, 0.8);
        }
        this.recordScore();
        this.passBarrier();
    },

    // 记录分数
    recordScore: function () {
        // 苹果变亮
        for (var j = 0; j < this.redAppleCount && j < this.redAppleMaxNum; j++) {
            this.scoreChildren[j].opacity = 255;
        }
        for (var k = this.redAppleMaxNum; k < this.redAppleMaxNum + this.yellowAppleCount && k < this.redAppleMaxNum + this.yellowAppleMaxNum; k++) {
            this.scoreChildren[k].opacity = 255;
        }
        for (var l = this.redAppleMaxNum + this.yellowAppleMaxNum; l < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleCount && l < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum; l++) {
            this.scoreChildren[l].opacity = 255;
        }
        for (var m = this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum; m < this.peachCount + this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum && m < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum; m++) {
            this.scoreChildren[m].opacity = 255;
        }
        for (var n = this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum; n < this.pearCount + this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum && n < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum + this.pearMaxNum; n++) {
            this.scoreChildren[n].opacity = 255;
        }
    },

    passBarrier: function () {
        // 过关判定
        if (this.redAppleCount >= this.redAppleMaxNum && this.yellowAppleCount >= this.yellowAppleMaxNum && this.greenAppleCount >= this.greenAppleMaxNum && this.peachCount >= this.peachMaxNum && this.pearCount >= this.pearMaxNum && this.levelNum <= level.length) {
            this.levelNum += 1;
            window.levelNum = this.levelNum;
            // 显示过关界面
            this.nodeShadow.active = true;
            this.nodeContinueInterface.active = true;
            this.pauseButton.active = false;
            this.pauseGame();
        }
    },

    // 暂停或恢复游戏
    pauseGame: function () {
        if (cc.director.isPaused()) {
            this.pauseButton.active = true;
            cc.director.resume();
        } else {
            cc.director.pause();
        }
    },
});
