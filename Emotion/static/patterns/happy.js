// Happy — fast blooming arcs bursting outward like petals unfurling
class HappyPattern {
    constructor(intensity) {
        this.alpha = 1.0;
        this.lifetime = 300;
        this.age = 0;
        this.intensity = intensity;
        this.cx = random(-width / 3, width / 3);
        this.cy = random(-height / 3, height / 3);
        this.rotOffset = random(TWO_PI);

        this.colors = [
            [255, 220, 50],
            [255, 170, 100],
            [255, 130, 170],
            [135, 206, 235],
            [200, 255, 230],
        ];

        const petalCount = floor(map(intensity, 0.2, 1, 10, 30));
        this.petals = [];
        for (let i = 0; i < petalCount; i++) {
            const baseAngle = (TWO_PI / petalCount) * i + random(-0.2, 0.2);
            this.petals.push({
                angle: baseAngle,
                speed: random(8, 18) * intensity,
                radius: 0,
                maxRadius: map(intensity, 0.2, 1, 600, 1400),
                arcSpan: random(0.3, 0.9),
                weight: random(4, 10) * intensity,
                color: random(this.colors),
                curl: random(-0.02, 0.02),
                zOff: random(-100, 100),
            });
        }
    }

    update() {
        this.age++;
        this.alpha = max(0, 1 - this.age / this.lifetime);

        for (const p of this.petals) {
            if (p.radius < p.maxRadius) {
                p.radius += p.speed;
                p.speed *= 0.98;
            }
            p.angle += p.curl;
        }
    }

    draw() {
        translate(this.cx, this.cy, -this.age * 0.1);
        rotateZ(this.rotOffset + this.age * 0.002);
        noFill();

        const a = this.alpha * 255;

        for (const p of this.petals) {
            if (p.radius < 1) continue;
            const c = p.color;
            const petalFade = a * min(1, p.radius / 50);

            // Thick blooming arc
            stroke(c[0], c[1], c[2], petalFade * 0.8);
            strokeWeight(p.weight * this.alpha);

            beginShape();
            const steps = 20;
            for (let s = 0; s <= steps; s++) {
                const t = map(s, 0, steps, -p.arcSpan / 2, p.arcSpan / 2);
                const ang = p.angle + t;
                const r = p.radius;
                const x = cos(ang) * r;
                const y = sin(ang) * r;
                const z = p.zOff + sin(t * 4) * 40;
                vertex(x, y, z);
            }
            endShape();

            // Soft glow arc behind
            stroke(c[0], c[1], c[2], petalFade * 0.15);
            strokeWeight(p.weight * this.alpha * 3);

            beginShape();
            for (let s = 0; s <= steps; s++) {
                const t = map(s, 0, steps, -p.arcSpan / 2, p.arcSpan / 2);
                const ang = p.angle + t;
                const r = p.radius * 0.95;
                const x = cos(ang) * r;
                const y = sin(ang) * r;
                const z = p.zOff + sin(t * 4) * 40;
                vertex(x, y, z);
            }
            endShape();

            // Inner trailing arc
            if (p.radius > 50) {
                stroke(c[0], c[1], c[2], petalFade * 0.3);
                strokeWeight(p.weight * this.alpha * 0.5);

                beginShape();
                for (let s = 0; s <= steps; s++) {
                    const t = map(s, 0, steps, -p.arcSpan * 0.6 / 2, p.arcSpan * 0.6 / 2);
                    const ang = p.angle + t;
                    const r = p.radius * 0.6;
                    const x = cos(ang) * r;
                    const y = sin(ang) * r;
                    const z = p.zOff + sin(t * 4) * 25;
                    vertex(x, y, z);
                }
                endShape();
            }
        }
    }
}
