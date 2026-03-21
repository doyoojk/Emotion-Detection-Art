let patternManager;
let socket;
let mode = 'unknown';
let browserDetector = null;

const PATTERN_CLASSES = {
    happy: HappyPattern,
    sad: SadPattern,
    angry: AngryPattern,
    scared: ScaredPattern,
    surprised: SurprisedPattern,
    disgust: DisgustPattern,
    neutral: NeutralPattern,
};

const MAX_PATTERNS = 30;
const COOLDOWNS = {
    happy: 30,
    sad: 60,
    angry: 0,
    scared: 50,
    surprised: 40,
    disgust: 50,
    neutral: 60,
};

class PatternManager {
    constructor() {
        this.activePatterns = [];
        this.lastSpawn = {};
    }

    triggerEmotion(emotion, intensity) {
        const PatternClass = PATTERN_CLASSES[emotion];
        if (!PatternClass) return;

        const now = frameCount;
        const cooldown = COOLDOWNS[emotion] || 40;
        if (this.lastSpawn[emotion] && now - this.lastSpawn[emotion] < cooldown) return;
        this.lastSpawn[emotion] = now;

        this.activePatterns.push(new PatternClass(intensity));
        if (this.activePatterns.length > MAX_PATTERNS) {
            this.activePatterns.shift();
        }
    }

    update() {
        this.activePatterns = this.activePatterns.filter(p => p.alpha > 0);
        for (const pattern of this.activePatterns) {
            pattern.update();
            push();
            pattern.draw();
            pop();
        }
    }
}

function handleEmotion(emotion, intensity) {
    patternManager.triggerEmotion(emotion, intensity);
    document.getElementById('emotion-label').textContent = emotion;
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    patternManager = new PatternManager();
    detectMode();
}

function detectMode() {
    // Check if socket.io is available (won't be on GitHub Pages without the CDN, but we include it)
    if (typeof io !== 'undefined') {
        socket = io({ timeout: 3000, reconnectionAttempts: 1 });

        socket.on('connect', () => {
            mode = 'local';
            console.log('Local mode: connected to Python backend');
            socket.on('emotion', (data) => {
                handleEmotion(data.emotion, data.intensity || 0.5);
            });
        });

        socket.on('connect_error', () => {
            if (mode === 'unknown') {
                socket.disconnect();
                startBrowserMode();
            }
        });

        // Fallback timeout
        setTimeout(() => {
            if (mode === 'unknown') {
                socket.disconnect();
                startBrowserMode();
            }
        }, 4000);
    } else {
        startBrowserMode();
    }
}

function startBrowserMode() {
    mode = 'browser';
    console.log('Browser mode: using face-api.js for detection');

    // Hide MJPEG img
    const img = document.getElementById('webcam-feed');
    if (img) img.style.display = 'none';

    browserDetector = new BrowserEmotionDetector((emotion, intensity) => {
        handleEmotion(emotion, intensity);
    });
    browserDetector.init();
}

function draw() {
    background(0);
    patternManager.update();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
