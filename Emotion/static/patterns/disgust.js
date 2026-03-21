// Disgust — large writhing worms with pulsing bulb shapes along their bodies
class DisgustPattern {
    constructor(intensity) {
        this.alpha = 1.0;
        this.lifetime = 360;
        this.age = 0;
        this.intensity = intensity;
        this.cx = random(-width / 3, width / 3);
        this.cy = random(-height / 3, height / 3);
        this.t = 0;

        this.colors = [
            [80, 160, 40],
            [100, 50, 100],
            [60, 130, 30],
            [120, 60, 120],
        ];

        const count = floor(map(intensity, 0.2, 1, 4, 12));
        this.worms = [];
        for (let i = 0; i < count; i++) {
            this.worms.push({
                seed: random(1000),
                segments: [],
                color: this.colors[i % this.colors.length],
                weight: random(2, 5) * intensity,
            });
        }
    }

    update() {
        this.age++;
        this.alpha = max(0, 1 - this.age / this.lifetime);
        this.t += 0.012 * this.intensity;

        const range = map(this.intensity, 0.2, 1, 150, 350);
        for (const w of this.worms) {
            const s = w.seed;
            const x = (noise(s, this.t) - 0.5) * range * 2;
            const y = (noise(s + 100, this.t) - 0.5) * range * 2;
            const z = (noise(s + 200, this.t) - 0.5) * range;
            w.segments.push({ x, y, z });
            if (w.segments.length > 60) w.segments.shift();
        }
    }

    draw() {
        translate(this.cx, this.cy, -this.age * 0.1);
        noFill();
        const a = this.alpha * 255;

        for (const w of this.worms) {
            if (w.segments.length < 3) continue;
            const c = w.color;

            // Worm body — thickening toward head
            for (let i = 1; i < w.segments.length; i++) {
                const bodyFade = i / w.segments.length;
                stroke(c[0], c[1], c[2], a * bodyFade);
                strokeWeight(w.weight * bodyFade * this.alpha);
                const prev = w.segments[i - 1];
                const curr = w.segments[i];
                line(prev.x, prev.y, prev.z, curr.x, curr.y, curr.z);
            }

            // Pulsing bulbs along the body
            stroke(c[0], c[1], c[2], a * 0.35);
            strokeWeight(1);
            for (let i = 0; i < w.segments.length; i += 8) {
                const seg = w.segments[i];
                const pulse = sin(this.age * 0.08 + i * 0.3) * 0.4 + 0.6;
                const bulbSize = w.weight * 5 * pulse * this.intensity;
                push();
                translate(seg.x, seg.y, seg.z);
                circle(0, 0, bulbSize);
                pop();
            }
        }
    }
}
