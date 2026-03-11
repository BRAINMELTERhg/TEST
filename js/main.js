import HomeScene from "./HomeScene.js";

const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#000000",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [HomeScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// Optional: hide mobile bars on first interaction
window.addEventListener('touchstart', () => {
    window.scrollTo(0, 1);
}, { once: true });