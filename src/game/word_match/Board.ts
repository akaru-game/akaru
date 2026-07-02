import Phaser from "phaser";
import { GridHelper } from "../../helper/GridHelper";
import { MatchHelper } from "../../helper/MatchHelper";

export default class Board {
  constructor(scene) {
    this.scene = scene;

    // Konfigurasi Utama
    this.ROWS = 8;
    this.COLS = 8;
    this.SIZE = 40;

    this.BOARD = [];
    this.targetWords = [];

    // Menggunakan helper koordinat dimensi
    const coords = GridHelper.getStartCoordinates(this.scene, this.COLS, this.ROWS, this.SIZE);
    this.startX = coords.startX;
    this.startY = coords.startY;

    this.createGrid();
    this.initDragEvents();
  }

  createGrid() {
    for (let r = 0; r < this.ROWS; r++) {
      this.BOARD[r] = [];
      for (let c = 0; c < this.COLS; c++) {
        const x = this.startX + c * this.SIZE;
        const y = this.startY + r * this.SIZE;

        const rect = this.scene.add.rectangle(x, y, this.SIZE, this.SIZE, 0xccffff);
        rect.setStrokeStyle(2, 0xffffff);

        this.BOARD[r][c] = { x, y, row: r, col: c, text: null };
      }
    }
  }

  fillWords(sentences) {
    this.targetWords = sentences.split(" ").map(w => w.toLowerCase().trim()).filter(Boolean);
    const randomized = GridHelper.randomizeText(sentences);
    const letters = randomized.replace(/\s+/g, '').toUpperCase();
    let letterIndex = 0;

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (letterIndex >= letters.length) break; // Gunakan break agar loop luar tahu jika sudah selesai

        const currentLetter = letters[letterIndex];
        const { x, y } = this.BOARD[r][c];

        if (!this.BOARD[r][c].text) {
          const bgRect = this.scene.add.rectangle(0, 0, this.SIZE - 4, this.SIZE - 4, 0x00ffff);
          const textElement = this.scene.add.bitmapText(0, 0, 'quicksand', currentLetter, 32);
          textElement.setOrigin(0.5).setTint(0xffffff);
        
          const tileContainer = this.scene.add.container(x, y, [bgRect, textElement]);
          
          tileContainer.setSize(this.SIZE, this.SIZE);
          tileContainer.setInteractive({ draggable: true });
          
          // Nonaktifkan drag sementara waktu sampai game benar-benar siap (setelah gravitasi selesai)
          this.scene.input.setDraggable(tileContainer, false); 
        
          tileContainer.row = r;
          tileContainer.col = c;
          tileContainer.text = currentLetter; 
        
          this.BOARD[r][c].text = tileContainer;
        }
        letterIndex++;
      }
    }

    // PENTING: Aktifkan gravitasi setelah semua huruf awal selesai dipasang di grid!
    this.applyGravity(true); // Kirim parameter true untuk menandakan ini pengisian awal (initial setup)
  }


  onWordFound(callback) {
    this.wordFoundCallback = callback;
  }

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
      const targetGrid = GridHelper.findTargetGrid(item, this.BOARD, this.ROWS, this.COLS);

      if (!GridHelper.isOnBoard(item, this.startX, this.startY, this.COLS, this.ROWS, this.SIZE)) {
        this.animateToPosition(item, item.startX, item.startY, 200, 'Quad.easeOut');
        return;
      }

      if (!targetGrid.text) {
        this.moveToEmptySlot(item, targetGrid.row, targetGrid.col);
      } else {
        this.swapItems(item, targetGrid.text);
      }
      this.findWords();
    });
  }

  animateToPosition(target, x, y, duration, ease, onComplete = null) {
    this.scene.tweens.add({
      targets: target,
      x, y, duration, ease,
      onComplete: () => {
        target.startX = x;
        target.startY = y;
        if (onComplete) onComplete();
      }
    });
  }

  moveToEmptySlot(item, row, col) {
    this.BOARD[item.row][item.col].text = null;
    item.row = row;
    item.col = col;
    this.BOARD[row][col].text = item;

    this.animateToPosition(item, this.BOARD[row][col].x, this.BOARD[row][col].y, 200, 'Quad.easeOut');
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

    this.animateToPosition(item, this.BOARD[item.row][item.col].x, this.BOARD[item.row][item.col].y, 250, 'Back.easeOut');
    this.animateToPosition(textTarget, this.BOARD[textTarget.row][textTarget.col].x, this.BOARD[textTarget.row][textTarget.col].y, 250, 'Back.easeOut');
    this.scene.sound.play('swap', { volume: 0.8 });
  }

  findWords() {
    MatchHelper.scanForWords(this.BOARD, this.ROWS, this.COLS, this.targetWords, (word, items) => {
      this.handleWordMatch(word, items);
    });
  }

  handleWordMatch(word, items) {
    if (!this.targetWords.includes(word)) return;
    this.targetWords = this.targetWords.filter(w => w !== word);

    let destroyedCount = 0;
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
          if (destroyedCount === items.length) {
            this.applyGravity();
          }
        }
      });
    });

    if (this.wordFoundCallback) {
      this.wordFoundCallback(word.toUpperCase());
      this.scene.sound.play('success', { volume: 0.8 });
    }
  }

  applyGravity(isInitial = false) {
    let hasMoved = false;
    let longestDropDuration = 0;

    for (let c = 0; c < this.COLS; c++) {
      for (let r = this.ROWS - 2; r >= 0; r--) {
        if (this.BOARD[r][c] && this.BOARD[r][c].text) {
          const textElement = this.BOARD[r][c].text;
          let targetRow = r;

          while (targetRow + 1 < this.ROWS && !this.BOARD[targetRow + 1][c].text) {
            targetRow++;
          }

          if (targetRow !== r) {
            this.BOARD[r][c].text = null;
            textElement.row = targetRow;
            this.BOARD[targetRow][c].text = textElement;

            const targetX = this.BOARD[targetRow][c].x;
            const targetY = this.BOARD[targetRow][c].y;
            
            // Variasi durasi berdasarkan jarak jatuh
            const duration = (targetRow - r) * 150;
            if (duration > longestDropDuration) longestDropDuration = duration;

            hasMoved = true;
            this.animateToPosition(textElement, targetX, targetY, duration, 'Bounce.easeOut'); 
          }
        }
      }
    }

    if (hasMoved) {
      if (this.scene.sound.get('move')) this.scene.sound.play('move', { volume: 0.5 });
      
      this.scene.time.delayedCall(longestDropDuration + 50, () => {
        if (isInitial) {
          // Jika ini loading awal, aktifkan semua drag pada ubin setelah selesai jatuh
          this.enableAllDrags();
        }
        // Tetap lakukan scan kata setelah ubin berhenti bergerak
        this.findWords();
      });
    } else {
      // Jika dari awal tidak ada yang bergerak (papan sudah padat di bawah)
      if (isInitial) {
        this.enableAllDrags();
        this.findWords();
      }
    }
  }

  // Fungsi pembantu baru untuk mengaktifkan kembali input drag
  enableAllDrags() {
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (this.BOARD[r][c].text) {
          this.scene.input.setDraggable(this.BOARD[r][c].text, true);
        }
      }
    }
  }

}
