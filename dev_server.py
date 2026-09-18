import http.server
import socketserver
import os
import json

PORT = 8080

class LiveReloadHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/__version__':
            max_mtime = 0
            for root, dirs, files in os.walk('.'):
                for file in files:
                    if '/.' in root or file.startswith('.'):
                        continue
                    try:
                        mtime = os.path.getmtime(os.path.join(root, file))
                        if mtime > max_mtime:
                            max_mtime = mtime
                    except OSError:
                        pass
            
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.end_headers()
            self.wfile.write(json.dumps({'version': max_mtime}).encode())
            return
            
        return super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def copyfile(self, source, outputfile):
        if self.path == '/' or self.path.endswith('.html'):
            content = source.read().decode('utf-8')
            reload_script = """
            <script>
            (function() {
                let lastVersion = null;
                setInterval(() => {
                    fetch('/__version__')
                        .then(r => r.json())
                        .then(data => {
                            if (lastVersion === null) {
                                lastVersion = data.version;
                            } else if (lastVersion !== data.version) {
                                location.reload();
                            }
                        })
                        .catch(e => console.error(e));
                }, 1000);
            })();
            </script>
            """
            content = content.replace('</body>', reload_script + '</body>')
            outputfile.write(content.encode('utf-8'))
        else:
            super().copyfile(source, outputfile)

with socketserver.ThreadingTCPServer(("", PORT), LiveReloadHandler) as httpd:
    print(f"Serving at http://localhost:{PORT} with auto-reload...")
    httpd.serve_forever()

