with open('/Users/benson/code/jiacheclub/speak-guess/js/storage.js', 'r') as f:
    content = f.read()

old_getAll = """  getAllWords(category, difficulty = 'all') {
    const catData = WORD_BANK[category];
    if (!catData) return [];
    let words = [];
    if (difficulty === 'easy' || difficulty === 'all') words = words.concat(catData.easy || []);
    if (difficulty === 'hard' || difficulty === 'all') words = words.concat(catData.hard || []);
    // Fallback for old format
    if (catData.words && (difficulty === 'all' || difficulty === 'easy')) words = words.concat(catData.words);
    return words;
  },"""

new_getAll = """  getAllWords(category, difficulty = 'all') {
    const catData = WORD_BANK[category];
    if (!catData) return [];
    let words = [];
    if (difficulty === 'easy' || difficulty === 'all') words = words.concat(catData.easy || []);
    if (difficulty === 'medium' || difficulty === 'all') words = words.concat(catData.medium || []);
    if (difficulty === 'hard' || difficulty === 'all') words = words.concat(catData.hard || []);
    // Fallback for old format
    if (catData.words && (difficulty === 'all' || difficulty === 'easy')) words = words.concat(catData.words);
    return words;
  },"""

content = content.replace(old_getAll, new_getAll)

with open('/Users/benson/code/jiacheclub/speak-guess/js/storage.js', 'w') as f:
    f.write(content)
