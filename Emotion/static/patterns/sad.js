// Sad — large expanding ripples on a still pond
class SadPattern {
    constructor(intensity) {
        this.alpha = 1.0;
        this.lifetime = 720;
        this.age = 0;
        this.intensity = intensity;
        this.cx = random(-width / 3, width / 3);
        this.cy = random(-height / 3, height / 3);
        this.cz = random(-40, 40);

        this.colors = [
            [30, 60, 150],
            [60, 40, 140],
            [40, 80, 160],
            [80, 50, 130],
        ];

        const ringCount = floor(map(intensity, 0.2, 1, 8, 22));
        this.rings = [];
        for (let i = 0; i < ringCount; i++) {
            this.rings.push({
                delay: i * floor(map(intensity, 0.2, 1, 15, 8)),
                radius: 0,
                maxRadius: map(intensity, 0.2, 1, 600, 1400),
                color: this.colors[i % this.colors.length],
                weight: map(i, 0, ringCount, 3.5, 0.8),
            });
        }
    }

    update() {
        this.age++;
        this.alpha = max(0, 1 - this.age / this.lifetime);

        for (const r of this.rings) {
            if (this.age > r.delay) {
                r.radius += 1.8;
            }
        }
    }

    draw() {
        translate(this.cx, this.cy, this.cz - this.age * 0.05);
        rotateX(0.6);
        noFill();

        const a = this.alpha * 255;

        for (const r of this.rings) {
            if (r.radius <= 0) continue;
            const c = r.color;
            const ringFade = max(0, 1 - r.radius / r.maxRadius);
            const ringA = a * ringFade;

            stroke(c[0], c[1], c[2], ringA * 0.8);
            strokeWeight(r.weight * ringFade);
            circle(0, 0, r.radius * 2);

            stroke(c[0], c[1], c[2], ringA * 0.2);
            strokeWeight(r.weight * ringFade * 2.5);
            circle(0, 0, r.radius * 2 + 15);
        }

        if (this.age < 40) {
            const distA = map(this.age, 0, 40, 150, 0);
            stroke(100, 120, 200, distA);
            strokeWeight(1.5);
            const wobble = sin(this.age * 0.5) * 8;
            circle(0, 0, 15 + wobble);
            circle(0, 0, 30 + wobble * 0.5);
        }
    }
}
