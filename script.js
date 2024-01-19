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

// Continuing from previous script.js content

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

const projectiles = [];

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

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    enemies.forEach((enemy, index) => {
        enemy.draw();
        // Enemy movement logic here
    });
    projectiles.forEach((projectile, index) => {
        projectile.update();
        // Collision detection and removal logic here
    });
    requestAnimationFrame(animate);
}

animate();

// ... existing JavaScript ...

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const shootBtn = document.getElementById('shootBtn');

leftBtn.addEventListener('touchstart', () => player.x -= 10);
rightBtn.addEventListener('touchstart', () => player.x += 10);
shootBtn.addEventListener('touchstart', () => shoot(player.x + player.width / 2, player.y));

// Update the animate function to include touch control functionality


// Continuing from previous script.js content

let score = 0;
let gameOver = false;

// Update the Enemy class for movement
class Enemy {
    // ... existing properties ...
    constructor(x, y) {
        // ... existing setup ...
        this.speedX = 1;
        this.speedY = 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += Math.random() < 0.1 ? this.speedY : 0; // Drop down occasionally

        // Change direction at canvas edges
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
            this.y += this.speedY;
        }
    }
}

// Collision detection function
function detectCollision(projectile, enemy) {
    // Simple AABB (Axis-Aligned Bounding Box) collision detection
    return (
        projectile.x + projectile.radius > enemy.x &&
        projectile.x - projectile.radius < enemy.x + enemy.width &&
        projectile.y + projectile.radius > enemy.y &&
        projectile.y - projectile.radius < enemy.y + enemy.height
    );
}

function animate() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();

        // Game over if enemy reaches the bottom
        if (enemy.y + enemy.height >= canvas.height) {
            gameOver = true;
        }
    });

    projectiles.forEach((projectile, index) => {
        projectile.update();

        // Remove projectiles at canvas top
        if (projectile.y + projectile.radius < 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }

        // Check for collisions
        enemies.forEach((enemy, enemyIndex) => {
            if (detectCollision(projectile, enemy)) {
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1);
                    projectiles.splice(index, 1);
                    score += 10; // Increase score
                }, 0);
            }
        });
    });

    requestAnimationFrame(animate);
}

animate();

// Continuing from previous script.js content

let animationId;

// Start and Restart Game functions
function startGame() {
    gameOver = false;
    score = 0;
    enemies = [new Enemy(100, 100), new Enemy(200, 100)]; // Reset enemies
    projectiles = [];
    animate(); // Start animation loop
}

function restartGame() {
    if (gameOver) {
        startGame();
    }
}

// Updated animate function with cancelAnimationFrame
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    // ... existing game logic ...

    if (gameOver) {
        cancelAnimationFrame(animationId);
        // Display game over message and restart option
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Score: ' + score, canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Tap to Restart', canvas.width / 2 - 80, canvas.height / 2 + 40);
    }
}

// Event listener for restarting the game
canvas.addEventListener('click', restartGame);

// Call startGame to initialize the game
startGame();


// ... existing JavaScript content ...

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprites = []; // Array to hold explosion sprites
        this.index = 0; // Current sprite index
        this.done = false; // Flag to check if animation is complete
    }

    draw() {
        if (this.done) return;

        ctx.drawImage(this.sprites[this.index], this.x, this.y);
        if (++this.index >= this.sprites.length) {
            this.done = true;
        }
    }
}

let explosions = [];

function playSoundEffect(soundFile) {
    const sound = new Audio(soundFile);
    sound.play();
}

// ... existing code ...

// Update collision logic to include sound and visual effects
enemies.forEach((enemy, enemyIndex) => {
    if (detectCollision(projectile, enemy)) {
        setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            projectiles.splice(index, 1);
            explosions.push(new Explosion(enemy.x, enemy.y));
            playSoundEffect('hitSound.mp3'); // Replace with actual sound file path
            score += 10; // Increase score
        }, 0);
    }
});

// ... existing animate function ...

// Draw explosions
explosions.forEach((explosion, index) => {
    explosion.draw();
    if (explosion.done) {
        explosions.splice(index, 1);
    }
});

// ... existing JavaScript ...

// Use 'touchstart' event for mobile compatibility
leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    player.x -= 10;
}, { passive: false });



shootBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    shoot(player.x + player.width / 2, player.y);
}, { passive: false });

rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    player.x += 10;
}, { passive: false });
