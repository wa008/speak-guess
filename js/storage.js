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

  getRemainingWords(category) {
    const allWords = WORD_BANK[category]?.words || [];
    const used = this.getUsedWords(category);
    return allWords.filter(w => !used.includes(w));
  },

  getRemainingCount(category) {
    return this.getRemainingWords(category).length;
  },

  getTotalCount(category) {
    return WORD_BANK[category]?.words.length || 0;
  },

  resetCategory(category) {
    localStorage.removeItem(this.KEY_PREFIX + category);
  },

  resetAll() {
    Object.keys(WORD_BANK).forEach(cat => this.resetCategory(cat));
  },

  // 从多个类别中获取可用词池（已去重）
  getAvailablePool(categories) {
    const pool = [];
    categories.forEach(cat => {
      const remaining = this.getRemainingWords(cat);
      remaining.forEach(word => pool.push({ word, category: cat }));
    });
    return pool;
  }
};
