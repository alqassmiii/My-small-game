const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const PLAYER_WIDTH = 50;
const PLAYER_MAX_SPEED = 600;
const LASER_MAX_SPEED = 300;
const LASER_COOLDOWN = 0.1;

const ENEMIES_PER_ROW = 10;
const ENEMY_HORIZONTAL_PADDING = 80;
const ENEMY_VERTICAL_PADDING = 70;
const ENEMY_VERTICAL_SPACING = 80;

const GAME_STATE = {
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  playerX: GAME_WIDTH / 2,
  playerY: GAME_HEIGHT - 50,
  playerCooldown: 0,
  lasers: [],
  enemies: [],
  gameOver: false,
  startTime: Date.now(), // Track when the game started
  score: 0, // Track player score
};

function setPosition($element, x, y) {
  $element.style.transform = `translate(${x}px, ${y}px)`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createPlayer($game) {
  const $player = document.createElement('img');
  $player.src = 'img/player-blue-1.png';
  $player.className = 'player';
  $game.appendChild($player);
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createEnemy($game, x, y) {
  const $element = document.createElement('img');
  $element.src = 'img/enemy-blue-1.png';
  $element.className = 'enemy';
  $game.appendChild($element);
  const enemy = { x, y, $element, isDead: false };
  GAME_STATE.enemies.push(enemy);
  setPosition($element, x, y);
}

function createLaser($game, x, y) {
  const $element = document.createElement('img');
  $element.src = 'img/laser-blue-1.png';
  $element.className = 'laser';
  $game.appendChild($element);
  const laser = { x, y, $element, isDead: false };
  GAME_STATE.lasers.push(laser);
  setPosition($element, x, y);
  const audio = new Audio('sound/sfx-laser1.ogg');
  audio.play();
}

function init() {
  const $game = document.querySelector('.game');
  createPlayer($game);

  const enemySpacing = (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1);
  for (let j = 0; j < 3; j++) {
    const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
    for (let i = 0; i < ENEMIES_PER_ROW; i++) {
      const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING;
      createEnemy($game, x, y);
    }
  }
}

function updatePlayer(dt, $game) {
  if (GAME_STATE.leftPressed) {
    GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
  }
  if (GAME_STATE.rightPressed) {
    GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
  }

  GAME_STATE.playerX = clamp(GAME_STATE.playerX, PLAYER_WIDTH, GAME_WIDTH - PLAYER_WIDTH);

  if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
    createLaser($game, GAME_STATE.playerX, GAME_STATE.playerY);
    GAME_STATE.playerCooldown = LASER_COOLDOWN;
  }
  if (GAME_STATE.playerCooldown > 0) {
    GAME_STATE.playerCooldown -= dt;
  }

  const $player = document.querySelector('.player');
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function destroyEnemy($game, enemy) {
  $game.removeChild(enemy.$element);
  enemy.isDead = true;
}

function destroyLaser($game, laser) {
  $game.removeChild(laser.$element);
  laser.isDead = true;
}

function updateLasers(dt, $game) {
  const lasers = GAME_STATE.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y -= dt * LASER_MAX_SPEED;
    if (laser.y < 0) {
      destroyLaser($game, laser);
    } else {
      setPosition(laser.$element, laser.x, laser.y);
      const r1 = laser.$element.getBoundingClientRect();
      const enemies = GAME_STATE.enemies;
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];
        if (enemy.isDead) continue;
        const r2 = enemy.$element.getBoundingClientRect();
        if (rectIntersect(r1, r2)) {
          destroyEnemy($game, enemy);
          destroyLaser($game, laser);

          // Increment score
          GAME_STATE.score += 10;

          // Check if all enemies are destroyed (win condition)
          if (GAME_STATE.enemies.every(enemy => enemy.isDead)) {
            showCongratulations();
          }
          break;
        }
      }
    }
  }
  GAME_STATE.lasers = GAME_STATE.lasers.filter(laser => !laser.isDead);
}

function updateEnemies(dt, $game) {
  const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
  const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

  const enemies = GAME_STATE.enemies;
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.isDead) continue;

    const x = enemy.x + dx;
    const y = enemy.y + dy;
    setPosition(enemy.$element, x, y);

    if (y + enemy.$element.height > GAME_HEIGHT) {
      showGameOver();
      break;
    }
  }
}

function rectIntersect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

function showCongratulations() {
  const $congratulations = document.querySelector('.congratulations');
  $congratulations.style.display = 'block';
  stopGame();
}

function showGameOver() {
  const $gameOver = document.querySelector('.game-over');
  $gameOver.style.display = 'block';
  stopGame();
}

function stopGame() {
  GAME_STATE.gameOver = true;
}

function resetGame() {
  const $game = document.querySelector('.game');
  const $congratulations = document.querySelector('.congratulations');
  const $gameOver = document.querySelector('.game-over');

  $congratulations.style.display = 'none';
  $gameOver.style.display = 'none';

  GAME_STATE.gameOver = false;
  GAME_STATE.lasers = [];
  GAME_STATE.enemies = [];
  GAME_STATE.playerX = GAME_WIDTH / 2;
  GAME_STATE.playerY = GAME_HEIGHT - 50;
  GAME_STATE.playerCooldown = 0;
  GAME_STATE.startTime = Date.now(); // Reset start time
  GAME_STATE.score = 0; // Reset score

  $game.innerHTML = '';
  init();
  window.requestAnimationFrame(update);
}

function updateHUD() {
  const $time = document.getElementById('time');
  const $score = document.getElementById('score');

  // Calculate elapsed time in seconds
  const elapsedTime = Math.floor((Date.now() - GAME_STATE.startTime) / 1000);
  $time.textContent = elapsedTime;

  // Update score
  $score.textContent = GAME_STATE.score;
}

function update() {
  if (GAME_STATE.gameOver) return;

  const currentTime = Date.now();
  const dt = (currentTime - GAME_STATE.lastTime) / 1000;

  const $game = document.querySelector('.game');
  updatePlayer(dt, $game);
  updateLasers(dt, $game);
  updateEnemies(dt, $game);

  // Update HUD
  updateHUD();

  GAME_STATE.lastTime = currentTime;
  window.requestAnimationFrame(update);
}

function onKeyDown(event) {
  if (event.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = true;
  } else if (event.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = true;
  } else if (event.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = true;
  }
}

function onKeyUp(event) {
  if (event.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = false;
  } else if (event.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = false;
  } else if (event.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = false;
  }
}

init();
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.requestAnimationFrame(update);