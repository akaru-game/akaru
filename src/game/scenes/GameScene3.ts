import Phaser, { Scene } from "phaser";

/**
 * @class GameScene
 * @extends Phaser.Scene
 * @description Mengatur logika papan permainan acak kata dengan animasi transisi yang halus.
 */
export default class GameScene extends Scene {
  constructor() {
    super('game');
    
    // Konfigurasi Grid Papan Permainan
    this.ROWS = 8;
    this.COLS = 8;
    this.SIZE = 40;
    
    /** @type {Array<Array<Object>>} Array 2D penampung data koordinat dan referensi teks */
    this.BOARD = []; 
    
    // Batas koordinat untuk rendering grid
    this.startX = 0;
    this.startY = 0;
    this.totalWidth = 0;
    this.totalHeight = 0;

    // Kalimat target yang harus dicari pemain
    this.sentences = "Halo"
  }

  create() {
    // 1. Kalkulasi ukuran dimensi layar agar posisi grid otomatis di tengah
    this.totalWidth = this.COLS * this.SIZE;
    this.totalHeight = this.ROWS * this.SIZE;
    this.startX = (this.scale.width - this.totalWidth) / 2 + (this.SIZE / 2);
    this.startY = (this.scale.height - this.totalHeight) / 2 + (this.SIZE / 2);
    
    // 2. Inisialisasi struktur komponen visual permainan
    this.createGrid();
    this.fillWords(this.randomizeText(this.sentences));

    // 3. Registrasi Input Event untuk mekanisme Drag & Drop Objek Teks Huruf
    this.initDragEvents();
  }

  /**
   * @description Membuat visualisasi grid serta menginisialisasi matriks data array 2D.
   */
  createGrid() {
    for (let r = 0; r < this.ROWS; r++) {
      this.BOARD[r] = []; 
      
      for (let c = 0; c < this.COLS; c++) {
        const x = this.startX + c * this.SIZE;
        const y = this.startY + r * this.SIZE;
        
        // Render background visual kotak di board
        const rect = this.add.rectangle(x, y, this.SIZE, this.SIZE, 0x423737);
        rect.setStrokeStyle(2, 0xffffff);

        // Alokasi slot data grid
        this.BOARD[r][c] = { x: x, y: y, row: r, col: c, text: null };
      }
    }
  }

  /**
   * @description Menyebarkan karakter huruf dari string ke petak grid awal dengan animasi fade-in & scale-up.
   * @param {string} sentences - Kalimat target masukan yang akan dipecah.
   */
  fillWords(sentences) {
    const letters = sentences.replace(/\s+/g, '').toUpperCase();
    let letterIndex = 0;

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (letterIndex >= letters.length) return;
        
        const currentLetter = letters[letterIndex];
        const posX = this.BOARD[r][c].x;
        const posY = this.BOARD[r][c].y;

        if (!this.BOARD[r][c].text) {
          const textElement = this.add.text(posX, posY, currentLetter, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff3366cc', 
            fontWeight: 'bold',
            padding: 8
          });

          textElement.setDisplaySize(this.SIZE, this.SIZE);
          textElement.setInteractive({ draggable: true });
          textElement.setOrigin(0.5);

          // Simpan koordinat indeks internal pada objek teks huruf
          textElement.row = r;
          textElement.col = c;

          // Ikat objek ke referensi BOARD
          this.BOARD[r][c].text = textElement;

          // --- ANIMASI 1: MUNCUL (FADE IN & SCALE UP) ---
          textElement.alpha = 0;
          textElement.setScale(0);
          
          this.tweens.add({
            targets: textElement,
            alpha: 1,
            scaleX: this.SIZE / textElement.width,
            scaleY: this.SIZE / textElement.height,
            ease: 'Back.easeOut',
            duration: 300,
            delay: letterIndex * 15 // Efek berurutan (stagger) yang estetik
          });
        }
        letterIndex++;
      }
    }
  }

  /**
   * @description Mendaftarkan event listener pointer Phaser untuk drag dan drop item teks.
   */
  initDragEvents() {
    this.input.on("dragstart", (pointer, item) => {
      // Hentikan animasi berjalan pada item ini jika pengguna buru-buru men-drag kembali
      this.tweens.killTweensOf(item);

      item.setDepth(1); // Ambil kedalaman layar terdepan saat diangkat
      item.startX = item.x;
      item.startY = item.y;
    });

    this.input.on("drag", (pointer, item, dragX, dragY) => {
      item.x = dragX;
      item.y = dragY;
    });

    this.input.on("dragend", (pointer, item) => {
      item.setDepth(0); // Kembalikan level kedalaman visual ke normal
      
      // Ambil metadata grid terdekat dari titik drop koordinat item
      const targetGrid = this.findTargetGrid(item);
      
      // Validasi 1: Jika objek ditarik ke luar dari area board game, pulangkan dengan animasi slide
      if (!this.isOnBoard(item)) {
        this.tweens.add({
          targets: item,
          x: item.startX,
          y: item.startY,
          duration: 200,
          ease: 'Quad.easeOut'
        });
        return;
      }

      // Validasi 2: Jika target grid kosong, pindahkan secara langsung (slide animation)
      if (!targetGrid.text) {
        this.moveToEmptySlot(item, targetGrid.row, targetGrid.col);
        this.findWords();
        return;
      }

      // Validasi 3: Jika target grid memiliki isi huruf lain, lakukan tukar posisi (swap animation)
      this.swapItems(item, targetGrid.text);
      this.findWords();
    });
  }

  /**
   * @description Memindahkan posisi objek huruf ke koordinat slot kosong yang baru dengan animasi sliding.
   * @param {Phaser.GameObjects.Text} item - Objek teks huruf yang digeser.
   * @param {number} row - Indeks baris tujuan.
   * @param {number} col - Indeks kolom tujuan.
   */
  moveToEmptySlot(item, row, col) {
    // Kosongkan referensi slot lama
    this.BOARD[item.row][item.col].text = null;
  
    // Perbarui penunjuk indeks baru internal item
    item.row = row;
    item.col = col;
  
    // Daftarkan item ke alamat slot yang baru di BOARD
    this.BOARD[row][col].text = item;
  
    // Beri efek snap animasi agar posisi pas di tengah kotak grid terdaftar
    const targetX = this.BOARD[row][col].x;
    const targetY = this.BOARD[row][col].y;
  
    // --- ANIMASI 2: BERGESER (SLIDING TO EMPTY SLOT) ---
    this.tweens.add({
      targets: item,
      x: targetX,
      y: targetY,
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // Amankan koordinat jangkar snap awal baru setelah animasi selesai
        item.startX = targetX;
        item.startY = targetY;
      }
    });
  }

  /**
   * @description Menukar posisi visual dan referensi matriks data dari dua objek huruf secara silang menggunakan animasi.
   * @param {Phaser.GameObjects.Text} item - Objek huruf aktif pertama yang di-drag.
   * @param {Phaser.GameObjects.Text} textTarget - Objek huruf statis kedua yang ditabrak.
   */
  swapItems(item, textTarget) {
    // Hentikan animasi aktif pada target jika ada
    this.tweens.killTweensOf(textTarget);

    const tempRow = item.row;
    const tempCol = item.col;
  
    // Tukar memori data alamat koordinat grid internal
    item.row = textTarget.row;
    item.col = textTarget.col;
    textTarget.row = tempRow;
    textTarget.col = tempCol;
  
    // Sinkronisasi data pointer di dalam array matriks BOARD
    this.BOARD[item.row][item.col].text = item;
    this.BOARD[textTarget.row][textTarget.col].text = textTarget;
  
    // Jalur posisi pemindahan objek ke layar game
    const targetItemPos = this.BOARD[item.row][item.col]; 
    const targetTextPos = this.BOARD[textTarget.row][textTarget.col]; 
  
    // --- ANIMASI 3: BERGANTI / TUKAR (CROSS SWAP ANIMATION) ---
    this.tweens.add({
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

    this.tweens.add({
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
  }

  /**
   * @description Memastikan apakah koordinat piksel item saat ini berada di dalam batas perimeter papan.
   * @param {Phaser.GameObjects.Text} item - Objek target cek posisi.
   * @returns {boolean} Benar jika berada di batas wilayah papan permainan.
   */
  isOnBoard(item) {
    const minX = this.startX - (this.SIZE / 2);
    const maxX = this.startX + (this.COLS * this.SIZE) - (this.SIZE / 2);
    const minY = this.startY - (this.SIZE / 2);
    const maxY = this.startY + (this.ROWS * this.SIZE) - (this.SIZE / 2);
  
    return item.x >= minX && item.x <= maxX && item.y >= minY && item.y <= maxY;
  }

  /**
   * @description Mendeteksi slot data petak BOARD terdekat berdasarkan posisi drop pointer terkini.
   * @param {Object} current - Titik posisi koordinat acuan (mengandung properti x dan y).
   * @returns {Object} Data entitas grid terdekat hasil loop perbandingan jarak linear.
   */
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

  /**
   * @description Mengkalkulasi jarak euclidean lintasan lurus antara dua objek.
   * @param {Object} current - Titik titik awal.
   * @param {Object} target - Titik titik tujuan.
   * @returns {number} Hasil kalkulasi skalar jarak pixel.
   */
  getDistance(current, target) {
    return Phaser.Math.Distance.Between(current.x, current.y, target.x, target.y);            
  }

  /**
   * @description Menandai dan mencocokkan formasi huruf pada board secara garis horizontal & vertikal.
   */
  findWords() {
    const targetWords = this.sentences.split(" ").map(word => word.toLowerCase().trim());
  
    // ANALISIS GRID SECARA HORIZONTAL (Per Baris)
    for (let r = 0; r < this.ROWS; r++) {
      let rowString = '';
      
      for (let c = 0; c < this.COLS; c++) {
        if (this.BOARD[r][c] && this.BOARD[r][c].text) {
          rowString += this.BOARD[r][c].text.text;
        }
      }
  
      targetWords.forEach(word => {
        if (word && rowString.toLowerCase().includes(word)) {
          console.log(`Kata "${word.toUpperCase()}" ditemukan SECARA HORIZONTAL di baris ke-${r}`);
        }
      });
    }
  
    // ANALISIS GRID SECARA VERTIKAL (Per Kolom)
    for (let c = 0; c < this.COLS; c++) {
      let colString = '';
      
      for (let r = 0; r < this.ROWS; r++) {
        if (this.BOARD[r][c] && this.BOARD[r][c].text) {
          colString += this.BOARD[r][c].text.text;
        }
      }
  
      targetWords.forEach(word => {
        if (word && colString.toLowerCase().includes(word)) {
          console.log(`Kata "${word.toUpperCase()}" ditemukan SECARA VERTIKAL di kolom ke-${c}`);
        }
      });
    }
  }

  /**
   * @description Mengacak urutan string menggunakan algoritma Fisher-Yates.
   */
  randomizeText(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  removeItems(items) {
    console.log(items);
  }
}
