// Scared — large trembling web with scattered shaking rings
class ScaredPattern {
    constructor(intensity) {
        this.alpha = 1.0;
        this.lifetime = 300;
        this.age = 0;
        this.intensity = intensity;
        this.cx = random(-width / 3, width / 3);
        this.cy = random(-height / 3, height / 3);
        this.gridSize = floor(map(intensity, 0.2, 1, 8, 16));
        this.spacing = map(intensity, 0.2, 1, 30, 50);
        this.rotX = random(TWO_PI);
        this.rotY = random(TWO_PI);

        this.points = [];
        const offset = (this.gridSize - 1) * this.spacing / 2;
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.points.push({
                    rx: i * this.spacing - offset,
                    ry: j * this.spacing - offset,
                    rz: noise(i * 0.3, j * 0.3) * 60 - 30,
                    noiseOff: random(1000),
                    hasRing: random() < 0.15,
                    ringSize: random(10, 30),
                });
            }
        }

        this.colors = [
            [80, 0, 120],
            [40, 0, 60],
            [100, 20, 140],
        ];
    }

    update() {
        this.age++;
        this.alpha = max(0, 1 - this.age / this.lifetime);
        this.rotX += 0.002;
        this.rotY += 0.003;
    }

    draw() {
        translate(this.cx, this.cy, -this.age * 0.15);
        rotateX(this.rotX);
        rotateY(this.rotY);
        noFill();

        const a = this.alpha * 255;
        const jitterAmt = 10 * this.alpha * this.intensity;

        const displaced = this.points.map(p => ({
            x: p.rx + (noise(p.noiseOff + this.age * 0.06) - 0.5) * jitterAmt * 2,
            y: p.ry + (noise(p.noiseOff + 50 + this.age * 0.06) - 0.5) * jitterAmt * 2,
            z: p.rz + (noise(p.noiseOff + 100 + this.age * 0.06) - 0.5) * jitterAmt * 2,
            hasRing: p.hasRing,
            ringSize: p.ringSize,
        }));

        // Web lines
        const c = this.colors[0];
        stroke(c[0], c[1], c[2], a * 0.6);
        strokeWeight(0.8);

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const idx = i * this.gridSize + j;
                const p = displaced[idx];
                if (j < this.gridSize - 1) {
                    const n = displaced[idx + 1];
                    line(p.x, p.y, p.z, n.x, n.y, n.z);
                }
                if (i < this.gridSize - 1) {
                    const n = displaced[idx + this.gridSize];
                    line(p.x, p.y, p.z, n.x, n.y, n.z);
                }
            }
        }

        // Diagonal web connections
        const c2 = this.colors[2];
        stroke(c2[0], c2[1], c2[2], a * 0.2);
        strokeWeight(0.4);
        for (let i = 0; i < this.gridSize - 1; i++) {
            for (let j = 0; j < this.gridSize - 1; j++) {
                const idx = i * this.gridSize + j;
                const diag = displaced[idx + this.gridSize + 1];
                const p = displaced[idx];
                line(p.x, p.y, p.z, diag.x, diag.y, diag.z);
            }
        }

        // Shaking rings at random vertices
        stroke(c2[0], c2[1], c2[2], a * 0.5);
        strokeWeight(1);
        for (const p of displaced) {
            if (p.hasRing) {
                push();
                translate(p.x, p.y, p.z);
                rotateX(random(TWO_PI));
                rotateY(random(TWO_PI));
                circle(0, 0, p.ringSize * this.intensity);
                pop();
            }
        }
    }
}
