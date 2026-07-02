import { Scene, Sprite } from "phaser"

export default class Item {
  constructor(scene: Scene, x: number, y: number, row: number, col: number, type: string){
    this.x = x
    this.y = y
    this.row = row
    this.col = col
    this.scene = scene
    this.type = type

    this.container = this.scene.add.image(
        this.x + 5,
        this.y + 5,
        this.type
      )
      .setOrigin(0)
      .setDisplaySize(40, 40)
      .setInteractive({ draggable: true })

    this.container.oldX = this.x
    this.container.oldY = this.y
    this.container.row = this.row
    this.container.col = this.col
    this.container.type = this.type
  }

  setX(x) { 
    this.x = x
    this.container.x = x 
  }
  setY(y) { 
    this.y = y
    this.container.y = y
  }
  
  getX() { return this.x }
  getY() { return this.y }

  getRow() { return this.row }
  getCol() { return this.col }

  getType() { return this.type }

  destroy() { this.container.destroy() }
}