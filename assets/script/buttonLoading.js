cc.Class({
    extends: cc.Component,

    properties: {
        loadingAnim: cc.Animation
    },

    // use this for initialization
    onLoad: function () {

    },

    playLoadingAnim: function () {
        console.log(this.node.name);
        this.loadingAnim.play();
        this.schedule(this.changeScene,1);
    },

    changeScene:function(){
       if(this.node.name == "play"){
           cc.director.loadScene("game");
       }else if(this.node.name == "help"){
           cc.director.loadScene("help");
       }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
