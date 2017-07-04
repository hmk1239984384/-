cc.Class({
    extends: cc.Component,

    properties: {
        monkey: cc.Node,
        apple: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.monkey.x = cc.random0To1() * 610 - 180;
        this.monkeyAction();
    },

    monkeyAction: function () {
        var action = cc.moveBy(2, cc.p(0,-200));
        this.monkey.runAction(action);
        console.log(this.monkey.x + "," + this.monkey.y);
    },

    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
