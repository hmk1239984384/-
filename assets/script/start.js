cc.Class({
    extends: cc.Component,

    properties: {
        loadingAnim: cc.Animation, // loading Node
        btPlay: cc.Node,
        noHelpFace: cc.Node,
        phoneImg: cc.Node,  // 摇晃手机动画节点
        buttonClickAudio: cc.AudioClip,
        nodeAudioButton: cc.Node,  // 控制静音按钮
        audioImg: [cc.SpriteFrame],  // 静音按钮图片，1 为静音图片
        startBgm: cc.AudioClip,  // 开始界面背景音乐
        choosePlayer: cc.Node,  // 选择角色节点组
        loadingShadow: cc.Node,  // loading 界面遮罩
        chooseBackground: [cc.SpriteFrame],  // 两种选择图片
        playerList: [cc.Node],  // 角色列表
        player: cc.Node,  // 使用中的角色
        playerImg: [cc.SpriteFrame],  // 角色图片
        settingLabel: cc.Label, // 设置按钮
    },

    // use this for initialization
    onLoad: function () {
        if (cc.director.isPaused()) { // 防止游戏加载时被暂停
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
        // 摇手机提示动画
        var action3 = cc.rotateBy(2, -30).easing(cc.easeCubicActionIn(30));
        var action4 = cc.rotateBy(2, 30).easing(cc.easeCubicActionIn(30));
        var action5 = cc.repeatForever(cc.sequence(action3, action4));
        this.phoneImg.runAction(action5);
        // 初始化角色
        this.selectedPlayer = window.selectedPlayer || 1;
        this.playerSprite = this.player.getComponent(cc.Sprite); // 获取角色的 sprite 组件
        if (this.selectedPlayer == 1) {
            this.playerSprite.spriteFrame = this.playerImg[0];
        } else if (this.selectedPlayer == 2) {
            this.playerSprite.spriteFrame = this.playerImg[1];
        }
        // 初始化操作方式        
        this.controlMethod = window.controlMethod || "devicemotion";
        if (this.controlMethod == "devicemotion") {
            this.settingLabel.string = "重力感应";
        } else if (this.controlMethod == "touch") {
            this.settingLabel.string = "触摸";
        }
        window.controlMethod = this.controlMethod;
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
        this.loadingAnim.play();
        this.scheduleOnce(function () {
            cc.director.loadScene("choose");
        }, 1);
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
        } else if (this.noHelpFace.active === true) {
            if (this.btEventData == "help") {
                this.noHelpFace.active = false;
            } else if (this.btEventData == "play") {
                this.noHelpFace.active = false;
                this.changeScene();
            }
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
            console.log("change to \"Touch\"");
        } else if (this.controlMethod == "touch") {
            this.controlMethod = "devicemotion";
            window.controlMethod = this.controlMethod;
            console.log("change to \"Devicemotion\"");
        }
        if (this.controlMethod == "devicemotion") {
            this.settingLabel.string = "重力感应";
        } else if (this.controlMethod == "touch") {
            this.settingLabel.string = "触摸";
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
