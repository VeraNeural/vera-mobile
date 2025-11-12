#!/usr/bin/env python3
"""
VERA Static Server - Serves built Next.js files
No Node.js issues, just pure HTTP serving
"""
import http.server
import socketserver
import os
from pathlib import Path

PORT = 3000
BUILD_DIR = Path(__file__).parent / 'apps' / 'web' / '.next' / 'standalone'

class VERAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BUILD_DIR), **kwargs)
    
    def log_message(self, format, *args):
        print(f"[VERA] {format % args}")

if __name__ == '__main__':
    if not BUILD_DIR.exists():
        print(f"❌ Build directory not found: {BUILD_DIR}")
        print("Run: cd apps/web && npx next build")
        exit(1)
    
    print(f"✅ VERA Server Starting")
    print(f"📍 Building from: {BUILD_DIR}")
    print(f"🌐 Access at: http://localhost:{PORT}")
    print(f"Press Ctrl+C to stop\n")
    
    with socketserver.TCPServer(("", PORT), VERAHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n📍 VERA Server stopped")
