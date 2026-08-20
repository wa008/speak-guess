// storage.js — localStorage 封装，管理已用词去重
const Storage = {
  KEY_PREFIX: 'speak-guess-used-',

  getUsedWords(category) {
    try {
      const data = localStorage.getItem(this.KEY_PREFIX + category);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markWordUsed(category, word) {
    const used = this.getUsedWords(category);
    if (!used.includes(word)) {
      used.push(word);
      localStorage.setItem(this.KEY_PREFIX + category, JSON.stringify(used));
    }
  },


  getAllWords(category, difficulty = 'all') {
    const catData = WORD_BANK[category];
    if (!catData) return [];
    let words = [];
    if (difficulty === 'easy' || difficulty === 'all') words = words.concat(catData.easy || []);
    if (difficulty === 'medium' || difficulty === 'all') words = words.concat(catData.medium || []);
    if (difficulty === 'hard' || difficulty === 'all') words = words.concat(catData.hard || []);
    // Fallback for old format
    if (catData.words && (difficulty === 'all' || difficulty === 'easy')) words = words.concat(catData.words);
    return words;
  },

  getRemainingWords(category, difficulty = 'all') {
    const allWords = this.getAllWords(category, difficulty);
    const used = this.getUsedWords(category);
    return allWords.filter(w => !used.includes(w));
  },

  getRemainingCount(category, difficulty = 'all') {
    return this.getRemainingWords(category, difficulty).length;
  },

  getTotalCount(category, difficulty = 'all') {
    return this.getAllWords(category, difficulty).length;
  },


  resetCategory(category) {
    localStorage.removeItem(this.KEY_PREFIX + category);
  },

  resetAll() {
    Object.keys(WORD_BANK).forEach(cat => this.resetCategory(cat));
  },

  // 从多个类别中获取可用词池（已去重）
  getAvailablePool(categories, difficulty = 'all') {
    const pool = [];
    categories.forEach(cat => {
      const remaining = this.getRemainingWords(cat, difficulty);
      remaining.forEach(word => pool.push({ word, category: cat }));
    });
    return pool;
  }
};
