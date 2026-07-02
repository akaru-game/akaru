import Phaser from "phaser";

export const GridHelper = {
  /**
   * Menghitung offset startX dan startY agar grid selalu presisi di tengah layar.
   */
  getStartCoordinates(scene, cols, rows, size) {
    const totalWidth = cols * size;
    const totalHeight = rows * size;
    const startX = (scene.scale.width - totalWidth) / 2 + (size / 2);
    const startY = ((scene.scale.height * 1.25 ) - totalHeight) / 2 + (size / 2);
    return { startX, startY };
  },

  /**
   * Memeriksa apakah suatu objek koordinat berada di dalam batasan papan permainan.
   */
  isOnBoard(item, startX, startY, cols, rows, size) {
    const minX = startX - (size / 2);
    const maxX = startX + (cols * size) - (size / 2);
    const minY = startY - (size / 2);
    const maxY = startY + (rows * size) - (size / 2);
    return item.x >= minX && item.x <= maxX && item.y >= minY && item.y <= maxY;
  },

  /**
   * Mencari slot koordinat grid terdekat berdasarkan posisi x dan y suatu objek.
   */
  findTargetGrid(current, board, rows, cols) {
    let closestGrid = board[0][0];
    let minDist = Phaser.Math.Distance.Between(current.x, current.y, closestGrid.x, closestGrid.y);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nextGrid = board[r][c];
        const distance = Phaser.Math.Distance.Between(current.x, current.y, nextGrid.x, nextGrid.y);
        if (distance < minDist) {
          minDist = distance;
          closestGrid = nextGrid;
        }
      }
    }
    return closestGrid;
  },

  /**
   * Mengacak urutan karakter di dalam string (Fisher-Yates Shuffle).
   */
  randomizeText(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }
};
