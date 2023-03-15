// Particle class for fireworks and explosions
class Particle {
    constructor(x, y, vx, vy, life, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.color = color;
    }
    

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
    }
    

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 4, 4);
    }
}

// Particle system
const particles = [];
const numParticlesPerFirework = 50;
const maxParticleSpeed = 3;
const minParticleSpeed = 1;


function createFirework(x, y, color) {
    for (let i = 0; i < numParticlesPerFirework; i++) {
        const angle = (i / numParticlesPerFirework) * 2 * Math.PI;
        const speed = Math.random() * maxParticleSpeed + minParticleSpeed;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        let particle = new Particle(x, y, vx, vy, 50, color);
        particles.push(particle);
    }
}



function createExplosion(x, y) {
    for (let i = 0; i < 100; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 4 + 1;
        const life = Math.floor(Math.random() * 30 + 30);
        const color = `hsl(${Math.floor(Math.random() * 60)}, 100%, 50%)`; // Random red-orange color
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push(new Particle(x, y, vx, vy, life, color));
    }
}

