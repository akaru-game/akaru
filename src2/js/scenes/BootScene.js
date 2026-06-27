import Phaser from "phaser"

const { Scene } = Phaser

export default class BootScene extends Scene {
  constructor() {
    super("BootScene")
  }

  preload() {

    
    const { width, height } = this.cameras.main
    const barWidth = width - 200
    
    const container = this.add.container(100, height - 60)

    const text = this.add
      .text(barWidth / 2, -20, "Loading...", {
        color: "#fff",
        font: "16px Monospace",
      })
      .setOrigin(0.5)

    const progressBg = this.add
      .rectangle(barWidth / 2, 0, barWidth, 5, 0xfff000)
      .setStrokeStyle(1, 0xffffff)
      .setOrigin(0.5)

    const progressBar = this.add
      .rectangle(0, 0, 0, 5, 0x000000)
      .setOrigin(0, 0.5)

    container.add([text, progressBg, progressBar])

    // Update progress bar sesuai progress loading asset
    this.load.on("progress", (value) => {
      progressBar.width = barWidth * value
    })

    this.load.on("complete", () => {
      this.cameras.main.fadeOut(500, 0, 0)
    })

    this.load.image("bg_jungle", "assets/background/bg_jungle.png")
    this.load.image("background", "assets/background/bg.png")

    
    // Contoh load single image dari URL dummy
    this.load.image("logo", "assets/imgs/logo.png")

    // Contoh load beberapa image sekaligus
    
    this.load.spritesheet("tan", "assets/sprites/heroes/tan.png", {
      frameWidth: 140,
      frameHeight: 260,
    })

    
  }

  create() {
    
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start("GameScene")
      }
    )
  }
}