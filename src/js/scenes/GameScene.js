import { Scene } from "phaser"

export default class GameScene extends Scene {
  constructor() {
    super("GameScene")
  }

  create(){
    this.add.text(
      this.scale.width/2,
      this.scale.height/2,
      "Hello World",
      {
        color: "#ffffff"
      }
    )
  }
}