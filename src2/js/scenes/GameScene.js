import { Scene } from "phaser"

export default class GameScene extends Scene {
  constructor() {
    super("GameScene")
  }

  create() {
    const { width, height } = this.cameras.main
    
    // 1. Tentukan target tinggi background yang kamu mau (seperempat tinggi layar)
    const targetWidth = width
    const targetHeight = height / 4
  
    // 2. Buat tileSprite dengan ukuran penuh sesuai target
    this.bg_jungle = this.add.tileSprite(0, height/2, targetWidth, targetHeight, "bg_jungle").setOrigin(0)
    this.bg_ground = this.add.tileSprite(0, height - targetHeight, targetWidth, targetHeight, "background").setOrigin(0)
  
    // 3. Ambil ukuran asli dari file gambar yang di-load
    const texture = this.textures.get("bg_jungle").getSourceImage()
    const originalWidth = texture.width
    const originalHeight = texture.height
  
    // 4. Hitung rasio perbandingannya
    const scaleX = targetWidth / originalWidth
    const scaleY = targetHeight / originalHeight
  
    // 5. Terapkan skala agar gambar pas (stretch) sesuai ukuran tileSprite
    this.bg_jungle.tileScaleX = scaleX
    this.bg_jungle.tileScaleY = scaleY
  
    // --- Sisa kode player dan animasimu ---
    const player = this.add.sprite(width / 4, height - height/4, "tan")
    player.setDisplaySize(50, 70)
  
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('tan', { start: 0, end: 15 }),
      frameRate: 30,
      repeat: -1
    })
  
    player.anims.play("run")
  }


  // 2. Tambahkan fungsi update() untuk menggerakkan background
  update(time, delta) {
    // Menggeser posisi X dari tekstur background sebesar 2 piksel setiap frame
    // Ubah angka 2 untuk mempercepat atau memperlambat (misal: 0.5, 1, 5)
    this.bg_jungle.tilePositionX += 0.4 * delta
    this.bg_ground.tilePositionX += 0.1 * delta
  }
}
