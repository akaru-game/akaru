import { Scene } from "phaser"

export default class InitScene extends Scene {
  constructor(){ super("init") }

  preload() {
    
  }

  create() {
    this.scene.start("boot")
  }
}