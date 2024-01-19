const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.width = 20;
        this.height = 20;
        this.color = 'green';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.color = 'red';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const player = new Player();
const enemies = [new Enemy(100, 100), new Enemy(200, 100)]; // Sample enemies

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    enemies.forEach(enemy => enemy.draw());
    requestAnimationFrame(animate);
}

animate();
