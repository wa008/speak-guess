import re

with open('/Users/benson/code/jiacheclub/speak-guess/index.html', 'r') as f:
    content = f.read()

diff_section = """
  <!-- 选难度 -->
  <section id="view-difficulty" class="view">
    <div class="container">
      <div class="page-header">
        <button id="btn-diff-back" class="btn btn-icon">←</button>
        <h2>选择难度</h2>
        <span></span>
      </div>
      <p class="hint">难度越高，词语越抽象生僻</p>
      <div id="diff-grid" class="dur-grid">
        <div class="dur-card" data-diff="easy">
          <span class="dur-time">✅ 简单</span>
          <span class="dur-detail">常见高频词，轻松愉快</span>
        </div>
        <div class="dur-card" data-diff="hard">
          <span class="dur-time">🔥 困难</span>
          <span class="dur-detail">生僻词与抽象概念，挑战默契</span>
        </div>
        <div class="dur-card" data-diff="all">
          <span class="dur-time">🔀 随机混合</span>
          <span class="dur-detail">简单与困难随机出现</span>
        </div>
      </div>
    </div>
  </section>
"""

content = content.replace('<!-- 选时长 -->', diff_section + '\n  <!-- 选时长 -->')

with open('/Users/benson/code/jiacheclub/speak-guess/index.html', 'w') as f:
    f.write(content)
