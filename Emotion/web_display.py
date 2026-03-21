import webbrowser
from threading import Thread, Lock

import cv2
from flask import Flask, send_from_directory, Response
from flask_socketio import SocketIO

app = Flask(__name__, static_folder='static')
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

current_emotion = 'neutral'
current_intensity = 0.5
_server_started = False
_latest_frame = None
_frame_lock = Lock()


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/patterns/<path:filename>')
def patterns(filename):
    return send_from_directory('static/patterns', filename)


def _generate_mjpeg():
    while True:
        with _frame_lock:
            frame = _latest_frame
        if frame is None:
            continue
        _, jpeg = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(_generate_mjpeg(), mimetype='multipart/x-mixed-replace; boundary=frame')


def _start_server():
    global _server_started
    if _server_started:
        return
    _server_started = True
    thread = Thread(
        target=lambda: socketio.run(app, host='0.0.0.0', port=5001, allow_unsafe_werkzeug=True),
        daemon=True,
    )
    thread.start()
    webbrowser.open('http://localhost:5001')


_start_server()


def change_display(label, intensity=0.5):
    global current_emotion, current_intensity
    current_emotion = label
    current_intensity = intensity


def update_display(frame=None):
    global _latest_frame
    if frame is not None:
        with _frame_lock:
            _latest_frame = frame
    socketio.emit('emotion', {'emotion': current_emotion, 'intensity': current_intensity})
