from PIL import Image, ImageDraw, ImageFilter

def make_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Crop 15 pixels from the bottom to remove the stray dark/white line
    # Also crop a bit from other sides just in case
    img = img.crop((5, 5, width-5, height-15))
    width, height = img.size
    
    from collections import deque
    
    # Seed points from all edges
    seed_points = []
    for x in range(width):
        seed_points.append((x, 0))
        seed_points.append((x, height-1))
    for y in range(1, height-1):
        seed_points.append((0, y))
        seed_points.append((width-1, y))
    
    q = deque(seed_points)
    visited = set(seed_points)
    
    data = list(img.getdata())
    alpha_data = [255] * len(data)
    
    # Very aggressive threshold for "whitish/greyish" background pixels
    threshold = 220
    
    while q:
        x, y = q.popleft()
        idx = y * width + x
        
        pixel = data[idx]
        # If any channel is high or it's generally bright
        if pixel[0] > threshold and pixel[1] > threshold and pixel[2] > threshold:
            alpha_data[idx] = 0
            
            # Check 8-neighbors for better removal of diagonal lines
            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0), (1,1), (1,-1), (-1,1), (-1,-1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    q.append((nx, ny))

    # Apply alpha channel and also clean up ANY pixel that is very white regardless of connectivity
    # (to remove those middle-of-nowhere white specs the user mentioned)
    new_data = []
    for i in range(len(data)):
        p = data[i]
        # If it's pure white or very close, make it transparent
        if p[0] > 245 and p[1] > 245 and p[2] > 245:
             new_data.append((255, 255, 255, 0))
        else:
             new_data.append((p[0], p[1], p[2], alpha_data[i]))
        
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    import sys
    make_transparent(sys.argv[1], sys.argv[2])
