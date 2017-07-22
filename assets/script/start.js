cc.Class({
    extends: cc.Component,

    properties: {
        loadingNode: cc.Node, // loading Node
        btPlay: cc.Node,
        btHelp: cc.Node,
        btHome: cc.Node,
        noHelpFace: cc.Node,  // 帮助界面节点组
        phoneImg: cc.Node,  // 摇晃手机动画节点
        nodeAudioSprite: cc.Node,  // 控制静音按钮的图片
        nodeAudioButton: cc.Node,  // 控制静音按钮
        choosePlayer: cc.Node,  // 选择角色节点组
        loadingShadow: cc.Node,  // loading 界面遮罩
        playerList: [cc.Node],  // 角色列表
        player: cc.Node,  // 使用中的角色
        settingButtonNode: cc.Node,  // 设置按钮节点组
        chooseBackground: [cc.SpriteFrame],  // 两种选择图片
        playerImg: [cc.SpriteFrame],  // 角色图片
        audioImg: [cc.SpriteFrame],  // 静音按钮图片，1 为静音图片
        buttonClickAudio: cc.AudioClip,
        startBgm: cc.AudioClip,  // 开始界面背景音乐
        touchAnim: cc.Prefab,  // 点击动画
    },

    // use this for initialization
    onLoad: function () {
        if (cc.director.isPaused()) { // 防止游戏加载时被暂停
            cc.director.resume();
        }
        this.audioSprite = this.nodeAudioSprite.getComponent(cc.Sprite);  // 获取静音按钮 Sprite 组件
        if (window.isMuted == undefined) {
            window.isMuted = false;
            this.audioSprite.spriteFrame = this.audioImg[0];
        }
        if (window.isMuted === false) {
            this.audioSprite.spriteFrame = this.audioImg[0];
            cc.audioEngine.stopAll(); // 防止音乐重叠
            cc.audioEngine.play(this.startBgm, true, 1);
        } else if (window.isMuted === true) {
            cc.audioEngine.stopAll();
            this.audioSprite.spriteFrame = this.audioImg[1];
        }
        // 开始游戏按钮动画
        var action = cc.rotateBy(1, 20).easing(cc.easeCubicActionIn(30));
        var action1 = cc.rotateBy(1, -20).easing(cc.easeCubicActionOut(30));
        var action2 = cc.sequence(action, action1);
        this.btPlay.runAction(cc.repeatForever(action2));
        // 初始化角色
        this.selectedPlayer = window.selectedPlayer || 1;
        this.playerSprite = this.player.getComponent(cc.Sprite); // 获取角色的 sprite 组件
        if (this.selectedPlayer == 1) {
            this.playerSprite.spriteFrame = this.playerImg[0];
        } else if (this.selectedPlayer == 2) {
            this.playerSprite.spriteFrame = this.playerImg[1];
        }
        // 重力感应时的图标动画
        var action6 = cc.rotateTo(1, -10).easing(cc.easeCubicActionIn());
        var action7 = cc.rotateTo(1, 10).easing(cc.easeCubicActionIn());
        this.devicemotionAction = cc.repeatForever(cc.sequence(action6, action7));
        // 触摸操作时的图标动画
        var action8 = cc.scaleTo(1, 0.8);
        var action9 = cc.scaleTo(1, 1.2);
        this.touchAciton = cc.repeatForever(cc.sequence(action8, action9));
        // 初始化操作方式
        this.controlMethod = window.controlMethod || "devicemotion";
        this.settingChildren = this.settingButtonNode.children; // 获取设置按钮子节点
        if (this.controlMethod == "devicemotion") {
            this.settingChildren[1].active = false;
            this.settingChildren[0].runAction(this.devicemotionAction);
        } else if (this.controlMethod == "touch") {
            this.settingChildren[1].active = true;
            this.settingChildren[1].runAction(this.touchAciton);
        }
        window.controlMethod = this.controlMethod;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEffect, this);
    },

    onDestroy: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEffect, this);
    },

    // 获取按钮数据
    buttonClick: function (event, customEventData) {
        this.btEventData = customEventData; // 将点击的按钮数据存储
        this.showHelp();
    },

    // 播放 Loading 界面并跳转场景
    changeScene: function () {
        if (window.isMuted == undefined) {
            window.isMuted = false;
        }
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.loadingShadow.active = true;
        this.loadingNode.active = true;
        if (this.selectedPlayer == 1) {
            this.loadingNode.children[0].getComponent(cc.Animation).play("right0");
        } else if (this.selectedPlayer == 2) {
            this.loadingNode.children[0].getComponent(cc.Animation).play("meimei");
        }
        var action = cc.moveBy(0.5, cc.p(200, 0));
        var action1 = cc.moveBy(0.4, cc.p(100, 0));
        var action2 = cc.moveBy(0.4, cc.p(200, 0));
        this.loadingNode.children[0].runAction(cc.sequence(action, action1, action2));
        this.scheduleOnce(function () {
            cc.director.loadScene("choose");
        }, 1.3);
    },

    // 显示帮助界面
    showHelp: function () {
        if (window.isMuted == undefined) {
            window.isMuted = false;
        }
        if (window.isMuted === false) {
            var btPauseAudio = cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        this.phoneImg.rotation = 0;
        if (this.noHelpFace.active === false) {
            this.noHelpFace.active = true;
            if (this.controlMethod == "devicemotion") {
                this.noHelpFace.children[1].active = true;
                this.noHelpFace.children[2].active = false;
                // 摇手机提示动画
                var action3 = cc.rotateTo(2, -30).easing(cc.easeCubicActionIn(30));
                var action4 = cc.rotateTo(2, 0).easing(cc.easeCubicActionIn(30));
                var action5 = cc.repeatForever(cc.sequence(action3, action4));
                this.phoneImg.runAction(action5);
            } else if (this.controlMethod == "touch") {
                this.noHelpFace.children[2].active = true;
                this.noHelpFace.children[1].active = false;
                this.phoneImg.stopAction(action5);
            }
        } else if (this.noHelpFace.active === true) {
            if (this.btEventData == "help") {
                this.noHelpFace.active = false;
            } else if (this.btEventData == "play") {
                this.noHelpFace.active = false;
                this.changeScene();
            }
            this.noHelpFace.children[1].active = false;
            this.noHelpFace.children[2].active = false;
        }
    },

    // 点击静音按钮
    muteButtonClick: function () {
        if (window.isMuted === false) {
            window.isMuted = true;
            cc.audioEngine.stopAll();
            this.audioSprite.spriteFrame = this.audioImg[1];
        } else {
            window.isMuted = false;
            cc.audioEngine.play(this.startBgm, true, 1);
            this.audioSprite.spriteFrame = this.audioImg[0];
        }
    },

    // 进入切换角色界面按钮
    playerButtonClick: function () {
        this.nodeAudioButton.getComponent(cc.Button).interactable = false;
        this.btPlay.getComponent(cc.Button).interactable = false;
        this.btHelp.getComponent(cc.Button).interactable = false;
        this.btHome.getComponent(cc.Button).interactable = false;
        this.player.getComponent(cc.Button).interactable = false;
        this.settingButtonNode.getComponent(cc.Button).interactable = false;
        this.choosePlayer.active = true;
        if (this.selectedPlayer == 1) {
            this.playerList[0].children[3].active = true;
            this.playerList[1].children[3].active = false;
            this.playerList[0].children[0].getComponent(cc.Sprite).spriteFrame = this.chooseBackground[0];
            this.playerList[1].children[0].getComponent(cc.Sprite).spriteFrame = this.chooseBackground[1];
        } else if (this.selectedPlayer == 2) {
            this.playerList[0].children[3].active = false;
            this.playerList[1].children[3].active = true;
            this.playerList[1].children[0].getComponent(cc.Sprite).spriteFrame = this.chooseBackground[0];
            this.playerList[0].children[0].getComponent(cc.Sprite).spriteFrame = this.chooseBackground[1];
        }
    },

    // 关闭按钮
    closeButtonClick: function () {
        this.choosePlayer.active = false;
        this.nodeAudioButton.getComponent(cc.Button).interactable = true;
        this.btPlay.getComponent(cc.Button).interactable = true;
        this.btHome.getComponent(cc.Button).interactable = true;
        this.btHelp.getComponent(cc.Button).interactable = true;
        this.player.getComponent(cc.Button).interactable = true;
        this.settingButtonNode.getComponent(cc.Button).interactable = true;
    },

    // 选择角色按钮
    chooseButton: function (event, customEventData) {
        var cData = customEventData;
        switch (cData) {
            case "1": this.playerSprite.spriteFrame = this.playerImg[0];
                this.playerList[0].children[3].active = true;
                this.playerList[1].children[3].active = false;
                this.playerList[0].children[0].getComponent(cc.Sprite).spriteFrame = this.chooseBackground[0];
                this.playerList[1].children[0].getComponent(cc.Sprite).spriteFrame = this.chooseBackground[1];
                this.selectedPlayer = 1;
                window.selectedPlayer = this.selectedPlayer;
                break;
            case "2": this.playerSprite.spriteFrame = this.playerImg[1];
                this.playerList[0].children[3].active = false;
                this.playerList[1].children[3].active = true;
                this.playerList[1].children[0].getComponent(cc.Sprite).spriteFrame = this.chooseBackground[0];
                this.playerList[0].children[0].getComponent(cc.Sprite).spriteFrame = this.chooseBackground[1];
                this.selectedPlayer = 2;
                window.selectedPlayer = this.selectedPlayer;
                break;
        }
    },

    // 设置按钮
    settingButtonClick: function () {
        if (this.controlMethod == "devicemotion") {
            this.controlMethod = "touch";
            window.controlMethod = this.controlMethod;
        } else if (this.controlMethod == "touch") {
            this.controlMethod = "devicemotion";
            window.controlMethod = this.controlMethod;
        }
        if (this.controlMethod == "devicemotion") {
            this.settingChildren[1].active = false;
            this.settingChildren[1].stopAction(this.touchAciton);
            this.settingChildren[0].runAction(this.devicemotionAction);
        } else if (this.controlMethod == "touch") {
            this.settingChildren[1].active = true;
            this.settingChildren[0].stopAction(this.devicemotionAction);
            this.settingChildren[1].runAction(this.touchAciton);
        }
    },

    // 点击特效
    touchEffect: function (event) {
        var touchPosition = event.getLocation();
        var touchP = cc.p(touchPosition.x - cc.winSize.width / 2, touchPosition.y - cc.winSize.height / 2);
        var anim = cc.instantiate(this.touchAnim);
        this.node.addChild(anim);
        anim.position = touchP;
        var animation = anim.getComponent(cc.Animation);
        animation.play();
        this.scheduleOnce(function () {
            var child = this.node.getChildByName("touchAnim");
            this.node.removeChild(child);
        }, 0.3);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
