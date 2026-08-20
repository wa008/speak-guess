import json
import os

categories = {
    'animal': {'name': '动物', 'icon': '🐱'},
    'food': {'name': '食物', 'icon': '🍜'},
    'daily': {'name': '日常用品', 'icon': '🔧'},
    'job': {'name': '职业', 'icon': '👨‍⚕️'},
    'sport': {'name': '运动', 'icon': '⚽'},
    'movie': {'name': '影视/明星', 'icon': '🎬'},
    'idiom': {'name': '成语', 'icon': '📖'},
    'place': {'name': '地点/城市', 'icon': '🏙️'},
    'medical': {'name': '医学', 'icon': '🏥'},
    'campus': {'name': '校园', 'icon': '🎓'},
    'tech': {'name': '科技', 'icon': '💻'}
}

base_dir = '/Users/benson/code/jiacheclub/speak-guess/js/words_json_v2'

output = "const WORD_BANK = {\n"

for cat, meta in categories.items():
    json_path = os.path.join(base_dir, f"{cat}.json")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading {json_path}: {e}")
        data = {}
    
    easy = json.dumps(data.get('easy', []), ensure_ascii=False)
    medium = json.dumps(data.get('medium', []), ensure_ascii=False)
    hard = json.dumps(data.get('hard', []), ensure_ascii=False)
    
    output += f"  {cat}: {{\n"
    output += f"    name: '{meta['name']}',\n"
    output += f"    icon: '{meta['icon']}',\n"
    output += f"    easy: {easy},\n"
    output += f"    medium: {medium},\n"
    output += f"    hard: {hard}\n"
    output += "  },\n"

output += "};\n"

with open('/Users/benson/code/jiacheclub/speak-guess/js/words.js', 'w', encoding='utf-8') as f:
    f.write(output)

print("Generated words.js v2 successfully.")
