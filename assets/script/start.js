cc.Class({
    extends: cc.Component,

    properties: {
        loadingAnim: cc.Animation, // loading Node
        btPlay: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var action = cc.rotateBy(1, 20).easing(cc.easeCubicActionIn(30));
        var action1 = cc.rotateBy(1, -20).easing(cc.easeCubicActionOut(30));
        var action2 = cc.sequence(action, action1);
        this.btPlay.runAction(cc.repeatForever(action2));
    },

    changeScene: function (event, customEventData) {
        var buttonData = customEventData;
        this.loadingAnim.play();
        this.scheduleOnce(function () {
            if (buttonData == "play") {
                cc.director.loadScene("game");
            } else if (buttonData == "help") {
                cc.director.loadScene("help");
            }
        }, 1);
    },


    showHelp:function(){
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
