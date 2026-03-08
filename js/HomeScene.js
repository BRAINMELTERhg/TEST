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

this.music = this.sound.add("music",{loop:true})

this.music.play()

this.musicText = this.add.text(
20,
20,
"music on",
{
font:"24px Arial",
fill:"#ffffff"
}
).setScrollFactor(0)

this.musicText.setInteractive()

this.musicOn = true

this.musicText.on("pointerdown",()=>{

if(this.musicOn){

this.music.stop()
this.musicText.setText("music off")
this.musicOn=false

}else{

this.music.play()
this.musicText.setText("music on")
this.musicOn=true

}

})

/* CAMERA SCROLL CONTROL */

this.input.on("wheel",(pointer,dx,dy)=>{

this.cameras.main.scrollX += dy

})

/* MOBILE DRAG */

this.input.on("pointermove",(pointer)=>{

if(pointer.isDown){

this.cameras.main.scrollX -= pointer.velocity.x * 0.02

}

})

}

update(){

/* DIAGONAL STAR DRIFT */

this.stars.tilePositionX += 0.3
this.stars.tilePositionY -= 0.2

}

}