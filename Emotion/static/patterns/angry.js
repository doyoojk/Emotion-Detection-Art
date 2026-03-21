// Angry — massive fractal lightning spanning the screen with glowing cores
class AngryPattern {
    constructor(intensity) {
        this.alpha = 1.0;
        this.lifetime = 200;
        this.age = 0;
        this.intensity = intensity;
        this.cx = random(-width / 3, width / 3);
        this.cy = random(-height / 3, height / 3);
        this.branches = [];
        this.colors = [
            [220, 30, 30],
            [180, 0, 0],
            [255, 100, 0],
            [150, 0, 30],
        ];

        const depth = floor(map(intensity, 0.2, 1, 5, 8));
        const length = map(intensity, 0.2, 1, 200, 450);
        // Many bolts radiating from center
        const boltCount = floor(map(intensity, 0.2, 1, 6, 14));
        for (let b = 0; b < boltCount; b++) {
            const angle = random(TWO_PI);
            this._generateBolt(0, 0, 0, angle, length, 0, depth);
        }
    }

    _generateBolt(x, y, z, angle, length, depth, maxDepth) {
        if (depth >= maxDepth || length < 8) return;

        const x2 = x + cos(angle) * length;
        const y2 = y + sin(angle) * length;
        const z2 = z + random(-40, 40);

        this.branches.push({
            x1: x, y1: y, z1: z,
            x2: x2, y2: y2, z2: z2,
            depth: depth,
            weight: map(depth, 0, maxDepth, 5, 0.8),
            color: this.colors[floor(random(this.colors.length))],
        });

        this._generateBolt(x2, y2, z2, angle + random(-0.5, 0.5), length * 0.7, depth + 1, maxDepth);

        if (random() < 0.7) {
            this._generateBolt(x2, y2, z2, angle + random(-1.2, 1.2), length * 0.5, depth + 1, maxDepth);
        }
    }

    update() {
        this.age++;
        this.alpha = max(0, 1 - this.age / this.lifetime);
    }

    draw() {
        translate(this.cx, this.cy, -this.age * 0.2);
        noFill();

        const flicker = this.age < 12 ? random(0.5, 1.0) : 1.0;
        const a = this.alpha * 255 * flicker;

        // Glow pass — thick, faint strokes behind
        for (const b of this.branches) {
            if (b.depth < 3) {
                const c = b.color;
                stroke(c[0], c[1], c[2], a * 0.1);
                strokeWeight(b.weight * this.alpha * 5);
                line(b.x1, b.y1, b.z1, b.x2, b.y2, b.z2);
            }
        }

        // Main bolts
        for (const b of this.branches) {
            const jitter = this.alpha * 4 * this.intensity;
            const c = b.color;
            stroke(c[0], c[1], c[2], a);
            strokeWeight(b.weight * this.alpha);
            line(
                b.x1 + random(-jitter, jitter),
                b.y1 + random(-jitter, jitter),
                b.z1,
                b.x2 + random(-jitter, jitter),
                b.y2 + random(-jitter, jitter),
                b.z2
            );
        }

        // Hot core at origin
        if (this.age < 25) {
            const coreA = map(this.age, 0, 25, 180, 0);
            stroke(255, 150, 50, coreA);
            strokeWeight(1);
            for (let i = 0; i < 8; i++) {
                const ang = (TWO_PI / 8) * i + this.age * 0.1;
                const r = 20 + this.age;
                circle(cos(ang) * r, sin(ang) * r, 15);
            }
        }
    }
}
