import struct, zlib

def create_png(size, bg_r, bg_g, bg_b, mark_r, mark_g, mark_b):
    width = height = size
    raw_data = b''
    center = size // 2
    mark_size = size // 4
    
    for y in range(height):
        raw_data += b'\x00'
        for x in range(width):
            dx = abs(x - center)
            dy = abs(y - center)
            if dx + dy <= mark_size:
                raw_data += bytes([mark_r, mark_g, mark_b, 255])
            else:
                raw_data += bytes([bg_r, bg_g, bg_b, 255])
    
    compressed = zlib.compress(raw_data)
    
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = zlib.crc32(c) & 0xffffffff
        return struct.pack('>I', len(data)) + c + struct.pack('>I', crc)
    
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr = chunk(b'IHDR', ihdr_data)
    idat = chunk(b'IDAT', compressed)
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend

bg = (0x1a, 0x27, 0x44)
mark = (0xf5, 0xc5, 0x18)

for sz, name in [(192, 'icon-192.png'), (512, 'icon-512.png'), (32, 'icon-32.png'), (16, 'icon-16.png')]:
    png = create_png(sz, *bg, *mark)
    with open(name, 'wb') as f:
        f.write(png)
    print(f'Created {name} ({len(png)} bytes)')
