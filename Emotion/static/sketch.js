let patternManager;
let socket;

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
// Minimum frames between spawns of the same emotion
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

        // Enforce cooldown per emotion
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

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    patternManager = new PatternManager();

    socket = io();
    socket.on('emotion', (data) => {
        patternManager.triggerEmotion(data.emotion, data.intensity || 0.5);
        document.getElementById('emotion-label').textContent = data.emotion;
    });
}

function draw() {
    background(0);
    patternManager.update();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
