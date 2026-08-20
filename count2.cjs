const fs = require('fs');
let code = fs.readFileSync('/Users/benson/code/jiacheclub/speak-guess/js/words.js', 'utf8');
code = code.replace('const WORD_BANK', 'var WORD_BANK');
eval(code);
let total = 0;
for (const k in WORD_BANK) {
  const easyCount = WORD_BANK[k].easy ? WORD_BANK[k].easy.length : 0;
  const mediumCount = WORD_BANK[k].medium ? WORD_BANK[k].medium.length : 0;
  const hardCount = WORD_BANK[k].hard ? WORD_BANK[k].hard.length : 0;
  const c = easyCount + mediumCount + hardCount;
  total += c;
  console.log(`${WORD_BANK[k].icon} ${WORD_BANK[k].name}: ${c} 词 (简单: ${easyCount}, 中等: ${mediumCount}, 困难: ${hardCount})`);
}
console.log(`---\n总计: ${total} 词`);
