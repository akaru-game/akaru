import { Scene, Geom } from "phaser"
import TopNav from "../../ui/components/TopNav"
import MapMarkerInfo from "../../ui/components/MapMarkerInfo"

export default class MainMenuScene extends Scene {
  constructor(){ 
    super("main") 
  }

  create() {

    const mapWidth = 900
    const mapHeight = 459
    const { width, height } = this.scale

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)

    this.createMap(mapWidth, mapHeight)

    this.enablePan()
  }

  createMap(width, height) {
    this.add.tileSprite(0, 0, width, height, "map").setOrigin(0, 0)
    
    const topnav = this.add.dom(this.scale.width/2, 30)
      .createFromHTML(new TopNav().render(width, height))
      .setScrollFactor(0)

  }

  
  enablePan() {
    // Logika mendeteksi pointer (bisa jari atau klik mouse)
    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return // Jika tidak sedang ditekan/disentuh, abaikan

      // Geser kamera berdasarkan pergerakan pointer (dikali 1 atau lebih untuk sensitivitas)
      this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x)
      this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y)
    })
  }
  
  update(time, delta) {
    
  }
}
