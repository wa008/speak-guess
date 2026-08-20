// game.js — 游戏核心逻辑
const Game = {
  // 时长配置：时长(秒)、可跳过次数、及格阈值
  DURATIONS: [
    { seconds: 180, label: '3 分钟', skips: 6, threshold: 8 },
    { seconds: 300, label: '5 分钟', skips: 10, threshold: 14 },
    { seconds: 480, label: '8 分钟', skips: 16, threshold: 22 },
  ],

  // 游戏状态
  state: {
    view: 'home',         // home | category | difficulty | duration | playing | result
    selectedCats: [],      // 选中的类别
    difficulty: 'all',     // 难度 easy | hard | all
    durationIdx: 0,        // 时长索引
    pool: [],              // 当前词池 (shuffled)
    poolIndex: 0,          // 当前词索引
    currentWord: null,     // 当前词
    timer: null,           // 计时器
    timeLeft: 0,           // 剩余秒数
    totalTime: 0,          // 总时长
    skipsLeft: 2,          // 剩余跳过次数
    correct: [],           // 猜对的词
    skipped: [],           // 跳过的词
  },

  // 初始化
  init() {
    this.bindEvents();
    this.showView('home');
    this.updateResetInfo();
  },

  // 视图切换
  showView(name) {
    this.state.view = name;
    document.querySelectorAll('.view').forEach(el => {
      el.classList.toggle('active', el.id === 'view-' + name);
    });
    if (name === 'category') this.renderCategories();
    if (name === 'duration') this.renderDurations();
    if (name === 'result') this.renderResult();
  },

  // 绑定事件
  bindEvents() {
    // 首页
    document.getElementById('btn-start').addEventListener('click', () => this.showView('category'));
    document.getElementById('btn-reset').addEventListener('click', () => this.handleReset());

    // 类别页
    document.getElementById('btn-cat-next').addEventListener('click', () => this.onCategoryNext());
    document.getElementById('btn-cat-back').addEventListener('click', () => this.showView('home'));

    // 难度页
    document.getElementById('btn-diff-back').addEventListener('click', () => this.showView('category'));
    document.querySelectorAll('#diff-grid .dur-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.state.difficulty = e.currentTarget.dataset.diff;
        this.showView('duration');
      });
    });

    // 时长页
    document.getElementById('btn-dur-back').addEventListener('click', () => this.showView('difficulty'));

    // 游戏页
    document.getElementById('btn-correct').addEventListener('click', () => this.onCorrect());
    document.getElementById('btn-skip').addEventListener('click', () => this.onSkip());

    // 结算页
    document.getElementById('btn-again').addEventListener('click', () => this.showView('category'));
    document.getElementById('btn-home').addEventListener('click', () => this.showView('home'));
  },

  // 渲染类别选择
  renderCategories() {
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
  },

  toggleCategory(key, card) {
    const idx = this.state.selectedCats.indexOf(key);
    if (idx > -1) {
      this.state.selectedCats.splice(idx, 1);
      card.classList.remove('selected');
    } else {
      this.state.selectedCats.push(key);
      card.classList.add('selected');
    }
    this.updateCatNextBtn();
  },

  updateCatNextBtn() {
    const btn = document.getElementById('btn-cat-next');
    btn.disabled = this.state.selectedCats.length === 0;
  },

  onCategoryNext() {
    if (this.state.selectedCats.length === 0) return;
    this.showView('difficulty');
  },

  // 渲染时长选择
  renderDurations() {
    const grid = document.getElementById('dur-grid');
    grid.innerHTML = '';

    this.DURATIONS.forEach((d, idx) => {
      const card = document.createElement('div');
      card.className = 'dur-card';
      card.innerHTML = `
        <span class="dur-time">${d.label}</span>
        <span class="dur-detail">可跳过 ${d.skips} 次 · 目标 ${d.threshold} 词</span>
      `;
      card.addEventListener('click', () => this.startGame(idx));
      grid.appendChild(card);
    });
  },

  // 开始游戏
  startGame(durationIdx) {
    const dur = this.DURATIONS[durationIdx];
    const pool = Storage.getAvailablePool(this.state.selectedCats, this.state.difficulty);

    if (pool.length === 0) {
      alert('所选类别在该难度下已无可用词，请重置词库或选择其他类别/难度。');
      return;
    }

    // 洗牌
    this.shuffle(pool);

    this.state.durationIdx = durationIdx;
    this.state.pool = pool;
    this.state.poolIndex = 0;
    this.state.timeLeft = dur.seconds;
    this.state.totalTime = dur.seconds;
    this.state.skipsLeft = dur.skips;
    this.state.correct = [];
    this.state.skipped = [];
    this.state.currentWord = null;

    this.showView('playing');
    this.nextWord();
    this.startTimer();
  },

  // 下一个词
  nextWord() {
    if (this.state.poolIndex >= this.state.pool.length) {
      // 词池用完
      this.endGame();
      return;
    }
    const item = this.state.pool[this.state.poolIndex];
    this.state.currentWord = item;
    this.state.poolIndex++;

    document.getElementById('current-word').textContent = item.word;
    document.getElementById('word-category').textContent = WORD_BANK[item.category].icon + ' ' + WORD_BANK[item.category].name;
    this.updateSkipBtn();
    this.updateScore();
  },

  // 猜对
  onCorrect() {
    if (!this.state.currentWord) return;
    Storage.markWordUsed(this.state.currentWord.category, this.state.currentWord.word);
    this.state.correct.push(this.state.currentWord);
    this.updateScore();
    this.nextWord();
  },

  // 跳过
  onSkip() {
    if (!this.state.currentWord || this.state.skipsLeft <= 0) return;
    this.state.skipsLeft--;
    this.state.skipped.push(this.state.currentWord);
    // 跳过的词不标记为已用
    this.updateSkipBtn();
    this.updateScore();
    this.nextWord();
  },

  updateSkipBtn() {
    const btn = document.getElementById('btn-skip');
    btn.disabled = this.state.skipsLeft <= 0;
    btn.querySelector('.skip-count').textContent = this.state.skipsLeft;
  },

  updateScore() {
    document.getElementById('score-display').textContent = this.state.correct.length;
  },

  // 计时器
  startTimer() {
    this.updateTimerDisplay();
    this.state.timer = setInterval(() => {
      this.state.timeLeft--;
      this.updateTimerDisplay();
      if (this.state.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const min = Math.floor(this.state.timeLeft / 60);
    const sec = this.state.timeLeft % 60;
    document.getElementById('timer-text').textContent = `${min}:${sec.toString().padStart(2, '0')}`;

    const progress = (this.state.timeLeft / this.state.totalTime) * 100;
    document.getElementById('timer-bar').style.width = progress + '%';

    // 变色：最后30秒变红
    const bar = document.getElementById('timer-bar');
    if (this.state.timeLeft <= 30) {
      bar.classList.add('danger');
    } else if (this.state.timeLeft <= 60) {
      bar.classList.add('warning');
      bar.classList.remove('danger');
    } else {
      bar.classList.remove('warning', 'danger');
    }
  },

  // 结束游戏
  endGame() {
    clearInterval(this.state.timer);
    this.state.timer = null;
    this.showView('result');
  },

  // 渲染结算
  renderResult() {
    const dur = this.DURATIONS[this.state.durationIdx];
    const correctCount = this.state.correct.length;
    const skippedCount = this.state.skipped.length;
    const passed = correctCount >= dur.threshold;

    document.getElementById('result-correct').textContent = correctCount;
    document.getElementById('result-skipped').textContent = skippedCount;
    document.getElementById('result-threshold').textContent = dur.threshold;

    const badge = document.getElementById('result-badge');
    badge.textContent = passed ? '🎉 达标！' : '😅 继续加油';
    badge.className = 'result-badge ' + (passed ? 'pass' : 'fail');

    // 猜对的词列表
    const list = document.getElementById('result-words');
    list.innerHTML = '';
    this.state.correct.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'result-word-tag';
      tag.textContent = item.word;
      list.appendChild(tag);
    });

    // 跳过的词列表
    const skipList = document.getElementById('result-skipped-words');
    skipList.innerHTML = '';
    if (this.state.skipped.length > 0) {
      this.state.skipped.forEach(item => {
        const tag = document.createElement('span');
        tag.className = 'result-word-tag skipped';
        tag.textContent = item.word;
        skipList.appendChild(tag);
      });
      document.getElementById('skipped-section').style.display = '';
    } else {
      document.getElementById('skipped-section').style.display = 'none';
    }
  },

  // 重置词库
  handleReset() {
    if (confirm('确定要重置所有词库记录吗？重置后所有词可以重新出现。')) {
      Storage.resetAll();
      this.updateResetInfo();
      alert('词库已重置！');
    }
  },

  updateResetInfo() {
    const el = document.getElementById('total-remaining');
    if (!el) return;
    let total = 0, remaining = 0;
    Object.keys(WORD_BANK).forEach(k => {
      total += Storage.getTotalCount(k, 'all');
      remaining += Storage.getRemainingCount(k, 'all');
    });
    el.textContent = `词库: ${remaining}/${total}`;
  },

  // 洗牌算法
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => Game.init());
