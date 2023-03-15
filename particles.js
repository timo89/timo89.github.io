// Particle class for fireworks and explosions
class Particle {
    constructor(x, y, color, life, speed, angle) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = life;
        this.speed = speed;
        this.angle = angle;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.life -= 1;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 4, 4);
    }
}

// Particle system
const particles = [];

function createFirework(x, y) {
    for (let i = 0; i < 100; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 2 + 1;
        const life = Math.floor(Math.random() * 50 + 50);
        const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`; // Random bright color
        particles.push(new Particle(x, y, color, life, speed, angle));
    }
}

function createExplosion(x, y) {
    for (let i = 0; i < 100; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 4 + 1;
        const life = Math.floor(Math.random() * 30 + 30);
        const color = `hsl(${Math.floor(Math.random() * 60)}, 100%, 50%)`; // Random red-orange color
        particles.push(new Particle(x, y, color, life, speed, angle));
    }
}
