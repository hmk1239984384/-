var level = require("leveldata");
cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node, // 猴子节点
        applePrefab: cc.Prefab,  // 苹果预设
        appleImg: [cc.SpriteFrame],  // 3种苹果图片
        monkeyImg: [cc.SpriteFrame],  // 猴子图片,抓手和放手
        gainScore: cc.Node,   // 苹果记分板
        pauseButton: cc.Node,   // 暂停按钮
        playerNode: cc.Node,   // 人物节点
        leaves: cc.Node, // 树叶遮罩
        levelLabel: cc.Label, // 木版上的字
        nodeScoreBoard: cc.Node, // 记分板节点组
        nodePauseInterface: cc.Node, // 暂停界面节点
        ndDefeatInterface: cc.Node,  // 失败界面节点
        bgm: cc.AudioClip, // 背景音乐
        buttonClickAudio: cc.AudioClip,  // 按钮点击音效
        nodeAudioButton: cc.Node,  // 控制静音按钮
        ndHealthPoint: cc.Node,  // 生命值节点组
    },

    // use this for initialization
    onLoad: function () {
        if (cc.director.isPaused()) {  // 防止游戏加载时被暂停
            cc.director.resume();
        }
        this.audioAnim = this.nodeAudioButton.getComponent(cc.Animation);
        if (window.isMuted == undefined) {
            window.isMuted = false;
            this.audioAnim.play();
        }
        if (window.isMuted === false) {
            this.audioAnim.play();
            cc.audioEngine.stopAll(); // 防止音乐重叠
            this.bgmId = cc.audioEngine.play(this.bgm, true, 1);
        } else if (window.isMuted === true) {
            this.audioAnim.stop();
        }
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
        this.peachMaxNum = level[this.levelNum - 1].peachMaxNum;
        this.pearMaxNum = level[this.levelNum - 1].pearMaxNum;
        // 获取每种苹果的节点组
        this.scoreChildren = this.gainScore.children;
        this.changeAppleNum();// 根据数据动态调节记分板上需要的目标苹果数量
        this.scoreboardDownAction(); // 记分板动画
        this.pauseButtonAction(); // 暂停动画
        this.lastMonkeyPosition = null; // 与苹果同时下来时，猴子的位置
        this.schedule(this.dropApple, 3); // 循环掉落苹果
        this.ndHealthPointChildren = this.ndHealthPoint.children;  // 获取生命值子节点
        this.healthPointAction(); // 播放生命值动画
        this.healthPoint = 3; // 初始化生命值
    },

    // 生命值动画
    healthPointAction: function () {
        for (var i = 0; i < this.ndHealthPointChildren.length; i++) {
            this.ndHealthPointChildren[i].runAction(cc.blink(3, 3));
        }
    },

    // 根据数据动态调节记分板上需要的目标苹果数量
    changeAppleNum: function () {
        var allAppleNum = this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum + this.pearMaxNum;
        // 设置苹果
        for (var i = 0; i < allAppleNum; i++) {
            this.scoreChildren[i].active = true;
            this.scoreChildren[i].opacity = 70;
        }
        for (var j = 0; j < this.redAppleMaxNum; j++) {
            var appleSprite = this.scoreChildren[j].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[0];
            this.scoreChildren[j].runAction(cc.blink(4, 4));
        }
        for (var k = this.redAppleMaxNum; k < this.redAppleMaxNum + this.yellowAppleMaxNum; k++) {
            var appleSprite = this.scoreChildren[k].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[1];
            this.scoreChildren[k].runAction(cc.blink(4, 4));
        }
        for (var l = this.redAppleMaxNum + this.yellowAppleMaxNum; l < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum; l++) {
            var appleSprite = this.scoreChildren[l].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[2];
            this.scoreChildren[l].runAction(cc.blink(4, 4));
        }
        for (var m = this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum; m < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum; m++) {
            var appleSprite = this.scoreChildren[m].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[3];
            this.scoreChildren[m].runAction(cc.blink(4, 4));
        }
        for (var n = this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum; n < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum + this.pearMaxNum; n++) {
            var appleSprite = this.scoreChildren[n].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[4];
            this.scoreChildren[n].runAction(cc.blink(4, 4));
        }
    },

    // 记分板下落动画
    scoreboardDownAction: function () {
        var action = cc.moveBy(1.2, cc.p(0, -230)).easing(cc.easeElasticOut(3));
        var action1 = cc.moveBy(0.8, cc.p(0, 40)).easing(cc.easeElasticIn(3));
        var action2 = cc.sequence(action, action1);
        this.nodeScoreBoard.runAction(action);
    },

    // 暂停按钮出现动画
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
        monkey.x = cc.random0To1() * (this.gameWidth - this.monkey.width / 2) - ((this.gameWidth - this.monkey.width / 2) / 2); //  -420 < x < 420  让猴子在屏幕内出现
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
            case 4:
                apple.name = "peach";
                appleSprite.spriteFrame = this.appleImg[3];
                break;
            case 5:
                apple.name = "pear";
                appleSprite.spriteFrame = this.appleImg[4];
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
        var dropApple = this.node.getChildByName("redApple" || "yellowApple" || "greenApple" || "peach" || "pear");
        if (dropApple && dropApple.y < - this.gameHeight / 2 - dropApple.height / 2 && this.healthPoint > 0) {
            dropApple.destroy();
            this.healthPoint--;
            this.ndHealthPointChildren[this.healthPoint].runAction(cc.fadeOut(1));
        } else if (this.healthPoint <= 0) {
            this.gameOver();
        }
    },

    // 点击暂停按钮
    pauseButtonClick: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.nodePauseInterface.active = true; // 显示暂停界面
        this.pauseGame(); // 暂停游戏
        this.pauseButton.active = false;
    },

    // 暂停界面点击继续按钮
    continueGame: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.pauseGame();
        this.nodePauseInterface.active = false; // 隐藏暂停界面
    },

    // 过关界面点击继续按钮
    nextLevel: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        cc.director.loadScene("game");
    },

    // 重新开始界面
    restartButtonClick: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        window.levelNum = this.levelNum;  // 将关卡数恢复成当前关
        cc.director.loadScene("game");
    },

    menuButtonClick: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        cc.director.loadScene("start");
    },

    // 静音按钮按下
    muteButtonClick: function () {
        if (window.isMuted === false) {
            window.isMuted = true;
            cc.audioEngine.stopAll();
            this.audioAnim.stop();
        } else {
            window.isMuted = false;
            cc.audioEngine.play(this.bgm, true, 1);
            this.audioAnim.play();
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

    gameOver: function () {
        this.pauseGame();
        this.ndDefeatInterface.active = true;
    }
});
