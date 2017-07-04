cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node,
        apple: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.monkey.x = cc.random0To1() * 610 - 180;
        this.monkey.y = 450;
        this.apple.x = this.monkey.x + 20;
        this.apple.y = this.monkey.y - 80;
        this.monkeyAction();
        this.appleAction();
    },

    monkeyAction: function () {
        var down = cc.moveBy(2, cc.p(0, -180));
        var wait = cc.moveBy(0.8, cc.p(0, 0));
        var up = cc.moveBy(1.25, cc.p(0, 200));
        var action = cc.sequence(down, wait, up);
        this.monkey.runAction(action);
        var monkeyAnim = this.monkey.getComponent(cc.Animation);
        monkeyAnim.play("monkey");
    },

    appleAction: function () {
        var down = cc.moveBy(2, cc.p(0, -180));
        var wait = cc.moveBy(0.8, cc.p(0, 0));
        var down2 = cc.moveBy(2.25, cc.p(0, -600));
        var action = cc.sequence(down, wait, down2);
        this.apple.runAction(action);
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
