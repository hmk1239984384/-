var level = require("leveldata");
cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node, // 猴子节点
        applePrefab: cc.Prefab,  // 苹果预设
        appleImg: [cc.SpriteFrame],  // 3种苹果图片
        monkeyImg: [cc.SpriteFrame],  // 猴子图片,抓手和放手
        gainApple: [cc.Node],   // 3种苹果记分板的节点组
        pauseButton: cc.Node,   // 暂停按钮
        playerNode: cc.Node,   // 人物节点
        leaves: cc.Node, // 树叶遮罩
        levelLabel: cc.Label, // 木版上的字
        nodeScoreBoard: cc.Node, // 记分板节点组
        nodePauseInterface: cc.Node, // 暂停界面节点
    },

    // use this for initialization
    onLoad: function () {
        this.gameWidth = cc.winSize.width;
        this.gameHeight = cc.winSize.height;
        this.leaves.zIndex = 2; // 将树叶遮罩放在猴子上层
        this.levelNum = window.levelNum || 1; // 获取关卡数
        this.levelLabel.string = "Level " + this.levelNum; // 更改记分板上关卡显示
        this.appleTypeNum = level[this.levelNum - 1].appleTypeNum;// 苹果种类数量
        // 获取关卡中各种苹果需要的数量
        this.redAppleMaxNum = level[this.levelNum - 1].redAppleMaxNum;
        this.yellowAppleMaxNum = level[this.levelNum - 1].yellowAppleMaxNum;
        this.greenAppleMaxNum = level[this.levelNum - 1].greenAppleMaxNum;
        // 获取每种苹果的节点组
        this.redApples = this.gainApple[0].children;
        this.yellowApples = this.gainApple[1].children;
        this.greenApples = this.gainApple[2].children;
        this.changeAppleNum();// 根据数据动态调节记分板上需要的目标苹果数量
        this.scoreboardDownAction(); // 记分板动画
        this.pauseButtonAction(); // 暂停动画
        this.dropApple(); // 猴子和苹果掉落动画
        this.schedule(this.dropApple, 3);
        this.lastMonkeyPosition = null; // 与苹果同时下来时，猴子的位置
    },

    // 根据数据动态调节记分板上需要的目标苹果数量
    changeAppleNum: function () {
        // 设置苹果
        for (var i = 0; i < this.redAppleMaxNum; i++) {
            this.redApples[i].active = true;
            this.redApples[i].opacity = 70;
            var redAppleSprite = this.redApples[i].getComponent(cc.Sprite);
            redAppleSprite.spriteFrame = this.appleImg[0];
        }
        for (var i = 0; i < this.yellowAppleMaxNum; i++) {
            this.yellowApples[i].active = true;
            this.yellowApples[i].opacity = 70;
            var yellowAppleSprite = this.yellowApples[i].getComponent(cc.Sprite);
            yellowAppleSprite.spriteFrame = this.appleImg[1];
        }
        for (var i = 0; i < this.greenAppleMaxNum; i++) {
            this.greenApples[i].active = true;
            this.greenApples[i].opacity = 70;
            var greenAppleSprite = this.greenApples[i].getComponent(cc.Sprite);
            greenAppleSprite.spriteFrame = this.appleImg[2];
        }
    },

    scoreboardDownAction: function () {
        var action = cc.moveBy(1.2, cc.p(0, -230)).easing(cc.easeQuinticActionIn(100));
        var action1 = cc.moveBy(0.8, cc.p(0, 40)).easing(cc.easeQuinticActionOut(50));
        var action2 = cc.sequence(action, action1);
        this.nodeScoreBoard.runAction(action);
    },

    pauseButtonAction: function () {
        var action1 = cc.rotateBy(1.5, -200);
        var action2 = cc.rotateBy(0.5, 20);
        var action3 = cc.sequence(action1, action2).easing(cc.easeCubicActionInOut(3));
        this.pauseButton.runAction(action3);
    },

    // 猴子和苹果掉落动画
    dropApple: function () {
        this.monkeyAction();
        this.appleAction();
    },

    monkeyAction: function () {
        var monkey = cc.instantiate(this.monkey);
        this.node.addChild(monkey, 1);
        monkey.x = cc.random0To1() * this.gameWidth - (this.gameWidth / 2); //  -480 < x < 480
        monkey.y = 446;
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
        // 得到分数
        this.redAppleCount = this.playerNode.getComponent("player").redAppleCount;
        this.yellowAppleCount = this.playerNode.getComponent("player").yellowAppleCount;
        this.greenAppleCount = this.playerNode.getComponent("player").greenAppleCount;
        this.recordScore();
        this.passBarrier();
    },

    // 记录分数
    recordScore: function () {
        // 苹果变亮
        for (var i = 0; i < this.redAppleCount && i < this.redAppleMaxNum; i++) {
            this.redApples[i].active = true;
            this.redApples[i].opacity = 255;
            var redAppleSprite = this.redApples[i].getComponent(cc.Sprite);
            redAppleSprite.spriteFrame = this.appleImg[0];
        }
        for (var i = 0; i < this.yellowAppleCount && i < this.yellowAppleMaxNum; i++) {
            this.yellowApples[i].active = true;
            this.yellowApples[i].opacity = 255;
            var yellowAppleSprite = this.yellowApples[i].getComponent(cc.Sprite);
            yellowAppleSprite.spriteFrame = this.appleImg[1];
        }
        for (var i = 0; i < this.greenAppleCount && i < this.greenAppleMaxNum; i++) {
            this.greenApples[i].active = true;
            this.greenApples[i].opacity = 255;
            var greenAppleSprite = this.greenApples[i].getComponent(cc.Sprite);
            greenAppleSprite.spriteFrame = this.appleImg[2];
        }
    },

    // 过关判定
    passBarrier: function () {
        if (this.redAppleCount >= this.redAppleMaxNum && this.yellowAppleCount >= this.yellowAppleMaxNum && this.greenAppleCount >= this.greenAppleMaxNum && this.levelNum <= 5) {
            this.levelNum += 1;
            window.levelNum = this.levelNum;
            cc.director.loadScene("game");
        }
    },

    pauseButtonClick: function () {
        var action = cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1));
        this.pauseButton.runAction(action);
        var pauseInterfaceChildren = this.nodePauseInterface.children;
        for (var i = 0; i < pauseInterfaceChildren.length; i++) {
            pauseInterfaceChildren[i].active = true;
        }
        this.pauseGame();
        this.pauseButton.active = false;
    },

    continueGame: function () {
        var pauseInterfaceChildren = this.nodePauseInterface.children;
        for (var i = 0; i < pauseInterfaceChildren.length; i++) {
            pauseInterfaceChildren[i].active = false;
        }
        this.pauseGame();
    },

    pauseGame: function () {
        if (cc.director.isPaused()) {
            this.pauseButton.active = true;
            cc.director.resume();
        } else {
            this.scheduleOnce(function () {
                cc.director.pause();
            }, 0.2)
        }
    },
});
