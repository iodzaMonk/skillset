
import os
import glob
import re

components_dir = 'components/ui'
search_dirs = ['app', 'features', 'components', 'lib']

components = [f for f in os.listdir(components_dir) if f.endswith('.tsx')]
unused = []

for comp in components:
    comp_name = comp[:-4] # remove .tsx
    # Import pattern: components/ui/comp_name
    pattern = f"components/ui/{comp_name}"

    found = False
    for root_dir in search_dirs:
        for root, dirs, files in os.walk(root_dir):
            for file in files:
                if not (file.endswith('.tsx') or file.endswith('.ts')):
                    continue

                filepath = os.path.join(root, file)
                # Skip the component file itself
                if filepath == os.path.join(components_dir, comp):
                    continue

                try:
                    with open(filepath, 'r') as f:
                        content = f.read()
                        if pattern in content:
                            found = True
                            break
                except Exception:
                    continue
            if found:
                break
        if found:
            break

    if not found:
        unused.append(os.path.join(components_dir, comp))

print("Unused components:")
for u in unused:
    print(u)
