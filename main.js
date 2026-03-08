import HomeScene from "./HomeScene.js";

const config = {

type: Phaser.AUTO,

parent: "game-container",

width: window.innerWidth,
height: window.innerHeight,

backgroundColor:"#000000",

scene: [HomeScene],

scale: {
mode: Phaser.Scale.RESIZE
},

physics:{
default:"arcade"
}

};

const game = new Phaser.Game(config);