cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node,
        applePrefab: cc.Prefab,
        appleImg: [cc.SpriteFrame],
        monkeyImg: [cc.SpriteFrame],
        gainApple: [cc.Node],
        pauseButton: cc.Node,
        playerNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.gameHeight = cc.winSize.height;
        this.dropApple();
        this.schedule(this.dropApple, 3);
        this.lastMonkeyPosition = null;

        var levelNum = 3; // 第几关
        this.data = this.node.getComponent("leveldata").levelsData[levelNum - 1];
        this.appleTypeNum = this.data.appleTypeNum; // 苹果种类数量
        this.changeAppleNum();
    },

    // 根据数据动态调节记分板上需要的目标苹果数量
    changeAppleNum: function () {
        // 获取关卡中各种苹果需要的数量
        var redAppleMaxNum = this.data.redAppleMaxNum;
        var yellowAppleMaxNum = this.data.yellowAppleMaxNum;
        var greenAppleMaxNum = this.data.greenAppleMaxNum;
        // 获取每种苹果的节点组
        var redApples = this.gainApple[0].children;
        var yellowApples = this.gainApple[1].children;
        var greenApples = this.gainApple[2].children;
        // 设置苹果
        for (var i = 0; i < redAppleMaxNum; i++) {
            redApples[i].active = true;
            redApples[i].opacity = 70;
            var redAppleSprite = redApples[i].getComponent(cc.Sprite);
            redAppleSprite.spriteFrame = this.appleImg[0];
        }
        for (var i = 0; i < yellowAppleMaxNum; i++) {
            yellowApples[i].active = true;
            yellowApples[i].opacity = 70;
            var yellowAppleSprite = yellowApples[i].getComponent(cc.Sprite);
            yellowAppleSprite.spriteFrame = this.appleImg[1];
        }
        for (var i = 0; i < greenAppleMaxNum; i++) {
            greenApples[i].active = true;
            greenApples[i].opacity = 70;
            var greenAppleSprite = greenApples[i].getComponent(cc.Sprite);
            greenAppleSprite.spriteFrame = this.appleImg[2];
        }
    },

    // 猴子和苹果掉落动画
    dropApple: function () {
        this.monkeyAction();
        this.appleAction();
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
        // 根据关卡数据中的 typenum 来判断需要产生几种苹果
        var appleType = Math.ceil(cc.random0To1() * this.appleTypeNum);
        var apple = cc.instantiate(this.applePrefab);
        var appleSprite = apple.getComponent(cc.Sprite);
        switch (appleType) {
            case 1:
                apple.name = "redApple";
                appleSprite.spriteFrame = this.appleImg[0];
                break;
            case 2:
                apple.name = "yellowApple";
                appleSprite.spriteFrame = this.appleImg[1];
                break;
            case 3:
                apple.name = "greenApple";
                appleSprite.spriteFrame = this.appleImg[2];
                break;
        }
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

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // 得到掉落的苹果并消除
        var dropApple = this.node.getChildByName("redApple" || "yellowApple" || "greenApple");
        if (dropApple && dropApple.y < - this.gameHeight / 2 - dropApple.height / 2) {
            dropApple.destroy();
            console.log("dropApple destroy");
        }
        this.recordScore();
    },

    // 记录分数
    recordScore: function () {
        // 得到分数
        var redAppleCount = this.playerNode.getComponent("player").redAppleCount;
        var yellowAppleCount = this.playerNode.getComponent("player").yellowAppleCount;
        var greenAppleCount = this.playerNode.getComponent("player").greenAppleCount;
        // 获取关卡中各种苹果需要的数量
        var redAppleMaxNum = this.data.redAppleMaxNum;
        var yellowAppleMaxNum = this.data.yellowAppleMaxNum;
        var greenAppleMaxNum = this.data.greenAppleMaxNum;
        // 获取每种苹果的节点组
        var redApples = this.gainApple[0].children;
        var yellowApples = this.gainApple[1].children;
        var greenApples = this.gainApple[2].children;
        // 苹果变亮
        for (var i = 0; i < redAppleCount && i < redAppleMaxNum; i++) {
            redApples[i].active = true;
            redApples[i].opacity = 255;
            var redAppleSprite = redApples[i].getComponent(cc.Sprite);
            redAppleSprite.spriteFrame = this.appleImg[0];
        }
        for (var i = 0; i < yellowAppleCount && i < yellowAppleMaxNum; i++) {
            yellowApples[i].active = true;
            yellowApples[i].opacity = 255;
            var yellowAppleSprite = yellowApples[i].getComponent(cc.Sprite);
            yellowAppleSprite.spriteFrame = this.appleImg[1];
        }
        for (var i = 0; i < greenAppleCount && i < greenAppleMaxNum; i++) {
            greenApples[i].active = true;
            greenApples[i].opacity = 255;
            var greenAppleSprite = greenApples[i].getComponent(cc.Sprite);
            greenAppleSprite.spriteFrame = this.appleImg[2];
        }
    },

    pauseGame: function () {
        var action = cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1));
        this.pauseButton.runAction(action);
        if (cc.director.isPaused()) {
            cc.director.resume();
        } else {
            this.scheduleOnce(function () {
                cc.director.pause();
            }, 0.2)
        }
    },

});
