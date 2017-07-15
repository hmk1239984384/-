cc.Class({
    extends: cc.Component,

    properties: {
        buttonClickAudio: cc.AudioClip,  // 按钮音效
        bgm: cc.AudioClip,
        audioImg: [cc.SpriteFrame], // 静音按钮图片，1 为静音图片
        nodeAudioButton: cc.Node,   // 音量按钮
        numButton: [cc.Node],  // 各关卡节点
        starImg: [cc.SpriteFrame],  // 星星图片, 0 为空心，1 为实心
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
        this.starNum = JSON.parse(cc.sys.localStorage.getItem("starNum")) || [];
        this.showStar();
    },

    // 选关按钮
    chooseButton: function (event, customEventData) {
        if (window.isMuted === false) {
            cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        var data = customEventData - 0;  // 转换成数字
        window.levelNum = data;
        cc.director.loadScene("game");
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


    // 回主界面按钮
    homeButtonClick: function () {
        cc.director.loadScene("start");
    },

    // 显示星星
    showStar: function () {
        for (var i = 0; i < this.numButton.length; i++) {
            for (var j = 0; j < this.starNum[i]; j++) {
                this.numButton[i].children[j].getComponent(cc.Sprite).spriteFrame = this.starImg[1];
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
