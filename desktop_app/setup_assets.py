import os
from PIL import Image

def convert_to_ico():
    source_path = os.path.join("..", "README_assests", "craftsathi_logo.jpeg")
    target_path = os.path.join("assets", "icon.ico")
    
    if not os.path.exists("assets"):
        os.makedirs("assets")
        
    if os.path.exists(source_path):
        print(f"Converting {source_path} to {target_path}...")
        img = Image.open(source_path)
        # Convert to RGBA if not already
        img = img.convert("RGBA")
        # Save as ICO with multiple sizes for better quality
        img.save(target_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
        print("Success!")
    else:
        print(f"Error: {source_path} not found.")

if __name__ == "__main__":
    convert_to_ico()
