import { Scene } from "phaser"

export default class BootScene extends Scene {
  constructor(){ super("boot") }

  preload() {
    this.load.image("map", "assets/images/backgrounds/map.png")
    
    this.load.bitmapFont("quicksand", "assets/fonts/quicksand/font.png", "assets/fonts/quicksand/font.xml")   
    
    this.load.audio("move", "assets/audios/move.wav")
    this.load.audio("swap", "assets/audios/swipe.wav")
    this.load.audio("success", "assets/audios/word_success.wav")
  }

  create() {
    this.scene.start("game")
  }

  
}