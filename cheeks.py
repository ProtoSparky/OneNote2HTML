import os
import json
import http.server
import socketserver
import webbrowser

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

def save_to_json(htm_map, filename='./assets/file_index/index.json'):
    with open(filename, 'w') as f:
        json.dump(htm_map, f, indent=4)



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
    start_directory = './exports'
    index_loc = './assets/file_index/index.json' 
    try:
        os.remove(index_loc) #remove temp file if code crashed previous run
    except:
        pass
    htm_map = find_htm_files(start_directory)
    save_to_json(htm_map, index_loc)
    launch_html_server("./")


