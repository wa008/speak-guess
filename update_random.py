import re

with open('/Users/benson/code/jiacheclub/speak-guess/js/game.js', 'r') as f:
    content = f.read()

old_render = """  renderCategories() {
    const grid = document.getElementById('cat-grid');
    grid.innerHTML = '';

    Object.keys(WORD_BANK).forEach(key => {
      const cat = WORD_BANK[key];
      const remaining = Storage.getRemainingCount(key, 'all');
      const total = Storage.getTotalCount(key, 'all');
      const exhausted = remaining === 0;

      const card = document.createElement('div');
      card.className = 'cat-card' + (this.state.selectedCats.includes(key) ? ' selected' : '') + (exhausted ? ' exhausted' : '');
      card.dataset.cat = key;
      card.innerHTML = `
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-count">${remaining}/${total}</span>
      `;

      if (!exhausted) {
        card.addEventListener('click', () => this.toggleCategory(key, card));
      }

      grid.appendChild(card);
    });

    this.updateCatNextBtn();
  },"""

new_render = """  renderCategories() {
    const grid = document.getElementById('cat-grid');
    grid.innerHTML = '';
    const availableCats = [];

    Object.keys(WORD_BANK).forEach(key => {
      const cat = WORD_BANK[key];
      const remaining = Storage.getRemainingCount(key, 'all');
      const total = Storage.getTotalCount(key, 'all');
      const exhausted = remaining === 0;

      if (!exhausted) availableCats.push(key);

      const card = document.createElement('div');
      card.className = 'cat-card' + (this.state.selectedCats.includes(key) ? ' selected' : '') + (exhausted ? ' exhausted' : '');
      card.dataset.cat = key;
      card.innerHTML = `
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-count">${remaining}/${total}</span>
      `;

      if (!exhausted) {
        card.addEventListener('click', () => this.toggleCategory(key, card));
      }

      grid.appendChild(card);
    });

    // 添加“随机”选项
    if (availableCats.length > 0) {
      const randomCard = document.createElement('div');
      randomCard.className = 'cat-card';
      randomCard.style.borderStyle = 'dashed';
      randomCard.style.borderColor = 'rgba(255,255,255,0.6)';
      randomCard.innerHTML = `
        <span class="cat-icon">🎲</span>
        <span class="cat-name">随机</span>
        <span class="cat-count">帮你选</span>
      `;
      randomCard.addEventListener('click', () => {
         // 随机挑选 2-4 个类别
         const pickCount = Math.min(availableCats.length, Math.floor(Math.random() * 3) + 2);
         const shuffled = [...availableCats];
         this.shuffle(shuffled);
         this.state.selectedCats = shuffled.slice(0, pickCount);
         this.renderCategories(); // 重新渲染以高亮选中的类别
      });
      grid.appendChild(randomCard);
    }

    this.updateCatNextBtn();
  },"""

content = content.replace(old_render, new_render)

with open('/Users/benson/code/jiacheclub/speak-guess/js/game.js', 'w') as f:
    f.write(content)

print("game.js updated for random category.")
