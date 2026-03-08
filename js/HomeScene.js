export default class HomeScene extends Phaser.Scene{

constructor(){
super("HomeScene")
}

preload(){

this.load.image("stars","assets/images/STARS.png")

this.load.image("floor","assets/images/FLOOR.png")

this.load.spritesheet("logo","assets/sprites/LOGO.png",{
frameWidth:290,
frameHeight:141
})

this.load.spritesheet("door","assets/sprites/WD_DOOR.png",{
frameWidth:250,
frameHeight:250
})

this.load.audio("music","assets/audio/MUSIC.mp3")

}

create(){

/* WORLD SIZE */

this.WORLD_WIDTH = 5100
this.WORLD_HEIGHT = 720

this.cameras.main.setBounds(0,0,this.WORLD_WIDTH,this.WORLD_HEIGHT)
this.physics.world.setBounds(0,0,this.WORLD_WIDTH,this.WORLD_HEIGHT)

/* CAMERA ADJUSTMENT */
this.resizeGame()

this.scale.on("resize", this.resizeGame, this)



/* STAR BACKGROUND */

this.stars = this.add.tileSprite(
0,
0,
this.WORLD_WIDTH,
this.WORLD_HEIGHT,
"stars"
).setOrigin(0)

/* FLOOR */

this.floor = this.add.image(
2500,
720,
"floor"
).setOrigin(0.5,1)

/* LOGO */

this.logo = this.add.sprite(
250,
250,
"logo"
)

this.anims.create({
key:"logo_anim",
frames:this.anims.generateFrameNumbers("logo"),
frameRate:9,
repeat:-1
})

this.logo.play("logo_anim")

/* DOOR */

this.door = this.physics.add.sprite(
300,
500,
"door"
)

this.anims.create({
key:"door_anim",
frames:this.anims.generateFrameNumbers("door"),
frameRate:6,
repeat:-1
})

this.door.play("door_anim")

this.door.setVelocityX(80)
this.door.setCollideWorldBounds(true)
this.door.setBounce(1)

/* CLICKABLE DOOR */

this.door.setInteractive()

this.door.on("pointerdown",()=>{
window.location.href="https://instagram.com/weirddreams.zzz"
})

/* MUSIC */

this.music = this.sound.add("music", { loop: true })
this.musicOn = false  // start OFF

// Music toggle text
this.musicText = this.add.text(20, 20, "music off", { font: "24px Arial", fill: "#ffffff" })
    .setScrollFactor(0)
    .setDepth(1000)
    .setInteractive()

this.musicText.on("pointerdown", () => {
    if(!this.musicOn){
        this.music.play()
        this.musicText.setText("music on")
        this.musicOn = true
    } else {
        this.music.stop()
        this.musicText.setText("music off")
        this.musicOn = false
    }
})

// Unlock audio on first tap/click anywhere
this.input.once("pointerdown", () => {
    if(this.sound.locked){
        this.sound.unlock()
    }
})

/* CAMERA LIMITS */
this.targetScroll = 0
this.maxScroll = this.WORLD_WIDTH - (this.scale.width / (this.scale.height / 720)) // keep zoom scaling

/* SCROLLING */
// DESKTOP: mouse wheel & trackpad
this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
    this.targetScroll += deltaY * 2.5   // adjust speed
    this.targetScroll = Phaser.Math.Clamp(this.targetScroll, 0, this.maxScroll)
})

// MOBILE: touch drag
if(this.sys.game.device.input.touch){

    this.dragStartX = 0
    this.cameraStartX = 0

    this.input.on("pointerdown", (pointer) => {
        this.dragStartX = pointer.x
        this.cameraStartX = this.targetScroll
    })

    this.input.on("pointermove", (pointer) => {
        if(pointer.isDown){
            let dragDistance = pointer.x - this.dragStartX
            this.targetScroll = this.cameraStartX - dragDistance
            this.targetScroll = Phaser.Math.Clamp(this.targetScroll, 0, this.maxScroll)
        }
    })

}


}

update(){

/* DIAGONAL STAR DRIFT */

this.stars.tilePositionX += 0.3
this.stars.tilePositionY -= 0.2

/* SMOOTH SCROLLING */
this.cameras.main.scrollX = Phaser.Math.Linear(
    this.cameras.main.scrollX,
    this.targetScroll,
    0.15
)

}

resizeGame(){

let height = this.scale.height

let zoom = height / 720

this.cameras.main.setZoom(zoom)

this.maxScroll = this.WORLD_WIDTH - (this.scale.width / zoom)

}

}