#!/usr/bin/env python3
"""
Servidor Local para HercarIA (IESTP "Hermanos Cárcamo")
- Servidor HTTP de archivos estáticos
- Endpoint de Síntesis Vocal Femenina Neural (/api/tts) con edge-tts
- Apertura automática del navegador en http://localhost:8080
"""

import sys
import os
import io
import asyncio
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer
import webbrowser

# Configurar salida UTF-8 en Windows para evitar errores con caracteres especiales
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Intentar importar edge_tts para voz neural de máxima fidelidad
try:
    import edge_tts
    HAS_EDGE_TTS = True
except ImportError:
    HAS_EDGE_TTS = False
    print("[Aviso] edge_tts no esta instalado. El chatbot usara la voz nativa del navegador.")

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

async def generar_audio_neural(texto: str, voz: str = "es-PE-CamilaNeural") -> bytes:
    """Genera audio MP3 usando la voz neural seleccionada."""
    tts = edge_tts.Communicate(texto, voz)
    mp3_buffer = io.BytesIO()
    async for chunk in tts.stream():
        if chunk["type"] == "audio":
            mp3_buffer.write(chunk["data"])
    return mp3_buffer.getvalue()

class HercarRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # Endpoint de TTS Neural
        if parsed_url.path == '/api/tts':
            query_params = urllib.parse.parse_qs(parsed_url.query)
            texto = query_params.get('text', [''])[0]
            voz = query_params.get('voice', ['es-PE-CamilaNeural'])[0]

            if not texto:
                self.send_error(400, "Parametro 'text' faltante")
                return

            if not HAS_EDGE_TTS:
                self.send_error(501, "edge_tts no disponible en el servidor")
                return

            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                audio_bytes = loop.run_until_complete(generar_audio_neural(texto, voz))
                loop.close()

                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_bytes)))
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                self.wfile.write(audio_bytes)
                return
            except Exception as e:
                print(f"[Error TTS] {e}")
                self.send_error(500, f"Error en sintesis vocal: {e}")
                return

        # Para cualquier otra ruta, servir archivos estáticos normales
        super().do_GET()

def run_server():
    server_address = ('127.0.0.1', PORT)
    try:
        httpd = HTTPServer(server_address, HercarRequestHandler)
    except OSError:
        alt_port = 8081
        server_address = ('127.0.0.1', alt_port)
        httpd = HTTPServer(server_address, HercarRequestHandler)
        print(f"[Info] Puerto 8080 ocupado. Iniciando en puerto {alt_port}...")

    port_usado = server_address[1]
    url = f"http://127.0.0.1:{port_usado}"

    print("=" * 68)
    print("   [*] HERCARIA - ASISTENTE VIRTUAL IESTP HERMANOS CARCAMO")
    print(f"   [+] Servidor web iniciado en: {url}")
    print("   [+] Voz Neural Femenina lista: es-PE-CamilaNeural (Peru)")
    print("   [+] Presiona Ctrl + C para detener el servidor")
    print("=" * 68)

    # Abrir navegador automáticamente
    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Servidor detenido por el usuario.")
        httpd.server_close()
        sys.exit(0)

if __name__ == '__main__':
    run_server()
