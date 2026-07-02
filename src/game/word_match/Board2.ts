import Phaser from "phaser";

/**
 * @class Board
 * @description Komponen mandiri untuk mengelola grid, input drag-drop, animasi, dan pencocokan kata.
 */
export default class Board {
  /**
   * @param {Phaser.Scene} scene - Referensi ke GameScene utama
   */
  constructor(scene) {
    this.scene = scene;

    // Konfigurasi Grid Papan Permainan
    this.ROWS = 10;
    this.COLS = 8;
    this.SIZE = 40;

    /** @type {Array<Array<Object>>} Array 2D penampung koordinat dan referensi teks */
    this.BOARD = [];
    this.targetWords = [];

    // Batas koordinat untuk rendering grid
    this.startX = 0;
    this.startY = 0;

    this.initDimensions();
    this.createGrid();
    this.initDragEvents();
  }

  /**
   * @description Menghitung dimensi agar posisi grid presisi di tengah layar.
   */
  initDimensions() {
    const totalWidth = this.COLS * this.SIZE;
    const totalHeight = this.ROWS * this.SIZE;
    this.startX = (this.scene.scale.width - totalWidth) / 2 + (this.SIZE / 2);
    this.startY = (this.scene.scale.height - totalHeight) / 2 + (this.SIZE / 2);
  }

  /**
   * @description Membuat visualisasi kotak latar belakang grid.
   */
  createGrid() {
    for (let r = 0; r < this.ROWS; r++) {
      this.BOARD[r] = [];

      for (let c = 0; c < this.COLS; c++) {
        const x = this.startX + c * this.SIZE;
        const y = this.startY + r * this.SIZE;

        const rect = this.scene.add.rectangle(x, y, this.SIZE, this.SIZE, 0xccffff);
        rect.setStrokeStyle(2, 0xffffff);

        this.BOARD[r][c] = { x: x, y: y, row: r, col: c, text: null };
      }
    }
  }

  /**
   * @description Mengisi papan dengan string masukan yang sudah diacak dan mengaktifkan animasi muncul.
   * @param {string} sentences - Kalimat mentah target pencarian.
   */
  fillWords(sentences) {
    // Simpan daftar kata target asli (kondisi lowercase untuk pencocokan aman)
    this.targetWords = sentences.split(" ").map(word => word.toLowerCase().trim()).filter(Boolean);

    const randomized = this.randomizeText(sentences);
    const letters = randomized.replace(/\s+/g, '').toUpperCase();
    let letterIndex = 0;

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (letterIndex >= letters.length) return;

        const currentLetter = letters[letterIndex];
        const posX = this.BOARD[r][c].x;
        const posY = this.BOARD[r][c].y;

        if (!this.BOARD[r][c].text) {
          // Ganti blok pembuatan textElement di dalam metode fillWords dengan ini:
          const textElement = this.scene.add.bitmapText(posX, posY, 'quicksand', currentLetter, 32); // Gunakan ukuran font dasar yang aman (misal: 32)
          
          textElement.setInteractive({ draggable: true });
          textElement.setOrigin(0.5);
          textElement.setTint(0x000000); // Warna hitam aman karena kotak grid kamu warna cerah (0xccffff)
          
          textElement.row = r;
          textElement.col = c;
          
          this.BOARD[r][c].text = textElement;
          
          // Animasi Muncul yang Sudah Diperbaiki
          textElement.alpha = 0;
          textElement.setScale(0); // Mulai dari skala 0
          
          this.scene.tweens.add({
            targets: textElement,
            alpha: 1,
            scaleX: 1, // <--- Amankan dengan nilai skala target normal (100% dari ukuran font 32)
            scaleY: 1, // <--- Amankan dengan nilai skala target normal
            ease: 'Back.easeOut',
            duration: 300,
            delay: letterIndex * 15
          });

          this.applyGravity()
        }
        letterIndex++;
      }
    }
  }

  /**
   * @description Mendaftarkan fungsi callback eksternal saat sebuah kata berhasil dipecahkan.
   * @param {Function} callback - Fungsi penampung parameter string kata yang ditemukan.
   */
  onWordFound(callback) {
    this.wordFoundCallback = callback;
  }

  /**
   * @description Mengatur manajemen penanganan geser pasca lepas klik pointer.
   */
  initDragEvents() {
    this.scene.input.on("dragstart", (pointer, item) => {
      this.scene.tweens.killTweensOf(item);
      item.setDepth(1);
      item.startX = item.x;
      item.startY = item.y;
    });

    this.scene.input.on("drag", (pointer, item, dragX, dragY) => {
      item.x = dragX;
      item.y = dragY;
    });

    this.scene.input.on("dragend", (pointer, item) => {
      item.setDepth(0);
      const targetGrid = this.findTargetGrid(item);

      if (!this.isOnBoard(item)) {
        this.scene.tweens.add({
          targets: item,
          x: item.startX,
          y: item.startY,
          duration: 200,
          ease: 'Quad.easeOut'
        });
        return;
      }

      if (!targetGrid.text) {
        this.moveToEmptySlot(item, targetGrid.row, targetGrid.col);
        this.findWords();
        return;
      }

      this.swapItems(item, targetGrid.text);
      this.findWords();
    });
  }

  moveToEmptySlot(item, row, col) {
    this.BOARD[item.row][item.col].text = null;
    item.row = row;
    item.col = col;
    this.BOARD[row][col].text = item;

    const targetX = this.BOARD[row][col].x;
    const targetY = this.BOARD[row][col].y;

    this.scene.tweens.add({
      targets: item,
      x: targetX,
      y: targetY,
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => {
        item.startX = targetX;
        item.startY = targetY;
      }
    });

    this.scene.sound.play('move', { volume: 0.8 });
  }

  swapItems(item, textTarget) {
    this.scene.tweens.killTweensOf(textTarget);

    const tempRow = item.row;
    const tempCol = item.col;

    item.row = textTarget.row;
    item.col = textTarget.col;
    textTarget.row = tempRow;
    textTarget.col = tempCol;

    this.BOARD[item.row][item.col].text = item;
    this.BOARD[textTarget.row][textTarget.col].text = textTarget;

    const targetItemPos = this.BOARD[item.row][item.col];
    const targetTextPos = this.BOARD[textTarget.row][textTarget.col];

    this.scene.tweens.add({
      targets: item,
      x: targetItemPos.x,
      y: targetItemPos.y,
      duration: 250,
      ease: 'Back.easeOut',
      onComplete: () => {
        item.startX = item.x;
        item.startY = item.y;
      }
    });

    this.scene.tweens.add({
      targets: textTarget,
      x: targetTextPos.x,
      y: targetTextPos.y,
      duration: 250,
      ease: 'Back.easeOut',
      onComplete: () => {
        textTarget.startX = textTarget.x;
        textTarget.startY = textTarget.y;
      }
    });

    this.scene.sound.play('swap', { volume: 0.8 });
  }

  /**
   * @description Memindai formasi matriks huruf horizontal & vertikal untuk mendeteksi kata terdaftar.
   */
  findWords() {
    // 1. Scan Horizontal
    for (let r = 0; r < this.ROWS; r++) {
      let rowString = '';
      let rowItems = [];
  
      for (let c = 0; c < this.COLS; c++) {
        // Jika slot ada dan memiliki teks
        if (this.BOARD[r][c] && this.BOARD[r][c].text) {
          rowString += this.BOARD[r][c].text.text;
          rowItems.push(this.BOARD[r][c].text);
        } else {
          // SLOT KOSONG DITEMUKAN: Cek kata yang terbentuk sebelum slot kosong ini
          this.checkWordMatches(rowString, rowItems);
          
          // Reset pencarian untuk sisa baris setelah slot kosong
          rowString = '';
          rowItems = [];
        }
      }
      // Cek sisa kata di akhir baris (jika ada)
      this.checkWordMatches(rowString, rowItems);
    }
  
    // 2. Scan Vertikal
    for (let c = 0; c < this.COLS; c++) {
      let colString = '';
      let colItems = [];
  
      for (let r = 0; r < this.ROWS; r++) {
        // Jika slot ada dan memiliki teks
        if (this.BOARD[r][c] && this.BOARD[r][c].text) {
          colString += this.BOARD[r][c].text.text;
          colItems.push(this.BOARD[r][c].text);
        } else {
          // SLOT KOSONG DITEMUKAN: Cek kata yang terbentuk sebelum slot kosong ini
          this.checkWordMatches(colString, colItems);
          
          // Reset pencarian untuk sisa kolom setelah slot kosong
          colString = '';
          colItems = [];
        }
      }
      // Cek sisa kata di akhir kolom (jika ada)
      this.checkWordMatches(colString, colItems);
    }
  }
  
  // Fungsi bantu (Helper) untuk mengecek kecocokan kata agar kode tidak berulang (DRY)
  checkWordMatches(searchString, searchItems) {
    if (!searchString) return;
  
    this.targetWords.forEach(word => {
      if (word && searchString.toLowerCase().includes(word)) {
        const startIndex = searchString.toLowerCase().indexOf(word);
        const matchedItems = searchItems.slice(startIndex, startIndex + word.length);
        this.handleWordMatch(word, matchedItems);
      }
    });
  }

  /**
   * @description Mengeksekusi efek destruksi objek teks saat kata ditemukan dan mengosongkan slot pointer.
   * @param {string} word - Kata yang lolos verifikasi.
   * @param {Array<Phaser.GameObjects.Text>} items - Array kumpulan objek huruf pembentuk kata tersebut.
   */
  handleWordMatch(word, items) {
    if (!this.targetWords.includes(word)) return;
    this.targetWords = this.targetWords.filter(w => w !== word);

    let destroyedCount = 0; // Tambahkan counter untuk melacak akhir animasi

    items.forEach(item => {
      if (this.BOARD[item.row][item.col].text === item) {
        this.BOARD[item.row][item.col].text = null;
      }

      this.scene.tweens.add({
        targets: item,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 300,
        ease: 'Back.easeIn',
        onComplete: () => {
          item.destroy();
          destroyedCount++;
          
          // JIKA SEMUA HURUF YANG COCOK SUDAH HANCUR, JALANKAN GRAVITASI
          if (destroyedCount === items.length) {
            this.applyGravity();
          }
        }
      });
    });

    if (this.wordFoundCallback) {
      this.wordFoundCallback(word.toUpperCase());
    }
  }

  /**
   * @description Menjatuhkan huruf-huruf yang menggantung di atas slot kosong (Mekanik Match-3 Gravity)
   */
  applyGravity() {
    let hasMoved = false;
    let longestDropDuration = 0;

    // Pindai per kolom dari kiri ke kanan
    for (let c = 0; c < this.COLS; c++) {
      // Pindai baris dari bawah ke atas (Dimulai dari ROWS - 2 karena baris paling bawah tidak bisa jatuh lagi)
      for (let r = this.ROWS - 2; r >= 0; r--) {
        
        // Jika slot saat ini ada hurufnya
        if (this.BOARD[r][c] && this.BOARD[r][c].text) {
          const textElement = this.BOARD[r][c].text;
          let targetRow = r;

          // Cari seberapa jauh huruf ini bisa jatuh ke bawah (mencari slot null berturut-turut)
          while (targetRow + 1 < this.ROWS && !this.BOARD[targetRow + 1][c].text) {
            targetRow++;
          }

          // Jika posisi target berubah, berarti ada slot kosong di bawahnya
          if (targetRow !== r) {
            // Pindahkan referensi di dalam matriks BOARD
            this.BOARD[r][c].text = null;
            textElement.row = targetRow;
            this.BOARD[targetRow][c].text = textElement;

            const targetX = this.BOARD[targetRow][c].x;
            const targetY = this.BOARD[targetRow][c].y;
            
            // Hitung durasi dinamis berdasarkan seberapa jauh huruf itu jatuh (biar estetik)
            const dropDistance = targetRow - r;
            const duration = dropDistance * 150; 
            if (duration > longestDropDuration) longestDropDuration = duration;

            hasMoved = true;

            // Jalankan animasi jatuh menggunakan Tween
            this.scene.tweens.add({
              targets: textElement,
              x: targetX,
              y: targetY,
              duration: duration,
              ease: 'Bounce.easeOut', // Efek membal sedikit saat menyentuh ubin bawah
              onComplete: () => {
                textElement.startX = targetX;
                textElement.startY = targetY;
              }
            });
          }
        }

      }
    }

    // Jika ada ubin yang jatuh, putar suara efek jatuh dan scan ulang kata setelah animasi selesai
    if (hasMoved) {
      // Pastikan aset suara 'drop' atau sejenisnya sudah di-load di scene Anda jika ingin digunakan
      if (this.scene.sound.get('move')) {
        this.scene.sound.play('move', { volume: 0.5 });
      }

      // Tunggu sampai semua animasi jatuh selesai, lalu cek apakah jatuhan tersebut membentuk kata baru (Combo)
      this.scene.time.delayedCall(longestDropDuration + 50, () => {
        this.findWords();
      });
    }
  }


  isOnBoard(item) {
    const minX = this.startX - (this.SIZE / 2);
    const maxX = this.startX + (this.COLS * this.SIZE) - (this.SIZE / 2);
    const minY = this.startY - (this.SIZE / 2);
    const maxY = this.startY + (this.ROWS * this.SIZE) - (this.SIZE / 2);
    return item.x >= minX && item.x <= maxX && item.y >= minY && item.y <= maxY;
  }

  findTargetGrid(current) {
    let closestGrid = this.BOARD[0][0];
    let minDist = this.getDistance(current, closestGrid);

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const nextGrid = this.BOARD[r][c];
        const distance = this.getDistance(current, nextGrid);
        if (distance < minDist) {
          minDist = distance;
          closestGrid = nextGrid;
        }
      }
    }
    return closestGrid;
  }

  getDistance(current, target) {
    return Phaser.Math.Distance.Between(current.x, current.y, target.x, target.y);
  }

  randomizeText(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }
}
