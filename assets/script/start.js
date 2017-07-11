cc.Class({
    extends: cc.Component,

    properties: {
        loadingAnim: cc.Animation, // loading Node
        btPlay: cc.Node,
        noHelpFace: cc.Node,
        phoneImg: cc.Node,
        buttonClickAudio: cc.AudioClip,
        muteImg: [cc.SpriteFrame],  // 静音按钮图片, 0 为静音图标
        nodeAudioButton: cc.Node,  // 控制静音按钮
        startBgm: cc.AudioClip,  // 开始界面背景音乐
    },

    // use this for initialization
    onLoad: function () {
        this.audioSprite = this.nodeAudioButton.getComponent(cc.Sprite); // 获取声音按钮 Sprite 组件
        if (window.isMuted == undefined) {
            window.isMuted = false;
            this.audioSprite.spriteFrame = this.muteImg[1];
        }
        if (window.isMuted === false) {
            this.audioSprite.spriteFrame = this.muteImg[1];
            cc.audioEngine.stopAll(); // 防止音乐重叠
            cc.audioEngine.play(this.startBgm, true, 1);
        } else if (window.isMuted === true) {
            this.audioSprite.spriteFrame = this.muteImg[0];
        }
        // 开始游戏按钮动画
        var action = cc.rotateBy(1, 20).easing(cc.easeCubicActionIn(30));
        var action1 = cc.rotateBy(1, -20).easing(cc.easeCubicActionOut(30));
        var action2 = cc.sequence(action, action1);
        this.btPlay.runAction(cc.repeatForever(action2));
        // 帮助动画
        var action3 = cc.rotateBy(2, -30).easing(cc.easeCubicActionIn(30));
        var action4 = cc.rotateBy(2, 30).easing(cc.easeCubicActionIn(30));
        var action5 = cc.repeatForever(cc.sequence(action3, action4));
        this.phoneImg.runAction(action5);
    },

    // 获取按钮数据
    buttonClick: function (event, customEventData) {
        this.btEventData = customEventData; // 将点击的按钮数据存储
        this.showHelp();
    },

    // 播放 Loading 界面并跳转场景
    changeScene: function () {
        if (window.isMuted == undefined) {
            window.isMuted = false;
        }
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.loadingAnim.play();
        this.scheduleOnce(function () {
            cc.director.loadScene("game");
        }, 1);
    },

    // 显示帮助界面
    showHelp: function () {
        if (window.isMuted == undefined) {
            window.isMuted = false;
        }
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.phoneImg.rotation = 0;
        if (this.noHelpFace.active === false) {
            this.noHelpFace.active = true;
        } else if (this.noHelpFace.active === true) {
            if (this.btEventData == "help") {
                this.noHelpFace.active = false;
            } else if (this.btEventData == "play") {
                this.noHelpFace.active = false;
                this.changeScene();
            }
        }
    },

    // 点击静音按钮
    muteButtonClick: function () {
        if (window.isMuted === false) {
            window.isMuted = true;
            cc.audioEngine.stopAll();
            this.audioSprite.spriteFrame = this.muteImg[0];
        } else {
            window.isMuted = false;
            cc.audioEngine.play(this.startBgm, true, 1);
            this.audioSprite.spriteFrame = this.muteImg[1];
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
