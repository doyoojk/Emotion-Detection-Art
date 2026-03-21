// Neutral — wide flowing sine waves with gentle drifting circles
class NeutralPattern {
    constructor(intensity) {
        this.alpha = 1.0;
        this.lifetime = 180;
        this.age = 0;
        this.intensity = intensity;
        this.cy = random(-height / 8, height / 8);
        this.phaseOffset = random(TWO_PI);
        this.lineCount = floor(map(intensity, 0.2, 1, 3, 6));
        this.pointsPerLine = 100;

        this.colors = [
            [140, 140, 140],
            [110, 110, 110],
            [80, 80, 80],
        ];
    }

    update() {
        this.age++;
        this.alpha = max(0, 1 - this.age / this.lifetime);
    }

    draw() {
        translate(0, this.cy, -this.age * 0.08);
        rotateY(this.age * 0.0006);
        noFill();

        const a = this.alpha * 255;
        const spreadX = width * 0.7;
        const spreadY = 200;
        const lineSpacing = spreadY / this.lineCount;
        const time = this.age * 0.02 + this.phaseOffset;

        // Sine wave lines
        for (let i = 0; i < this.lineCount; i++) {
            const yPos = (i - this.lineCount / 2) * lineSpacing;
            const zPos = (i - this.lineCount / 2) * 10;
            const freq = 0.004 + i * 0.001;
            const amp = (25 + i * 3) * this.intensity;
            const c = this.colors[i % this.colors.length];

            stroke(c[0], c[1], c[2], a * 0.7);
            strokeWeight(1.2);

            beginShape();
            for (let j = 0; j < this.pointsPerLine; j++) {
                const x = map(j, 0, this.pointsPerLine - 1, -spreadX, spreadX);
                const y = yPos + sin(x * freq + time + i * 0.5) * amp;
                vertex(x, y, zPos);
            }
            endShape();
        }

    }
}
