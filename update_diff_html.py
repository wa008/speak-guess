with open('/Users/benson/code/jiacheclub/speak-guess/index.html', 'r') as f:
    content = f.read()

old_grid = """      <div id="diff-grid" class="dur-grid">
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
      </div>"""

new_grid = """      <div id="diff-grid" class="dur-grid">
        <div class="dur-card" data-diff="easy">
          <span class="dur-time">✅ 简单</span>
          <span class="dur-detail">常见高频词，轻松愉快</span>
        </div>
        <div class="dur-card" data-diff="medium">
          <span class="dur-time">🌟 中等</span>
          <span class="dur-detail">进阶词汇，考验一定默契</span>
        </div>
        <div class="dur-card" data-diff="hard">
          <span class="dur-time">🔥 困难</span>
          <span class="dur-detail">生僻词与抽象概念，终极挑战</span>
        </div>
        <div class="dur-card" data-diff="all">
          <span class="dur-time">🔀 随机混合</span>
          <span class="dur-detail">各难度随机出现</span>
        </div>
      </div>"""

content = content.replace(old_grid, new_grid)

with open('/Users/benson/code/jiacheclub/speak-guess/index.html', 'w') as f:
    f.write(content)
