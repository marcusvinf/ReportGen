import os
from datetime import datetime
upload_folder = "images_folder"
CHUNK_SIZE = 4096

def save_file_in_chunks(file):
    
    os.makedirs(upload_folder, exist_ok=True)
    filename, file_extension = os.path.splitext(file.filename)
    name = f"{filename}_{datetime.now().strftime('%d_%m_%Y_%Hh_%Mm_%Ss')}.{file_extension}"

    file_path = os.path.join(upload_folder, name)

    with open(file_path, "wb") as fh:
        while True:
            chunk = file.stream.read(CHUNK_SIZE)
            if (not chunk):
                break
            fh.write(chunk)

    return file_path, file_extension.strip('.')