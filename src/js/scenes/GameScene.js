import { Scene } from "phaser"
import Hero from '../gameobjects/Hero'

export default class GameScene extends Scene {
  constructor() {
    super('GameScene')
    
    this.playerhero = []
    this.enemyhero = []
    this.isPlaying = false
  }

  create() {
    this.heroes = [
      {
        role: 'archer1',
        name: '',
        hp: 250,
        speed: 20,
        range: 250,
        dmg: 60
      },
      {
        role: 'archer2',
        name: '',
        hp: 260,
        speed: 20,
        range: 250,
        dmg: 58
      },
      {
        role: 'fighter1',
        name: '',
        hp: 400,
        speed: 40,
        range: 100,
        dmg: 40
      },
      {
        role: 'fighter2',
        name: '',
        hp: 450,
        speed: 40,
        range: 100,
        dmg: 35
      },
      {
        role: 'tank',
        name: '',
        hp: 500,
        speed: 45,
        range: 100,
        dmg: 15
      }
    ]
    this.enemies = [
      {
        role: 'archer1',
        name: '',
        hp: 250,
        speed: 20,
        range: 250,
        dmg: 60
      },
      {
        role: 'archer2',
        name: '',
        hp: 260,
        speed: 20,
        range: 250,
        dmg: 58
      },
      {
        role: 'fighter1',
        name: '',
        hp: 400,
        speed: 40,
        range: 100,
        dmg: 40
      },
      {
        role: 'fighter2',
        name: '',
        hp: 450,
        speed: 40,
        range: 100,
        dmg: 35
      },
      {
        role: 'tank',
        name: '',
        hp: 500,
        speed: 45,
        range: 100,
        dmg: 15
      }
    ]
    this.createLayout()
    this.initGame()
  }

  createLayout() {
    this.add.image(0, 0, "background")
      .setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff)
      .setOrigin(0)
      .setDisplaySize(this.scale.width, this.scale.height)
    
  }

  initGame() {
    
    this.createSpawnFormation()
    this.isPlaying = true
  }

  createSpawnFormation() {
    this.heroes.forEach(hero => {
      let positions
      if (hero.role == 'archer1') {
        positions = this.getArcher1Position('player')
      } else if (hero.role == 'archer2') {
        positions = this.getArcher2Position('player')
      } else if (hero.role == 'fighter1') {
        positions = this.getFighter1Position('player')
      } else if (hero.role == 'fighter2') {
        positions = this.getFighter2Position('player')
      } else if (hero.role == 'tank') {
        positions = this.getTankPosition('player')
      }
      this.playerhero.push(new Hero(
        this,
        positions.x,
        positions.y,
        hero.hp,
        hero.speed,
        hero.dmg,
        hero.range,
        hero.name,
        this.enemyhero,
        'team'
      ))
    })

    this.enemies.forEach(hero => {
      let positions
      if (hero.role == 'archer1') {
        positions = this.getArcher1Position('enemy')
      } else if (hero.role == 'archer2') {
        positions = this.getArcher2Position('enemy')
      } else if (hero.role == 'fighter1') {
        positions = this.getFighter1Position('enemy')
      } else if (hero.role == 'fighter2') {
        positions = this.getFighter2Position('enemy')
      } else if (hero.role == 'tank') {
        positions = this.getTankPosition('enemy')
      }
      this.enemyhero.push(new Hero(
        this,
        positions.x,
        positions.y,
        hero.hp,
        hero.speed,
        hero.dmg,
        hero.range,
        hero.name,
        this.playerhero,
        'enemy'
      ))
    })
  }

  getArcher1Position(hero) {
    let x = hero == 'player' ? 130 : this.scale.width - 130
    let y = 130
    return { x, y }
  }

  getArcher2Position(hero) {
    let x = hero == 'player' ? 130 : this.scale.width - 130
    let y = this.scale.height - 130
    return { x, y }
  }

  getFighter1Position(hero) {
    let x = hero == 'player' ? 240 : this.scale.width - 240
    let y = 80
    return { x, y }
  }

  getFighter2Position(hero) {
    let x = hero == 'player' ? 240 : this.scale.width - 240
    let y = this.scale.height - 80
    return { x, y }
  }

  getTankPosition(hero) {
    let x = hero == 'player' ? 240 : this.scale.width - 240
    let y = this.scale.height / 2
    return { x, y }
  }
  
  update(time, delta) {
    if (this.isPlaying) {
      [...this.playerhero, ...this.enemyhero].forEach(u => {
        if (!u.alive) return
        try {
          u.update(time, delta)
        } catch (error) {
          alert(error)
        }
      })
    }
  }
}