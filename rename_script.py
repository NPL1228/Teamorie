import os
import re

root_dir = "."

replacements = {
    "TreamAI": "Teamorie",
    "Treamai": "Teamorie",
    "treamai": "teamorie",
    "TREAMAI": "TEAMORIE"
}

exclude_dirs = [".git", "node_modules", "__pycache__", ".venv", "venv", "chroma_db", ".gemini"]
exclude_files = ["rename_script.py", "fyp.db", "package-lock.json"]

count = 0

for dirpath, dirnames, filenames in os.walk(root_dir):
    # Exclude directories
    dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
    
    for filename in filenames:
        if filename in exclude_files or filename.endswith(".db") or filename.endswith(".sqlite3") or filename.endswith(".png") or filename.endswith(".jpg"):
            continue
            
        filepath = os.path.join(dirpath, filename)
        
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                
            original_content = content
            for old, new in replacements.items():
                content = content.replace(old, new)
                
            if content != original_content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {filepath}")
                count += 1
        except UnicodeDecodeError:
            # Skip binary files
            pass
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

print(f"Total files updated: {count}")
