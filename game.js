// JavaScript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');
const menuContainer = document.getElementById('menu-container');
const scoreDisplay = document.getElementById('score');
const menu = document.getElementById('menu');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50,
    speed: 5
};

const bullets = [];
const enemies = [];
let score = 0;

// Array to store high scores
let highScores = [];

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' && player.x - player.speed > 0) {
        player.x -= player.speed;
    } else if (e.code === 'ArrowRight' && player.x + player.width + player.speed < canvas.width) {
        player.x += player.speed;
    } else if (e.code === 'Space') {
        shoot();
    }
});

function shoot() {
    bullets.push({ x: player.x + player.width / 2, y: player.y, width: 5, height: 10, speed: 8 });
}

function spawnEnemy() {
    const x = Math.random() * (canvas.width - 30);
    const y = 0;
    const width = 30;
    const height = 30;
    const speed = 2;
    enemies.push({ x, y, width, height, speed });
}

function updateGame() {
    if (Math.random() < 0.02) {
        spawnEnemy();
    }

    bullets.forEach(bullet => bullet.y -= bullet.speed);

    enemies.forEach(enemy => enemy.y += enemy.speed);

    bullets.forEach(bullet => {
        enemies.forEach((enemy, index) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bullets.indexOf(bullet), 1);
                enemies.splice(index, 1);
                score += 10;
                updateScore();
            }
        });
    });

    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            handleGameOver();
        }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'red';
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));

    ctx.fillStyle = 'green';
    enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height));

    requestAnimationFrame(updateGame);
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function resetGame() {
    score = 0;
    bullets.length = 0;
    enemies.length = 0;
    updateScore();
    showMenu();
}

function handleGameOver() {
    alert('Game Over! Your Score: ' + score);
    // Save the score to high scores
    saveScore(score);
    resetGame();
}

function startGame() {
    hideMenu();
    updateGame();
}

function endGame() {
    handleGameOver();
}

function showHighScores() {
    // Sort high scores in descending order
    const sortedHighScores = highScores.sort((a, b) => b - a);
    alert('High Scores: ' + sortedHighScores.join(', '));
}

function hideMenu() {
    menuContainer.style.display = 'none';
    gameContainer.style.display = 'block';
}

function showMenu() {
    menuContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}

function saveScore(currentScore) {
    highScores.push(currentScore);
}
