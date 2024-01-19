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
        this.speedX = 1;
        this.speedY = 0.3;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.x += this.speedX;
        this.y += Math.random() < 0.1 ? this.speedY : 0;
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
            this.y += this.speedY;
        }
    }
}

class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.color = 'white';
        this.velocity = 2;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.draw();
        this.y -= this.velocity;
    }
}

const player = new Player();
let enemies = [new Enemy(100, 100), new Enemy(200, 100)];
let projectiles = [];
let score = 0;
let gameOver = false;

function shoot(x, y) {
    projectiles.push(new Projectile(x, y));
}

window.addEventListener('keydown', function(e) {
    if (e.code === 'ArrowLeft') {
        player.x -= 10;
    } else if (e.code === 'ArrowRight') {
        player.x += 10;
    } else if (e.code === 'Space') {
        shoot(player.x + player.width / 2, player.y);
    }
});

function detectCollision(projectile, enemy) {
    return (
        projectile.x + projectile.radius > enemy.x &&
        projectile.x - projectile.radius < enemy.x + enemy.width &&
        projectile.y + projectile.radius > enemy.y &&
        projectile.y - projectile.radius < enemy.y + enemy.height
    );
}

function animate() {
    if (gameOver) {
        cancelAnimationFrame(animationId);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Score: ' + score, canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Tap to Restart', canvas.width / 2 - 80, canvas.height / 2 + 40);
        return;
    }

    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        enemy.draw();
        if (enemy.y + enemy.height >= canvas.height) {
            gameOver = true;
        }
    });

    projectiles.forEach((projectile, index) => {
        projectile.update();
        if (projectile.y + projectile.radius < 0) {
            setTimeout(() => projectiles.splice(index, 1), 0);
        }

        enemies.forEach((enemy, enemyIndex) => {
            if (detectCollision(projectile, enemy)) {
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1);
                    projectiles.splice(index, 1);
                    score += 10;
                }, 0);
            }
        });
    });
}

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const shootBtn = document.getElementById('shootBtn');

leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); player.x -= 10; });
rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); player.x += 10; });
shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); shoot(player.x + player.width / 2, player.y); });

function startGame() {
    gameOver = false;
    score = 0;
    enemies = [new Enemy(100, 100), new Enemy(200, 100)];
    projectiles = [];
    animate();
}

function restartGame() {
    if (gameOver) {
        startGame();
    }
}

canvas.addEventListener('click', restartGame);
startGame();
