export default class HomeScene extends Phaser.Scene {
    constructor() {
        super("HomeScene");
    }

    preload() {
        // VISUAL ASSETS
        this.load.image("stars", "assets/images/STARS.png");
        this.load.image("floor", "assets/images/FLOOR.png");
        this.load.image("BOARD", "assets/images/BOARD.png");
        this.load.image("SHOP_DOOR", "assets/images/SHOP_DOOR.png");
        this.load.spritesheet("logo", "assets/sprites/LOGO.png", { frameWidth: 290, frameHeight: 141 });
        this.load.spritesheet("door", "assets/sprites/WD_DOOR.png", { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet("ART_DOOR", "assets/sprites/ART_DOOR.png", { frameWidth: 420, frameHeight: 422 });
        this.load.spritesheet("BBO_DOOR", "assets/sprites/BBO_DOOR.png", { frameWidth: 555, frameHeight: 536 });
        this.load.spritesheet("BOOK", "assets/sprites/BOOK.png", { frameWidth: 158, frameHeight: 180 });
        this.load.spritesheet("ECC_DOOR", "assets/sprites/ECC_DOOR.png", { frameWidth: 190, frameHeight: 460 });
        this.load.spritesheet("FORTUNE_DOOR", "assets/sprites/FORTUNE_DOOR.png", { frameWidth: 354, frameHeight: 450 });
        this.load.spritesheet("MM_DOOR", "assets/sprites/MM_DOOR.png", { frameWidth: 400, frameHeight: 395 });
        this.load.spritesheet("RGP_DOOR", "assets/sprites/RGP_DOOR.png", { frameWidth: 461, frameHeight: 460 });

        //AUDIO ASSETS
        this.load.audio("music", "assets/audio/MUSIC.mp3");

        // Example clickable objects
        this.clickables = {
            still: [
                { key: "BOARD", x: 4000, y: 500, url: "https://goodandweirddavis.org" },
                { key: "SHOP_DOOR", x: 4200, y: 400, url: "https://instagram.com/hg_is_me" }
            ],
            animated: [
                { key: "logo", x: 400, y: 500, url: "https://brainmelter.net", frameWidth: 290, frameHeight: 141 },
                { key: "ART_DOOR", x: 800, y: 400, url: "https://instagram.com/hg_is_me", frameWidth: 420, frameHeight: 422 },
                { key: "BBO_DOOR", x: 1200, y: 500, url: "https://brainmelter.itch.io/bebo", frameWidth: 555, frameHeight: 536 },
                { key: "BOOK", x: 1600, y: 400, url: "https://example.com", frameWidth: 158, frameHeight: 180 },
                { key: "ECC_DOOR", x: 2000, y: 500, url: "https://exoticcringeclub.bandcamp.com/", frameWidth: 190, frameHeight: 460 },
                { key: "RGP_DOOR", x: 2400, y: 400, url: "https://www.instagram.com/regular_pleasure", frameWidth: 461, frameHeight: 460 },
                { key: "FORTUNE_DOOR", x: 3200, y: 400, url: "https://brainmelter.itch.io/abz", frameWidth: 354, frameHeight: 450 },
                { key: "MM_DOOR", x: 3600, y: 500, url: "https://brainmelter.itch.io/math-monsters", frameWidth: 400, frameHeight: 395 },
            ],
            moving: [
                { key: "door", x: 300, y: 500, url: "https://instagram.com/weirddreams.zzz", frameWidth: 250, frameHeight: 250, velocityX: 80 }
            ]
        };

        // Preload animated assets
        [...this.clickables.animated, ...this.clickables.moving].forEach(item => {
            this.load.spritesheet(item.key, `assets/animated/${item.key}.png`, { frameWidth: item.frameWidth, frameHeight: item.frameHeight });
        });

        // Preload still assets
        this.clickables.still.forEach(item => this.load.image(item.key, `assets/static/${item.key}.png`));
    }

    create() {
        this.WORLD_WIDTH = 5100;
        this.WORLD_HEIGHT = 720;

        // Zoomed-out camera (900px view instead of 720)
        this.targetViewHeight = 900;
        this.zoom = this.scale.height / this.targetViewHeight;
        this.cameras.main.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
        this.cameras.main.setZoom(this.zoom);

        // Floor & background
        this.stars = this.add.tileSprite(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT, "stars").setOrigin(0);
        this.floor = this.add.image(2500, 720, "floor").setOrigin(0.5, 1);

        /* Logo
        this.logo = this.add.sprite(250, 250, "logo");
        this.anims.create({ key: "logo_anim", frames: this.anims.generateFrameNumbers("logo"), frameRate: 9, repeat: -1 });
        this.logo.play("logo_anim");*/

// Unlock audio by first tap anywhere
const unlockDiv = document.createElement("div");
unlockDiv.style.position = "absolute";
unlockDiv.style.top = "0";
unlockDiv.style.left = "0";
unlockDiv.style.width = "100%";
unlockDiv.style.height = "100%";
unlockDiv.style.zIndex = "9999";
unlockDiv.style.background = "transparent";
document.body.appendChild(unlockDiv);

unlockDiv.addEventListener("pointerdown", () => {
    if (this.sound.locked) this.sound.unlock();
    unlockDiv.remove(); // remove overlay so it doesn't block the canvas
}, { once: true });

        // Music
        this.music = this.sound.add("music", { loop: true });
        this.musicOn = false;
        this.musicText = this.add.text(20, 20, "music off", { font: "24px Arial", color: "#ffffff" })
            .setScrollFactor(0)
            .setDepth(1000)
            .setInteractive();
        this.musicText.on("pointerdown", () => {
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

        

        // Add clickable objects
        this.allClickableObjects = [];

        // Helper to create links
        const createLink = (item, isMoving = false) => {
            let obj;
            if (item.type === "still") obj = this.add.image(item.x, item.y, item.key);
            else obj = this.add.sprite(item.x, item.y, item.key);

            if (item.type !== "still") {
                this.anims.create({ key: item.key + "_anim", frames: this.anims.generateFrameNumbers(item.key), frameRate: 6, repeat: -1 });
                obj.play(item.key + "_anim");
            }

            // Moving objects
            if (isMoving && item.velocityX) {
                this.physics.add.existing(obj);
                obj.body.setVelocityX(item.velocityX).setBounce(1).setCollideWorldBounds(true);
            }

            // HTML overlay
            item.link = document.createElement("a");
            item.link.href = item.url;
            item.link.target = "_blank";
            item.link.classList.add("clickable-link");
            document.body.appendChild(item.link);

            obj.link = item.link;
            this.allClickableObjects.push(obj);
        };

        // Create still objects
        this.clickables.still.forEach(item => { item.type = "still"; createLink(item); });
        // Animated objects
        this.clickables.animated.forEach(item => { item.type = "animated"; createLink(item); });
        // Moving objects
        this.clickables.moving.forEach(item => { item.type = "moving"; createLink(item, true); });

        // Camera scrolling
        this.targetScroll = 0;
        this.maxScroll = this.WORLD_WIDTH - (this.scale.width / this.zoom);

        this.input.on("wheel", (pointer, objects, deltaX, deltaY) => {
            this.targetScroll += deltaY * 2.5;
            this.targetScroll = Phaser.Math.Clamp(this.targetScroll, 0, this.maxScroll);
        });

        this.dragStartX = 0;
        this.cameraStartX = 0;
        this.input.on("pointerdown", pointer => { this.dragStartX = pointer.x; this.cameraStartX = this.targetScroll; });
        this.input.on("pointermove", pointer => {
            if (pointer.isDown) {
                let dragDistance = pointer.x - this.dragStartX;
                this.targetScroll = this.cameraStartX - dragDistance * 2.5;
                this.targetScroll = Phaser.Math.Clamp(this.targetScroll, 0, this.maxScroll);
            }
        });
    }

    update() {
        // Background drift
        this.stars.tilePositionX += 0.3;
        this.stars.tilePositionY -= 0.2;

        // Smooth camera scroll
        this.cameras.main.scrollX = Phaser.Math.Linear(this.cameras.main.scrollX, this.targetScroll, 0.15);

        // Update HTML link positions
        const cam = this.cameras.main;
        this.allClickableObjects.forEach(obj => {
            if (obj.link) {
                obj.link.style.left = (obj.x - cam.scrollX - obj.link.offsetWidth / 2) + "px";
                obj.link.style.top = (obj.y - cam.scrollY - obj.link.offsetHeight / 2) + "px";
            }
        });
    }

    resizeGame() {
        this.zoom = this.scale.height / this.targetViewHeight;
        this.cameras.main.setZoom(this.zoom);
        this.maxScroll = this.WORLD_WIDTH - (this.scale.width / this.zoom);
    }
}