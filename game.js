const key_CODE_LEFT = 37;
const key_CODE_RIGHT = 39; 
const key_CODE_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const PLAYER_WIDTH = 20;

const PLAYER_MAX_SPEED = 600;

const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePrerssed: false,
    playerX: 0,
    playerY: 0,
};


function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px)`;
}


function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function createPlayer($game) {
GAME_STATE.playerX = GAME_WIDTH / 2;
GAME_STATE.playerY = GAME_HEIGHT - 50;
const $player = document.createElement('img');
$player.src = '/StartCopy/img/player-blue-1.png';
$player.className = 'player';
$game.appendChild($player);
setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);

}


function init() {
    const $game = document.querySelector('.game');
    createPlayer($game);
} 

function updatePlayer(Dt) {

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

    const $player = document.querySelector('.player');
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);

    
}

function update() {
    const currentTime = Date.now();
    const Dt = (currentTime - GAME_STATE.lastTime) / 1000;

    updatePlayer(Dt);

    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
}

function onkeyDown(event) {
if (event.keyCode === key_CODE_LEFT) {
    GAME_STATE.leftPressed = true;
 } else if (event.keyCode === key_CODE_RIGHT) {
        GAME_STATE.rightPressed = true;
    
    } else if (event.keyCode === key_CODE_SPACE) {
        GAME_STATE.spacePrerssed = true;
    }

}


function onkeyUp(event) {
    if (event.keyCode === key_CODE_LEFT) {
        GAME_STATE.leftPressed = false;
     } else if (event.keyCode === key_CODE_RIGHT) {
            GAME_STATE.rightPressed = false;
        } else if (event.keyCode === key_CODE_SPACE) {
            GAME_STATE.spacePrerssed = false;
        }
    
    }
init();
window.addEventListener('keydown', onkeyDown);
window.addEventListener('keyup', onkeyUp);
window.requestAnimationFrame(update);