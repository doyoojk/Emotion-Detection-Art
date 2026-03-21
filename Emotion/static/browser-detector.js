// Browser-side emotion detection using face-api.js
// Used when no Python backend is available (e.g. GitHub Pages)

const EMOTION_MAP = {
    angry: 'angry',
    disgusted: 'disgust',
    fearful: 'scared',
    happy: 'happy',
    sad: 'sad',
    surprised: 'surprised',
    neutral: 'neutral',
};

class BrowserEmotionDetector {
    constructor(onEmotion) {
        this.onEmotion = onEmotion;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.running = false;
        this.lastDetection = 0;
        this.detectionInterval = 200; // ms between detections
    }

    async init() {
        const label = document.getElementById('emotion-label');
        if (label) label.textContent = 'loading models...';

        // Load face-api.js models
        const modelPath = 'models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
        await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);

        if (label) label.textContent = 'starting camera...';

        // Set up video element
        this.video = document.createElement('video');
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('autoplay', '');
        this.video.style.display = 'none';
        document.body.appendChild(this.video);

        // Request webcam
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 300, height: 225, facingMode: 'user' },
            });
            this.video.srcObject = stream;
            await this.video.play();
        } catch (err) {
            if (label) label.textContent = 'camera access denied';
            console.error('Webcam error:', err);
            return;
        }

        // Set up canvas to replace MJPEG img feed
        const container = document.getElementById('webcam-container');
        const img = document.getElementById('webcam-feed');
        if (img) img.style.display = 'none';

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'webcam-canvas';
        this.canvas.width = 240;
        this.canvas.height = 180;
        this.canvas.style.borderRadius = '8px';
        this.canvas.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        this.canvas.style.opacity = '0.9';
        this.canvas.style.display = 'block';
        if (container) container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        if (label) label.textContent = 'detecting...';

        this.running = true;
        this._loop();
    }

    async _loop() {
        if (!this.running) return;

        const now = performance.now();

        // Draw video to canvas every frame
        if (this.ctx && this.video.readyState >= 2) {
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        }

        // Run detection at throttled rate
        if (now - this.lastDetection >= this.detectionInterval) {
            this.lastDetection = now;
            try {
                const result = await faceapi
                    .detectSingleFace(this.video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                if (result) {
                    const expressions = result.expressions;
                    let maxEmotion = 'neutral';
                    let maxScore = 0;
                    for (const [emotion, score] of Object.entries(expressions)) {
                        if (score > maxScore) {
                            maxScore = score;
                            maxEmotion = emotion;
                        }
                    }
                    const mapped = EMOTION_MAP[maxEmotion] || 'neutral';
                    this.onEmotion(mapped, maxScore);
                }
            } catch (err) {
                // Detection can fail on some frames, just skip
            }
        }

        requestAnimationFrame(() => this._loop());
    }

    stop() {
        this.running = false;
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(t => t.stop());
        }
    }
}
