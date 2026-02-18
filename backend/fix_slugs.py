import sqlite3
import re

def slugify(text):
    """Convert text to URL-friendly slug."""
    text = text.lower()
    # Replace accented characters
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
        'ñ': 'n', 'ç': 'c',
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    # Replace spaces and special chars with hyphens
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text

conn = sqlite3.connect('designs.db')
c = conn.cursor()

# Get all products
c.execute("SELECT id, name, slug FROM products")
products = c.fetchall()

print("Current products:")
for pid, name, slug in products:
    print(f"  ID: {pid[:8]}... | Name: {name} | Slug: '{slug}'")

print("\nFixing empty slugs...")
for pid, name, slug in products:
    if not slug:
        new_slug = slugify(name)
        c.execute("UPDATE products SET slug = ? WHERE id = ?", (new_slug, pid))
        print(f"  Updated '{name}' -> slug: '{new_slug}'")

conn.commit()

# Verify
print("\nAfter fix:")
c.execute("SELECT id, name, slug, is_active FROM products")
for row in c.fetchall():
    print(f"  {row}")

conn.close()
print("\nDone!")
