import { Scene } from "phaser"

export default class BootScene extends Scene {
  constructor(){ super("boot") }

  preload() {
    this.load.image("map", "public/assets/images/backgrounds/map.png")
  }

  create() {
    this.scene.start("main")
  }

  
}