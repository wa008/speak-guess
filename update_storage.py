with open('/Users/benson/code/jiacheclub/speak-guess/js/storage.js', 'r') as f:
    content = f.read()

new_methods = """
  getAllWords(category, difficulty = 'all') {
    const catData = WORD_BANK[category];
    if (!catData) return [];
    let words = [];
    if (difficulty === 'easy' || difficulty === 'all') words = words.concat(catData.easy || []);
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
"""

import re
content = re.sub(r'  getRemainingWords\(category\).*?getTotalCount\(category\) \{.*?\},', new_methods, content, flags=re.DOTALL)

content = content.replace(
"""  getAvailablePool(categories) {
    const pool = [];
    categories.forEach(cat => {
      const remaining = this.getRemainingWords(cat);""",
"""  getAvailablePool(categories, difficulty = 'all') {
    const pool = [];
    categories.forEach(cat => {
      const remaining = this.getRemainingWords(cat, difficulty);"""
)

with open('/Users/benson/code/jiacheclub/speak-guess/js/storage.js', 'w') as f:
    f.write(content)
