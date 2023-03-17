const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 1;
        const maxSpeed = Math.random() * 10 + 5;
        this.speedX = Math.random() * maxSpeed - maxSpeed / 2;
        this.speedY = Math.random() * maxSpeed - maxSpeed / 2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

let particles = [];

function createParticles(xPos, yPos) {
    const particleCount = Math.floor(Math.random() * 100) + 1;
    const colorCount = Math.floor(Math.random() * 5) + 1; // Change the number "5" to set a maximum number of colors
    const colors = [];

    for (let i = 0; i < colorCount; i++) {
        colors.push(`hsl(${Math.random() * 360}, 50%, 50%)`);
    }

    for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colorCount)];
        particles.push(new Particle(xPos, yPos, color));
    }
}



canvas.addEventListener('click', (event) => {
    createParticles(event.x, event.y);
});

function createRandomFireworks() {
    const xPos = Math.random() * canvas.width;
    const yPos = Math.random() * canvas.height;
    createParticles(xPos, yPos);
}

setInterval(createRandomFireworks, Math.random() * 1000);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].size <= 0.1) {
            particles.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}

animate();
