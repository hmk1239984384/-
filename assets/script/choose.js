cc.Class({
    extends: cc.Component,

    properties: {
        buttonClickAudio: cc.AudioClip,  // 按钮音效
        bgm: cc.AudioClip,
        audioImg: [cc.SpriteFrame], // 静音按钮图片，1 为静音图片
        nodeAudioButton: cc.Node,
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
    },

    // 选关按钮
    chooseButton: function (event, customEventData) {
        if (window.isMuted === false) {
            cc.audioEngine.play(this.buttonClickAudio, false, 1);
        }
        var data = customEventData;
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
    homeButtonClick:function(){
        cc.director.loadScene("start");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
