cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.levelsData = [{
            "level": 1,
            "appleTypeNum": 1,  // 苹果类型
            "redAppleMaxNum": 3,  // 一共需要的红苹果数量
            "yellowAppleMaxNum": 0,
            "greenAppleMaxNum": 0
        }, {
            "level": 2,
            "appleTypeNum": 2,
            "redAppleMaxNum": 3,
            "yellowAppleMaxNum": 1,
            "greenAppleMaxNum": 0
        }, {
            "level": 3,
            "appleTypeNum": 3,
            "redAppleMaxNum": 2,
            "yellowAppleMaxNum": 2,
            "greenAppleMaxNum": 1
        }, {
            "level": 4,
            "appleTypeNum": 3,
            "redAppleMaxNum": 2,
            "yellowAppleMaxNum": 3,
            "greenAppleMaxNum": 2
        }]
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
