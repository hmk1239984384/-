var level = require("leveldata");
cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node, // 猴子节点
        gainScore: cc.Node,   // 苹果记分板
        pauseButton: cc.Node,   // 暂停按钮
        playerNode: cc.Node,   // 人物节点
        leaves: cc.Node, // 树叶遮罩
        nodeScoreBoard: cc.Node, // 记分板节点组
        nodePauseInterface: cc.Node, // 暂停界面节点
        ndDefeatInterface: cc.Node,  // 失败界面节点
        nodeAudioButton: cc.Node,  // 控制静音按钮
        ndHealthPoint: cc.Node,  // 生命值节点组
        nodeShadow: cc.Node, // 阴影节点
        appleNode: cc.Node,  // 存储苹果节点
        targetBoard: cc.Node,  // 目标木牌
        levelLabel: cc.Label, // 木版上的字
        bgm: cc.AudioClip, // 背景音乐
        buttonClickAudio: cc.AudioClip,  // 按钮点击音效
        failedAudio: cc.AudioClip, // 失败音效
        applePrefab: cc.Prefab,  // 苹果预设
        audioImg: [cc.SpriteFrame],  // 静音按钮图片，1 为静音图片
        appleImg: [cc.SpriteFrame],  // 3种苹果图片
        badAppleImg: cc.SpriteFrame,  // 坏苹果图
        monkeyImg: [cc.SpriteFrame],  // 猴子图片,抓手和放手
    },

    // use this for initialization
    onLoad: function () {
        if (cc.director.isPaused()) {  // 防止游戏加载时被暂停
            cc.director.resume();
        }
        this.audioSprite = this.nodeAudioButton.getComponent(cc.Sprite);  // 获取静音按钮 Sprite 组件
        if (window.isMuted == undefined) {
            window.isMuted = false;
            this.audioSprite.spriteFrame = this.audioImg[0];
        }
        if (window.isMuted === false) {
            this.audioSprite.spriteFrame = this.audioImg[0];
            cc.audioEngine.stopAll(); // 防止音乐重叠
            cc.audioEngine.play(this.bgm, true, 1);
        } else if (window.isMuted === true) {
            this.audioSprite.spriteFrame = this.audioImg[1];
        }
        this.gameWidth = cc.winSize.width;
        this.gameHeight = cc.winSize.height;
        this.leaves.zIndex = 2; // 将树叶遮罩放在猴子上层
        this.levelNum = window.levelNum || 1; // 获取关卡数
        this.levelLabel.string = "第 " + this.levelNum + " 关"; // 更改记分板上关卡显示
        this.appleTypeNum = level[this.levelNum - 1].appleTypeNum;// 苹果种类数量
        this.badApple = level[this.levelNum - 1].badApple;  // 获取是否需要生成坏苹果
        // 获取关卡中各种苹果需要的数量
        this.redAppleMaxNum = level[this.levelNum - 1].redAppleMaxNum;
        this.yellowAppleMaxNum = level[this.levelNum - 1].yellowAppleMaxNum;
        this.greenAppleMaxNum = level[this.levelNum - 1].greenAppleMaxNum;
        this.peachMaxNum = level[this.levelNum - 1].peachMaxNum;
        this.pearMaxNum = level[this.levelNum - 1].pearMaxNum;
        this.ndHealthPointChildren = this.ndHealthPoint.children;  // 获取生命值子节点
        this.starNum = [];  // 初始化分数
        this.starNum.length = level.length;
        this.starNum = JSON.parse(cc.sys.localStorage.getItem("starNum")) || [];
        this.showTarget();  // 显示当前关卡目标
    },

    // 开始游戏初始化
    loadGame: function () {
        this.changeAppleNum("gainScore");// 根据数据动态调节记分板上需要的目标苹果数量
        this.scoreboardDownAction(); // 记分板动画
        this.pauseButtonAction(); // 暂停按钮动画
        this.lastMonkeyPosition = null; // 与苹果同时下来时，猴子的位置
        this.schedule(this.dropApple, 3); // 循环掉落苹果
        window.healthPoint = 3; // 初始化生命值
        this.healthPointAction(); // 播放生命值动画
    },

    // 显示目标
    showTarget: function () {
        this.targetBoard.active = true;
        this.changeAppleNum("targetFirst");
    },

    // start game
    startGame: function () {
        this.targetBoard.active = false;
        this.loadGame();
    },

    // 生命值动画
    healthPointAction: function () {
        for (var i = 0; i < this.ndHealthPointChildren.length; i++) {
            this.ndHealthPointChildren[i].active = true;
            this.ndHealthPointChildren[i].runAction(cc.blink(3, 3));
        }
    },

    // 根据数据动态调节记分板上需要的目标苹果数量，并闪烁
    changeAppleNum: function (target) {
        // 获取每种苹果的节点组
        if (target == "gainScore") {
            var scoreChildren = this.gainScore.children;
        } else if (target == "targetFirst") {
            var scoreChildren = this.targetBoard.children[2].children;
        }
        var allAppleNum = this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum + this.pearMaxNum;
        // 设置苹果
        for (var i = 0; i < allAppleNum; i++) {
            scoreChildren[i].active = true;
            scoreChildren[i].opacity = 70;
        }
        for (var j = 0; j < this.redAppleMaxNum; j++) {
            var appleSprite = scoreChildren[j].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[0];
            scoreChildren[j].runAction(cc.blink(4, 4));
        }
        for (var k = this.redAppleMaxNum; k < this.redAppleMaxNum + this.yellowAppleMaxNum; k++) {
            var appleSprite = scoreChildren[k].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[1];
            scoreChildren[k].runAction(cc.blink(4, 4));
        }
        for (var l = this.redAppleMaxNum + this.yellowAppleMaxNum; l < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum; l++) {
            var appleSprite = scoreChildren[l].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[2];
            scoreChildren[l].runAction(cc.blink(4, 4));
        }
        for (var m = this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum; m < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum; m++) {
            var appleSprite = scoreChildren[m].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[3];
            scoreChildren[m].runAction(cc.blink(4, 4));
        }
        for (var n = this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum; n < this.redAppleMaxNum + this.yellowAppleMaxNum + this.greenAppleMaxNum + this.peachMaxNum + this.pearMaxNum; n++) {
            var appleSprite = scoreChildren[n].getComponent(cc.Sprite);
            appleSprite.spriteFrame = this.appleImg[4];
            scoreChildren[n].runAction(cc.blink(4, 4));
        }
    },

    // 记分板下落动画
    scoreboardDownAction: function () {
        var action = cc.moveBy(1.2, cc.p(0, -230)).easing(cc.easeElasticOut(3));
        var action1 = cc.moveBy(0.8, cc.p(0, 40)).easing(cc.easeElasticIn());
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
        var randomNum = cc.random0To1();
        this.monkeyAction();
        if (this.badApple == 1) { // 当关卡数据中，需要产生坏苹果时
            // 设置出现坏苹果的概率
            if (randomNum > 0.8) {
                this.appleAction("badApple");
            } else {
                this.appleAction("goodApple");
            }
        } else if (this.badApple == 0) {
            this.appleAction("goodApple");
        }
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

    appleAction: function (a) {
        // 根据关卡数据中的 typenum 来判断需要产生几种苹果
        var appleType = Math.ceil(cc.random0To1() * this.appleTypeNum);
        var apple = cc.instantiate(this.applePrefab);
        var appleSprite = apple.getComponent(cc.Sprite);
        if (a == "goodApple") {
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
        } else if (a == "badApple") {
            apple.name = "badApple";
            appleSprite.spriteFrame = this.badAppleImg;
        }
        this.appleNode.addChild(apple);
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
        var dropApple1 = this.appleNode.getChildByName("redApple");
        var dropApple2 = this.appleNode.getChildByName("yellowApple");
        var dropApple3 = this.appleNode.getChildByName("greenApple");
        var dropApple4 = this.appleNode.getChildByName("peach");
        var dropApple5 = this.appleNode.getChildByName("pear");
        var badApple = this.appleNode.getChildByName("badApple");
        if (dropApple1 && dropApple1.y < - this.gameHeight / 2 - dropApple1.height / 2 && window.healthPoint > 0) {
            dropApple1.destroy();
            window.healthPoint--;
            this.ndHealthPointChildren[window.healthPoint].runAction(cc.fadeOut(0.2));
        }
        if (dropApple2 && dropApple2.y < - this.gameHeight / 2 - dropApple2.height / 2 && window.healthPoint > 0) {
            dropApple2.destroy();
            window.healthPoint--;
            this.ndHealthPointChildren[window.healthPoint].runAction(cc.fadeOut(0.2));
        }
        if (dropApple3 && dropApple3.y < - this.gameHeight / 2 - dropApple3.height / 2 && window.healthPoint > 0) {
            dropApple3.destroy();
            window.healthPoint--;
            this.ndHealthPointChildren[window.healthPoint].runAction(cc.fadeOut(0.2));
        }
        if (dropApple4 && dropApple4.y < - this.gameHeight / 2 - dropApple4.height / 2 && window.healthPoint > 0) {
            dropApple4.destroy();
            window.healthPoint--;
            this.ndHealthPointChildren[window.healthPoint].runAction(cc.fadeOut(0.2));
        }
        if (dropApple5 && dropApple5.y < - this.gameHeight / 2 - dropApple5.height / 2 && window.healthPoint > 0) {
            dropApple5.destroy();
            window.healthPoint--;
            this.ndHealthPointChildren[window.healthPoint].runAction(cc.fadeOut(0.2));
        }
        if (badApple && badApple.y < - this.gameHeight / 2 - badApple.height / 2 && window.healthPoint > 0) {
            badApple.destroy();
        }
        if (window.healthPoint <= 0) {
            this.gameOver();
        }
    },

    // 点击暂停按钮
    pauseButtonClick: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.nodeShadow.active = true; // 显示阴影
        this.nodePauseInterface.active = true; // 显示暂停界面
        var action = cc.moveTo(0.3, cc.p(0, -20)).easing(cc.easeCircleActionOut());
        var action1 = cc.moveTo(0.1, cc.p(0, 0)).easing(cc.easeCircleActionIn());
        this.nodePauseInterface.runAction(cc.sequence(action, action1));
        this.scheduleOnce(this.pauseGame, 0.4);
        this.pauseButton.active = false;
    },

    // 暂停界面点击继续按钮
    continueGame: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.pauseGame();
        var action = cc.moveTo(0.1, cc.p(0, -20)).easing(cc.easeCircleActionIn());
        var action1 = cc.moveTo(0.3, cc.p(0, 600)).easing(cc.easeCircleActionOut());
        this.nodePauseInterface.runAction(cc.sequence(action, action1));
        this.scheduleOnce(function () {
            this.nodeShadow.active = false;
            this.nodePauseInterface.active = false; // 隐藏暂停界面
        }, 0.4)
    },

    // 过关界面点击继续按钮
    nextLevel: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.getStar();
        cc.director.resume();
        cc.director.loadScene("game");
    },

    // 重新开始界面
    restartButtonClick: function () {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        window.levelNum = this.levelNum;  // 将关卡数恢复成当前关
        window.healthPoint = 3; // 重置生命值
        cc.director.resume();
        cc.director.loadScene("game");
    },

    // 返回主界面按钮
    menuButtonClick: function (event, customEventData) {
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        if (customEventData == "next") {  // 当出现的是过关界面时，点击菜单也能记分
            this.getStar();
        }
        cc.director.resume();
        cc.director.loadScene("start");
    },

    // 静音按钮按下
    muteButtonClick: function () {
        if (window.isMuted === false) {
            window.isMuted = true;
            cc.audioEngine.stopAll();
            this.audioSprite.spriteFrame = this.audioImg[1];
        } else {
            window.isMuted = false;
            cc.audioEngine.play(this.bgm, true, 1);
            this.audioSprite.spriteFrame = this.audioImg[0];
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

    // 游戏失败界面显示
    gameOver: function () {
        this.nodeShadow.active = true;
        this.ndDefeatInterface.active = true;
        var action = cc.moveTo(0.3, cc.p(0, -20)).easing(cc.easeCircleActionOut());
        var action1 = cc.moveTo(0.1, cc.p(0, 0)).easing(cc.easeCircleActionIn());
        this.ndDefeatInterface.runAction(cc.sequence(action, action1));
        this.scheduleOnce(function () {
            this.pauseGame();
            cc.audioEngine.stopAll();
            cc.audioEngine.play(this.failedAudio, false, 1);
        })
    },

    // 记分方法
    getStar: function () {
        if (this.starNum[this.levelNum - 1] == undefined) {  // 不存在最高分时，记分
            this.starNum[this.levelNum - 1] = this.healthPoint;
            cc.sys.localStorage.setItem("starNum", JSON.stringify(this.starNum));
        } else if (this.starNum[this.levelNum - 1] && this.healthPoint > this.starNum[this.levelNum - 1]) {  // 最高分低于当前分时，记分
            this.starNum[this.levelNum - 1] = this.healthPoint;
            cc.sys.localStorage.setItem("starNum", JSON.stringify(this.starNum));
        }
    },
});
