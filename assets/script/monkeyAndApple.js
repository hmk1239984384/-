cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node,
        apple: cc.Node,
        monkeyImg: [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
        this.monkey.x = cc.random0To1() * 610 - 180;
        this.monkey.y = 450;
        this.monkeySprite = this.monkey.getComponent(cc.Sprite);
        this.apple.x = this.monkey.x + 20;
        this.apple.y = this.monkey.y - 80;
        this.dropApple();
   
    },

    monkeyAction: function () {
        this.monkeySprite.spriteFrame = this.monkeyImg[0];
        var down = cc.moveBy(2, cc.p(0, -180));
        var wait = cc.moveBy(0.8, cc.p(0, 0));
        var up = cc.moveBy(1.25, cc.p(0, 200));
        var action = cc.sequence(down, wait, up);
        this.monkey.runAction(action);
        this.scheduleOnce(function () {
            this.monkeySprite.spriteFrame = this.monkeyImg[1];
        }, 2.8);
    },

    appleAction: function () {
        var down = cc.moveBy(2, cc.p(0, -180));
        var wait = cc.moveBy(0.8, cc.p(0, 0));
        var down2 = cc.moveBy(2.25, cc.p(0, -600));
        var action = cc.sequence(down, wait, down2);
        this.apple.runAction(action);
    },

    dropApple:function(){
        this.monkeyAction();
        this.appleAction();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
