cc.Class({
    extends: cc.Component,

    properties: {
        loadingAnim: cc.Animation, // loading Node
        btPlay: cc.Node,
        noHelpFace: cc.Node,
        phoneImg: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
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

    // 播放 Loading 界面并跳转场景
    changeScene: function () {
        this.loadingAnim.play();
        this.scheduleOnce(function () {
            cc.director.loadScene("game");
        }, 1);
    },

    // 显示帮助界面
    showHelp: function () {
        this.phoneImg.rotation = 0;
        if (this.noHelpFace.active === false) {
            this.noHelpFace.active = true;
        } else if (this.noHelpFace.active === true) {
            this.noHelpFace.active = false;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
