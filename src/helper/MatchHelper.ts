export const MatchHelper = {
  /**
   * Memindai seluruh baris, kolom, dan diagonal untuk menemukan kecocokan kata target.
   */
  scanForWords(board, rows, cols, targetWords, onMatchFound) {
    // 1. Scan Horizontal (HANYA Kiri -> Kanan) -> allowReverse = false
    for (let r = 0; r < rows; r++) {
      let rowString = '';
      let rowItems = [];
      for (let c = 0; c < cols; c++) {
        if (board[r][c] && board[r][c].text) {
          rowString += board[r][c].text.text;
          rowItems.push(board[r][c].text);
        } else {
          this.checkWordMatches(rowString, rowItems, targetWords, onMatchFound, false);
          rowString = '';
          rowItems = [];
        }
      }
      this.checkWordMatches(rowString, rowItems, targetWords, onMatchFound, false);
    }

    // 2. Scan Vertikal (Atas -> Bawah & Bawah -> Atas) -> allowReverse = true
    for (let c = 0; c < cols; c++) {
      let colString = '';
      let colItems = [];
      for (let r = 0; r < rows; r++) {
        if (board[r][c] && board[r][c].text) {
          colString += board[r][c].text.text;
          colItems.push(board[r][c].text);
        } else {
          this.checkWordMatches(colString, colItems, targetWords, onMatchFound, true);
          colString = '';
          colItems = [];
        }
      }
      this.checkWordMatches(colString, colItems, targetWords, onMatchFound, true);
    }

    // 3. Scan Diagonal Utama (HANYA Kiri-Atas -> Kanan-Bawah ↘) -> allowReverse = false
    for (let d = -cols + 1; d < rows; d++) {
      let diagString = '';
      let diagItems = [];
      for (let r = 0; r < rows; r++) {
        let c = r - d;
        if (c >= 0 && c < cols) {
          if (board[r][c] && board[r][c].text) {
            diagString += board[r][c].text.text;
            diagItems.push(board[r][c].text);
          } else {
            this.checkWordMatches(diagString, diagItems, targetWords, onMatchFound, false);
            diagString = '';
            diagItems = [];
          }
        }
      }
      this.checkWordMatches(diagString, diagItems, targetWords, onMatchFound, false);
    }

    // 4. Scan Diagonal Anti (HANYA Kiri-Bawah -> Kanan-Atas ↗) -> allowReverse = false
    // Perulangan baris dibalik (dari bawah ke atas: rows - 1 menuju 0)
    for (let d = 0; d < rows + cols - 1; d++) {
      let diagString = '';
      let diagItems = [];
      for (let r = rows - 1; r >= 0; r--) {
        let c = d - r;
        if (c >= 0 && c < cols) {
          if (board[r][c] && board[r][c].text) {
            diagString += board[r][c].text.text;
            diagItems.push(board[r][c].text);
          } else {
            this.checkWordMatches(diagString, diagItems, targetWords, onMatchFound, false);
            diagString = '';
            diagItems = [];
          }
        }
      }
      this.checkWordMatches(diagString, diagItems, targetWords, onMatchFound, false);
    }
  },

  /**
   * Fungsi pembantu internal untuk mengevaluasi substring dengan kontrol arah mundur.
   */
  checkWordMatches(searchString, searchItems, targetWords, onMatchFound, allowReverse = true) {
    if (!searchString) return;

    const lowerString = searchString.toLowerCase();

    targetWords.forEach(word => {
      if (!word) return;
      const lowerWord = word.toLowerCase();

      // --- A. PENCOCOKAN ARAH MAJU ---
      if (lowerString.includes(lowerWord)) {
        const startIndex = lowerString.indexOf(lowerWord);
        const matchedItems = searchItems.slice(startIndex, startIndex + word.length);
        onMatchFound(word, matchedItems);
      }

      // --- B. PENCOCOKAN ARAH MUNDUR (Hanya untuk Vertikal Bawah ke Atas) ---
      if (allowReverse) {
        const reversedWord = lowerWord.split('').reverse().join('');
        if (lowerString.includes(reversedWord)) {
          const startIndex = lowerString.indexOf(reversedWord);
          const matchedItems = searchItems
            .slice(startIndex, startIndex + word.length)
            .reverse();
          
          onMatchFound(word, matchedItems);
        }
      }
    });
  }
};
