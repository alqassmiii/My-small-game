const key_CODE_LEFT = 37;
const key_CODE_RIGHT = 39; 
const key_CODE_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const PLAYER_WIDTH = 20;

const PLAYER_MAX_SPEED = 600;
const LASER_MAX_SPEED = 300;    
const LASER_COOLDOWN = 0.1;

const ENEMIES_PER_ROW = 10;
const ENEMY_HORIZONTAL_PADDING = 80;
const ENEMY_VERTICAL_PADDING = 70;
const ENEMY_VERTICAL_SPACING = 80;


 
function rectIntersect(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: GAME_WIDTH / 2, 
    playerY: GAME_HEIGHT - 50, 
    playerCooldown: 0,
    lasers: [],
    enemies: []
};

function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px)`;
}


function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function createPlayer($game ) {
    const $player = document.createElement('img');
    $player.src = 'img/player-blue-1.png';
    $player.className = 'player';
    $game.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
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

function updatePlayer(Dt , $game) {
    if (GAME_STATE.leftPressed) {
        GAME_STATE.playerX -= Dt * PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.rightPressed) {
        GAME_STATE.playerX += Dt * PLAYER_MAX_SPEED;
    }

    GAME_STATE.playerX = clamp(
        GAME_STATE.playerX, 
        PLAYER_WIDTH, 
        GAME_WIDTH - PLAYER_WIDTH
    );

    if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
        createLaser($game, GAME_STATE.playerX, GAME_STATE.playerY);
        GAME_STATE.playerCooldown = LASER_COOLDOWN;
    }
    if (GAME_STATE.playerCooldown > 0) {
        GAME_STATE.playerCooldown -= Dt;
    }
    const $player = document.querySelector('.player');
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);

    
}
function destroyEnemy($game, enemy) {
    $game.removeChild(enemy.$element);
    enemy.isDead = true;    
   
}

function destroyLaser($game, laser) {
    laser.isDead = true;
    if (laser.$element.parentNode === $game) {
        $game.removeChild(laser.$element);
    }
}

function updateLasers(Dt , $game) {
   const lasers = GAME_STATE.lasers;
   for (let i = 0; i < lasers.length; i++) {
       const laser = lasers[i];
       laser.y -= Dt * LASER_MAX_SPEED;
       if (laser.y < -laser.$element.height) {
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
                   break;
               }
           }
       }
   }
   GAME_STATE.lasers = GAME_STATE.lasers.filter(laser => laser.y > -laser.$element.height);
}

function updateEnemies(Dt , $game) {
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

    const enemies = GAME_STATE.enemies;
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const x = enemy.x + dx;
        const y = enemy.y + dy;
        setPosition(enemy.$element, x, y);
    }
}
function createLaser($game , x ,y) {
    
    const $element = document.createElement('img');
    $element.src = 'img/laser-blue-1.png';
    $element.className = 'laser';
    $game.appendChild($element);
    const laser = {x, y, $element};
    GAME_STATE.lasers.push(laser);
    setPosition($element, x, y);
    const audio = new Audio('sound/sfx-laser1.ogg');
    audio.play();
    }


    function createEnemy($game, x, y) {
        const $element = document.createElement('img');
        $element.src = 'img/enemy-blue-1.png';
        $element.className = 'enemy';
        $game.appendChild($element);
        const enemy = {x, y, $element};
        GAME_STATE.enemies.push(enemy);
        setPosition($element, x, y);
    }
    
function update() {
    const currentTime = Date.now();
    const Dt = (currentTime - GAME_STATE.lastTime) / 1000;

    const $game = document.querySelector('.game');
    updatePlayer(Dt , $game);
    updateLasers(Dt, $game);
    updateEnemies(Dt, $game);

    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
}

function onkeyDown(event) {
if (event.keyCode === key_CODE_LEFT) {
    GAME_STATE.leftPressed = true;
 } else if (event.keyCode === key_CODE_RIGHT) {
        GAME_STATE.rightPressed = true;
    
    } else if (event.keyCode === key_CODE_SPACE) {
        GAME_STATE.spacePressed = true;
    }

}


function onkeyUp(event) {
    if (event.keyCode === key_CODE_LEFT) {
        GAME_STATE.leftPressed = false;
     } else if (event.keyCode === key_CODE_RIGHT) {
            GAME_STATE.rightPressed = false;
        } else if (event.keyCode === key_CODE_SPACE) {
            GAME_STATE.spacePressed = false;
        }
    
    }
init();
window.addEventListener('keydown', onkeyDown);
window.addEventListener('keyup', onkeyUp);
window.requestAnimationFrame(update);