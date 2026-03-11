export default class HomeScene extends Phaser.Scene {
    constructor() {
        super("HomeScene");
    }

    preload() {
        this.load.image("stars", "assets/images/STARS.png");
        this.load.image("floor", "assets/images/FLOOR.png");
        this.load.spritesheet("logo", "assets/sprites/LOGO.png", { frameWidth: 290, frameHeight: 141 });
        this.load.spritesheet("door", "assets/sprites/WD_DOOR.png", { frameWidth: 250, frameHeight: 250 });
        this.load.audio("music", "assets/audio/MUSIC.mp3");
    }

    create() {
        // World size
        this.WORLD_WIDTH = 5100;
        this.WORLD_HEIGHT = 720;
        this.cameras.main.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
        this.physics.world.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);

        // Camera zoom
        this.resizeGame();
        this.scale.on("resize", this.resizeGame, this);

        // Background
        this.stars = this.add.tileSprite(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT, "stars").setOrigin(0);
        this.floor = this.add.image(2500, 720, "floor").setOrigin(0.5, 1);

        // Logo
        this.logo = this.add.sprite(250, 250, "logo");
        this.anims.create({ key: "logo_anim", frames: this.anims.generateFrameNumbers("logo"), frameRate: 9, repeat: -1 });
        this.logo.play("logo_anim");

        // Door
        this.door = this.physics.add.sprite(300, 500, "door");
        this.anims.create({ key: "door_anim", frames: this.anims.generateFrameNumbers("door"), frameRate: 6, repeat: -1 });
        this.door.play("door_anim");
        this.door.setVelocityX(80).setBounce(1).setCollideWorldBounds(true);

        // Music toggle
        this.music = this.sound.add("music", { loop: true });
        this.musicOn = false;
        this.musicText = this.add.text(20, 20, "music off", { font: "24px Arial", color: "#ffffff" })
            .setScrollFactor(0)
            .setDepth(1000)
            .setInteractive({ useHandCursor: true });

        this.musicText.on("pointerdown", () => {
            if (this.sound.locked) this.sound.unlock();
            if (!this.musicOn) {
                this.music.play();
                this.musicText.setText("music on");
                this.musicOn = true;
            } else {
                this.music.stop();
                this.musicText.setText("music off");
                this.musicOn = false;
            }
        });

        // Door link (works on mobile + desktop)
        this.doorLink = document.createElement("a");
        this.doorLink.href = "https://instagram.com/weirddreams.zzz";
        this.doorLink.target = "_blank";
        this.doorLink.style.position = "absolute";
        this.doorLink.style.width = "170px";
        this.doorLink.style.height = "190px";
        this.doorLink.style.background = "transparent";
        this.doorLink.style.zIndex = 10;
        document.body.appendChild(this.doorLink);

        // Camera scrolling
        this.targetScroll = 0;
        this.maxScroll = this.WORLD_WIDTH - (this.scale.width / this.cameras.main.zoom);

        // Desktop scroll
        this.input.on("wheel", (pointer, objects, deltaX, deltaY) => {
            this.targetScroll += deltaY * 2.5;
            this.targetScroll = Phaser.Math.Clamp(this.targetScroll, 0, this.maxScroll);
        });

        // Mobile drag
        this.dragStartX = 0;
        this.cameraStartX = 0;
        this.input.on("pointerdown", (pointer) => { this.dragStartX = pointer.x; this.cameraStartX = this.targetScroll; });
        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown) {
                let dragDistance = pointer.x - this.dragStartX;
                let speed = 2.5;
                this.targetScroll = this.cameraStartX - dragDistance * speed;
                this.targetScroll = Phaser.Math.Clamp(this.targetScroll, 0, this.maxScroll);
            }
        });
    }

    update() {
        this.stars.tilePositionX += 0.3;
        this.stars.tilePositionY -= 0.2;
        this.cameras.main.scrollX = Phaser.Math.Linear(this.cameras.main.scrollX, this.targetScroll, 0.15);

        // Update HTML door link position to match sprite
        let cam = this.cameras.main;
        this.doorLink.style.left = (this.door.x - cam.scrollX - 85) + "px"; // half width offset
        this.doorLink.style.top = (this.door.y - cam.scrollY - 95) + "px"; // half height offset
    }

    resizeGame() {
        let zoom = this.scale.height / 720;
        this.cameras.main.setZoom(zoom);
        this.maxScroll = this.WORLD_WIDTH - (this.scale.width / zoom);
    }
}