cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node,
        apple: cc.Prefab,
        monkeyImg: [cc.SpriteFrame],
        gainApple: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.gameHeight = cc.winSize.height;
        this.dropApple();
        this.schedule(this.dropApple, 1);
        this.lastMonkeyPosition = null;
    },

    monkeyAction: function () {
        var monkey = cc.instantiate(this.monkey);
        this.node.addChild(monkey);
        monkey.x = cc.random0To1() * 610 - 180;
        monkey.y = 450;
        this.lastMonkeyPosition = cc.p(monkey.x,monkey.y);
        var monkeySprite = monkey.getComponent(cc.Sprite);
        monkeySprite.spriteFrame = this.monkeyImg[0];
        var down = cc.moveBy(2, cc.p(0, -180));
        var wait = cc.moveBy(0.8, cc.p(0, 0));
        var up = cc.moveBy(1.25, cc.p(0, 200));
        var action = cc.sequence(down, wait, up);
        monkey.runAction(action);
        this.scheduleOnce(function () {
            monkeySprite.spriteFrame = this.monkeyImg[1];
        }, 2.8);
    },

    appleAction: function () {
        var apple = cc.instantiate(this.apple);
        this.node.addChild(apple);
        apple.setPosition(this.lastMonkeyPosition.x + 20, this.lastMonkeyPosition.y - 80);
        var down = cc.moveBy(2, cc.p(0, -180));
        var wait = cc.moveBy(0.8, cc.p(0, 0));
        var down2 = cc.moveBy(2.25, cc.p(0, -600));
        var action = cc.sequence(down, wait, down2);
        apple.runAction(action);
    },


    dropApple: function () {
        this.monkeyAction();
        this.appleAction();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var redApple = this.node.getChildByName("redApple");
        if (redApple && redApple.y < - this.gameHeight / 2 - redApple.height / 2) {
            redApple.destroy();
            // console.log("redApple destroy");
        }
        this.recordScore();
    },

    recordScore: function () {
        var apples = this.gainApple.children;
        var redAppleCount = window.redAppleCount;
        for (var i = 0; i < redAppleCount; i++) {
            apples[i].opacity = 255;
        }
    }
});
