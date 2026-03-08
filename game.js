const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: 720,
    backgroundColor: '#000000',
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let worldWidth = 6000;
let sky;
let floor;
let cam;
let cursor;
let driftingGif;

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('floor', 'assets/floor.png');
    this.load.image('gif1', 'assets/gif1.gif');
    this.load.image('gif2', 'assets/gif2.gif');
    this.load.image('cursor', 'assets/cursor.png');
    this.load.audio('music', 'assets/music.mp3');
}

function create() {

    cam = this.cameras.main;
    cam.setBounds(0, 0, worldWidth, 720);

    // === INFINITE MOVING SKY ===
    sky = this.add.tileSprite(0, 0, worldWidth, window.innerHeight, 'sky')
        .setOrigin(0, 0)
        .setScrollFactor(0); // stays relative to camera

    // === CHECKERBOARD FLOOR ===
    floor = this.add.tileSprite(
        0,
        window.innerHeight - 200,
        worldWidth,
        200,
        'floor'
    )
    .setOrigin(0, 0);

    // === CLICKABLE GIF 1 ===
    let gif1 = this.add.image(800, window.innerHeight - 300, 'gif1')
        .setInteractive();

    gif1.on('pointerdown', () => {
        window.open('https://example.com', '_blank');
    });

    // === MOVING / DRIFTING GIF ===
    driftingGif = this.add.image(2000, window.innerHeight - 400, 'gif2')
        .setInteractive();

    driftingGif.on('pointerdown', () => {
        window.open('https://example.org', '_blank');
    });

    // make it float
    this.tweens.add({
        targets: driftingGif,
        y: driftingGif.y - 50,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    // === SCROLL / DRAG RIGHT ===
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
        cam.scrollX = Phaser.Math.Clamp(
            cam.scrollX + deltaY,
            0,
            worldWidth - cam.width
        );
    });

   /* 
   
/////////this section could be useful for distinguishing between mobile and desktop scrolling

   if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
    // Mobile-specific code
} else {
    // Desktop-specific code
}
   
   this.input.on('pointermove', (pointer) => {
        if (pointer.isDown) {
            cam.scrollX = Phaser.Math.Clamp(
                cam.scrollX - pointer.velocity.x / 10,
                0,
                worldWidth - cam.width
            );
        }
    });
    
    ////////////this is for room height/width
    scale: {
    mode: Phaser.Scale.RESIZE
}
    scale.mode = Phaser.Scale.RESIZE
    
    
    */

    // === CUSTOM CURSOR ===
    cursor = this.add.image(0, 0, 'cursor')
        .setDepth(1000)
        .setScrollFactor(0);

    // === BACKGROUND MUSIC ===
    let music = this.sound.add('music', {
        loop: true,
        volume: 0.5
    });

    // autoplay restrictions workaround
    this.input.once('pointerdown', () => {
        music.play();
    });
}

function update() {

    // move sky texture for infinite effect
    sky.tilePositionX += 0.2;
    sky.tilePositionY += 0.2;

    // cursor follow mouse
    cursor.x = this.input.x;
    cursor.y = this.input.y;
}