cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node,
        apple: cc.Prefab,
        monkeyImg: [cc.SpriteFrame],
        gainApple: cc.Node,
        pauseButton: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.gameHeight = cc.winSize.height;
        this.dropApple();
        this.schedule(this.dropApple, 3);
        this.lastMonkeyPosition = null;
    },

    monkeyAction: function () {
        var monkey = cc.instantiate(this.monkey);
        this.node.addChild(monkey);
        monkey.x = cc.random0To1() * 610 - 180;
        monkey.y = 450;
        this.lastMonkeyPosition = cc.p(monkey.x, monkey.y);
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
        apple.setPosition(this.lastMonkeyPosition.x + 20, this.lastMonkeyPosition.y - 90);
        var down = cc.moveBy(2, cc.p(0, -180));
        var wait = cc.moveBy(0.8, cc.p(0, 0));
        var down2 = cc.moveBy(2.25, cc.p(0, -600));
        var rotate = cc.rotateBy(2.25, 360 * 2);
        var downAndRotate = cc.spawn(down2, rotate);
        var action = cc.sequence(down, wait, downAndRotate);
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
        }
        this.recordScore();
    },

    recordScore: function () {
        var apples = this.gainApple.children;
        var redAppleCount = window.redAppleCount;
        for (var i = 0; i < redAppleCount && i < apples.length; i++) {
            apples[i].opacity = 255;
        }
    },

    pauseGame: function () {
        var action = cc.sequence(cc.scaleTo(0.1, 3), cc.scaleTo(0.1, 1));
        this.pauseButton.runAction(action);
        if (cc.director.isPaused()) {
            cc.director.resume();
            console.log("continue");
        } else {
            cc.director.pause();
            console.log("pause");
        }
    }
});
