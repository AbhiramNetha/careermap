import os
from PIL import Image

gif_path = "levelup.gif"
output_dir = "levelup_frames"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

try:
    with Image.open(gif_path) as im:
        frame = 0
        while True:
            # Create a white background image because GIFs might have transparent backgrounds
            new_frame = Image.new("RGBA", im.size, "WHITE")
            new_frame.paste(im, (0,0), im.convert("RGBA"))
            # Save as highest quality WebP to save space and load faster in browser
            frame_path = os.path.join(output_dir, f"frame_{frame:04d}.webp")
            new_frame.convert("RGB").save(frame_path, "WEBP", quality=80)
            frame += 1
            im.seek(im.tell() + 1)
except EOFError:
    pass # End of sequence
print(f"Extracted {frame} frames successfully.")
