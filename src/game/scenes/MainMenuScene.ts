import { Scene } from "phaser"

export default class MainMenuScene extends Scene {
  constructor(){ 
    super("main") 

    
  }

  create() {

    const { width, height } = this.scale

    const dom = `<button class="bg-red-500 px-10 py-5 rounded-full font-bold">Start</button>`

    this.add.dom(width/2, height-100).createFromHTML(dom).setOrigin(0.5)
    
    
  }

  update(time, delta) {
    
  }
}