import re

# Read the README
with open(r'c:\Users\kuyag\OneDrive\Desktop\Final\Final\README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the duplicate old flowchart content between the subprocess diagrams and Step-by-Step section
# Pattern: Find content after the Analytics subprocess closing ``` and before the Step-by-Step section
pattern = r'(style UserAction fill:#ffd93d\r?\n```\r?\n\r?\n---\r?\n)\r?\n---\r?\n\r?\n### 📋 Step-by-Step Flow Explanations\r?\n\r?\n\s+Login.*?(?=### 📋 Step-by-Step Flow Explanations)'

content = re.sub(pattern, r'\1\n\n### 📋 Step-by-Step Flow Explanations\n', content, flags=re.DOTALL)

# Write back
with open(r'c:\Users\kuyag\OneDrive\Desktop\Final\Final\README.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleaned successfully!")
