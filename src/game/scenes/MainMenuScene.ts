import { Scene, Geom } from "phaser"
import TopNav from "../../ui/components/TopNav"
import ButtonStart from "../../ui/components/ButtonStart"

export default class MainMenuScene extends Scene {
  constructor(){ 
    super("main") 
  }

  create() {

    const { width, height } = this.scale
    
    const topnav = this.add.dom(width/2, 30)
      .createFromHTML(new TopNav().render(width, height))
    const startBtn = this.add.dom(width/2, height * 0.80)
      .createFromHTML(new ButtonStart().render())
      .addListener("click")
      .on("click", (event) => {
        this.scene.start("game")
      })
    
  }

  
  update(time, delta) {
    
  }
}
