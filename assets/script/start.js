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
        var action = cc.rotateBy(1, 20).easing(cc.easeCubicActionIn(30));
        var action1 = cc.rotateBy(1, -20).easing(cc.easeCubicActionOut(30));
        var action2 = cc.sequence(action, action1);
        this.btPlay.runAction(cc.repeatForever(action2));
    },

    // 更改场景
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
            var action = cc.rotateBy(2, -30).easing(cc.easeCubicActionIn(30));
            var action2 = cc.rotateBy(2, 30).easing(cc.easeCubicActionOut(30));
            var action3 = cc.repeatForever(cc.sequence(action, action2));
            this.phoneImg.runAction(action3);
        } else if (this.noHelpFace.active === true) {
            this.phoneImg.stopAction(action3);
            this.noHelpFace.active = false;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
