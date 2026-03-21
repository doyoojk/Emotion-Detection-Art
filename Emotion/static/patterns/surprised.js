// Surprised — massive radial burst of expanding rings and streaks
class SurprisedPattern {
    constructor(intensity) {
        this.alpha = 1.0;
        this.lifetime = 260;
        this.age = 0;
        this.intensity = intensity;
        this.cx = random(-width / 3, width / 3);
        this.cy = random(-height / 3, height / 3);

        this.colors = [
            [255, 200, 50],
            [50, 255, 100],
            [255, 100, 200],
            [100, 200, 255],
            [255, 255, 220],
        ];

        // Expanding rings
        const ringCount = floor(map(intensity, 0.2, 1, 4, 12));
        this.rings = [];
        for (let i = 0; i < ringCount; i++) {
            const theta = random(TWO_PI);
            const phi = random(PI);
            this.rings.push({
                dx: sin(phi) * cos(theta),
                dy: sin(phi) * sin(theta),
                dz: cos(phi),
                speed: random(3, 8) * intensity,
                size: random(20, 60),
                dist: 0,
                color: random(this.colors),
                rotX: random(TWO_PI),
                rotY: random(TWO_PI),
            });
        }

        // Streaks
        const streakCount = floor(map(intensity, 0.2, 1, 15, 50));
        this.streaks = [];
        for (let i = 0; i < streakCount; i++) {
            const theta = random(TWO_PI);
            const phi = random(PI);
            const speed = random(4, 10) * intensity;
            this.streaks.push({
                vx: sin(phi) * cos(theta) * speed,
                vy: sin(phi) * sin(theta) * speed,
                vz: cos(phi) * speed,
                x: 0, y: 0, z: 0,
                color: random(this.colors),
                weight: random(1, 3),
            });
        }
    }

    update() {
        this.age++;
        this.alpha = max(0, 1 - this.age / this.lifetime);

        for (const r of this.rings) {
            r.dist += r.speed;
            r.speed *= 0.985;
        }

        for (const s of this.streaks) {
            s.x += s.vx;
            s.y += s.vy;
            s.z += s.vz;
            s.vx *= 0.96;
            s.vy *= 0.96;
            s.vz *= 0.96;
        }
    }

    draw() {
        translate(this.cx, this.cy, 0);
        noFill();
        const a = this.alpha * 255;

        // Initial flash — concentric expanding rings
        if (this.age < 20) {
            const flashA = map(this.age, 0, 20, 200, 0);
            stroke(255, 255, 255, flashA);
            strokeWeight(2);
            for (let i = 0; i < 3; i++) {
                const r = this.age * (10 + i * 6);
                circle(0, 0, r * 2);
            }
        }

        // Expanding rings flying outward in 3D
        for (const r of this.rings) {
            const c = r.color;
            const ringA = a * 0.7;
            stroke(c[0], c[1], c[2], ringA);
            strokeWeight(1.5);
            push();
            translate(r.dx * r.dist, r.dy * r.dist, r.dz * r.dist);
            rotateX(r.rotX);
            rotateY(r.rotY);
            circle(0, 0, r.size * this.intensity);
            // Halo
            stroke(c[0], c[1], c[2], ringA * 0.25);
            strokeWeight(3);
            circle(0, 0, r.size * this.intensity * 1.6);
            pop();
        }

        // Streaks radiating out
        for (const s of this.streaks) {
            const c = s.color;
            const len = max(abs(s.vx), abs(s.vy), abs(s.vz)) * 3;
            stroke(c[0], c[1], c[2], a * 0.6);
            strokeWeight(s.weight * this.alpha);
            const nx = s.vx / (len + 0.01);
            const ny = s.vy / (len + 0.01);
            const nz = s.vz / (len + 0.01);
            line(
                s.x - nx * len, s.y - ny * len, s.z - nz * len,
                s.x, s.y, s.z
            );
        }
    }
}
