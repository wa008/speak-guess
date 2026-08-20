import re

with open('/Users/benson/code/jiacheclub/speak-guess/js/game.js', 'r') as f:
    content = f.read()

old_durations = """  DURATIONS: [
    { seconds: 180, label: '3 分钟', skips: 6, threshold: 8 },
    { seconds: 300, label: '5 分钟', skips: 10, threshold: 14 },
    { seconds: 480, label: '8 分钟', skips: 16, threshold: 22 },
  ],"""

new_durations = """  DURATIONS: [
    { seconds: 120, label: '2 分钟', skips: 4, threshold: 5 },
    { seconds: 180, label: '3 分钟', skips: 6, threshold: 8 },
    { seconds: 300, label: '5 分钟', skips: 10, threshold: 14 },
  ],"""

content = content.replace(old_durations, new_durations)

with open('/Users/benson/code/jiacheclub/speak-guess/js/game.js', 'w') as f:
    f.write(content)

print("Durations updated successfully.")
