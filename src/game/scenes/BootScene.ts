import { Scene } from "phaser"

export default class BootScene extends Scene {
  constructor(){ super("boot") }

  preload() {
    
  }

  create() {
    this.scene.start("main")
  }

  
}