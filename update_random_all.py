import re

with open('/Users/benson/code/jiacheclub/speak-guess/js/game.js', 'r') as f:
    content = f.read()

old_click = """      randomCard.addEventListener('click', () => {
         // 随机挑选 2-4 个类别
         const pickCount = Math.min(availableCats.length, Math.floor(Math.random() * 3) + 2);
         const shuffled = [...availableCats];
         this.shuffle(shuffled);
         this.state.selectedCats = shuffled.slice(0, pickCount);
         this.renderCategories(); // 重新渲染以高亮选中的类别
      });"""

new_click = """      randomCard.addEventListener('click', () => {
         // 包含所有的类别
         this.state.selectedCats = [...availableCats];
         this.renderCategories(); // 重新渲染以高亮所有选中的类别
      });"""

content = content.replace(old_click, new_click)

with open('/Users/benson/code/jiacheclub/speak-guess/js/game.js', 'w') as f:
    f.write(content)

print("Random behavior updated to select all.")
