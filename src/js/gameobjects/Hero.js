import * as Phaser from 'phaser'

export default class Hero {
  constructor(scene, x, y, maxHp, speed, baseDmg, range, name, enemies, team) {
  
    this.scene = scene
    this.x = x
    this.y = y
    this.hp = maxHp
    this.range = range
    this.speed = speed
    this.dmg = baseDmg
    this.name = name
    this.enemies = enemies
    this.team = team
    this.alive = true
    this.attacking = false
    this.target = null
    
    
    this.initSprite()

    this.sprite.anims.play("attack")
  }

  initSprite() {
    this.container = this.scene.add.container(this.x, this.y)
    this.scene.physics.world.enable(this.container)
    
    this.sprite = this.scene.add.sprite(0, 0, "aarold")
    this.sprite.setDisplaySize(120, 120)

    if (this.team === "enemy") this.sprite.setFlipX(true)
    
    this.hpBg = this.scene.add
      .rectangle(0, -35, 30, 5, 0x000000)
      .setStrokeStyle(0.5, 0xffffff)
      .setOrigin(0.5)

    this.hpBar = this.scene.add
      .rectangle(-20, -35, 25, 5, this.team == 'team' ? 0xfff000 : 0xff0000)
      .setOrigin(0, 0.5)
    
    this.container.add([this.sprite, this.hpBg, this.hpBar])
    
    if (this.scene.anims.exists('attack')) return
    
    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNumbers('aarold', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers('aarold', { start: 5, end: 8 }),
      frameRate: 6,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNumbers('aarold', { start: 9, end: 14 }),
      frameRate: 10,
      repeat: -1
    })

  }

  distanceTo(other) {
    return Phaser.Math.Distance.Between(this.container.x, this.container.y, other.getX(), other.getY())
  }
  
  findTarget() {
    
    const aliveEnemies = this.enemies.filter(u => u.alive)
  
    if (aliveEnemies.length === 0) { this.target = null; return; }

    let closest = aliveEnemies[0]
    let minDist = this.distanceTo(closest)
    for (const e of aliveEnemies) {
      const d = this.distanceTo(e)
      if (d < minDist) { minDist = d; closest = e; }
    }
    this.target = closest
  }
  
  update(time, delta) {
    
    if (!this.alive || !this.enemies.some(u => u.alive)) return
    
    if (!this.target || !this.target.alive) {
      this.findTarget()
    }

    if (!this.target) return

    const dist = this.distanceTo(this.target);

    if (dist > this.range && !this.attacking) {
        // Jalankan pergerakan
        this.scene.physics.moveTo(this.container, this.target.getX(), this.target.getY(), this.speed);
        
        // Cukup gunakan true di argumen kedua
        this.sprite.anims.play("run", true); 
    } else {
        this.attacking = true;
        
        // Gunakan true juga di sini agar animasi attack tidak ter-restart setiap frame
        this.sprite.anims.play("attack", true);
        
        if (dist < this.range) {
            this.container.body.setVelocity(0);
        }
    }

  }

  tryAttack() {
    
  }

  takeDamage(dmg) {
    
  }

  destroy() {
    
  }

  getX() { return this.container.x }
  getY() { return this.container.y }
  
}