import os
import json
import http.server
import socketserver
import webbrowser

'''
def find_htm_files(start_dir):
    htm_map = {}
    for root, dirs, files in os.walk(start_dir):
        htm_files = [f for f in files if f.endswith('.htm')]
        if htm_files:
            dir_parts = root.split(os.sep)
            current_level = htm_map
            for part in dir_parts[1:-1]:
                if part not in current_level:
                    current_level[part] = {}
                current_level = current_level[part]
            last_part = dir_parts[-1]
            current_level[last_part] = htm_files
    return htm_map

'''
def save_to_json(htm_map, filename='./assets/file_index/index.json'):
    with open(filename, 'w') as f:
        json.dump(htm_map, f, indent=4)

def find_htm_files(start_dir):
    result = {}

    for root, dirs, files in os.walk(start_dir):
        htm_files = [file for file in files if file.endswith('.htm') or file.endswith('.html')]
        if htm_files:
            # Get the relative path and split it into directory structure
            relative_path = os.path.relpath(root, start_dir)
            dir_structure = relative_path.split(os.sep) if relative_path != '.' else []
            
            # Use the first part of the directory structure as the base key
            base_dir_name = dir_structure[0] if dir_structure else os.path.basename(start_dir)
            
            # Initialize the base directory in the result if it doesn't exist
            if base_dir_name not in result:
                result[base_dir_name] = {}

            # Create an entry for this specific directory
            index = len(result[base_dir_name])  # Use the current count of entries as index
            I_dir = [f"{dir}{i}" for i, dir in enumerate(dir_structure)]
            result[base_dir_name][str(index)] = {
                "dir": dir_structure,
                "I_dir": I_dir,
                "files": htm_files
            }

    return result



def launch_html_server(directory):
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=directory, **kwargs)
    PORT = 8000
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        webbrowser.open("http://localhost:" + str(PORT))
        httpd.serve_forever()


if __name__ == "__main__":
    ##DEV   start_directory = './exports'
    start_directory = '../../../Downloads/OneNoteBackup'
    index_loc = './assets/file_index/index.json' 
    
    try:
        os.remove(index_loc) #remove temp file if code crashed previous run
    except:
        pass
    htm_map = find_htm_files(start_directory)
    save_to_json(htm_map, index_loc)
    launch_html_server("./")


