import { Scene } from "phaser"

export default class BootScene extends Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    
  }

  create() {
    this.add.text(
      this.cameras.main.width/2,
      this.cameras.main.height/2,
      "Hello World",
      {
        color: "#fff"
      }
    ).setOrigin(0.5)
  }
  
}