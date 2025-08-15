
# Space Game

A simple browser-based space shooter game. Move your spaceship, shoot enemies, and try to win!

## Project Structure

```
make-your-game/
│
├── index.html          # Main HTML file, game UI and structure
├── README.md           # Project documentation
├── css/
│   └── main.css        # Game styles and animations
├── js/
│   └── game.js         # Game logic and mechanics
├── img/
│   ├── background-blue.png
│   ├── enemy-blue-1.png
│   ├── laser-blue-1.png
│   ├── laser-red-1.png
│   └── player-blue-1.png
├── sound/
│   ├── sfx-laser1.ogg
│   └── sfx-lose.ogg
```

## How to Play

- Use **Left/Right arrow keys** to move your spaceship.
- Press **Space** to shoot lasers.
- Press **P** to pause/resume, **M** to mute/unmute sounds.
- Defeat all enemies to win. If you lose all lives, the game ends.

### Game Flow

1. Click **Start** or press **Space** to begin.
2. Your ship appears at the bottom of the screen.
3. Enemies spawn in rows and move in patterns.
4. Shoot enemies to score points. Avoid enemy lasers.
5. If all enemies are destroyed, you win!
6. If you lose all lives or enemies reach the bottom, it's game over.

### Controls

- **Left Arrow / Right Arrow**: Move ship horizontally
- **Space**: Shoot laser
- **P**: Pause/Resume game
- **M**: Mute/Unmute sound effects

### HUD

- **Time**: Shows elapsed time since game start
- **Score**: Points earned by destroying enemies
- **Lives**: Remaining lives

### Win & Lose Screens

- **Congratulations**: Displayed when all enemies are defeated
- **Game Over**: Displayed when lives reach zero or enemies reach the bottom

## Features

- Animated background and smooth controls.
- HUD showing time, score, and lives.
- Sound effects for shooting and losing.
- Win and Game Over screens.

- Responsive UI and button controls
- Pause and resume functionality
- Mute/unmute sound effects
- Modular code for easy customization

## Assets

- **Images**: Sprites for player, enemies, lasers, and background
- **Sounds**: Laser and lose sound effects (OGG format)

## Code Structure

- `index.html`: Sets up the game area, HUD, controls, and links CSS/JS
- `js/game.js`: Implements game logic:
	- Player/enemy movement
	- Shooting and collision detection
	- Score/lives tracking
	- Game state management (start, pause, win, lose)
	- Event listeners for keyboard controls
- `css/main.css`: Styles game elements, HUD, buttons, and animations

## Customization

- **Add new enemies**: Update `img/` and modify enemy creation in `game.js`
- **Change sounds**: Replace files in `sound/` and update paths in `game.js`
- **Adjust difficulty**: Tweak constants in `game.js` (enemy speed, lives, etc.)
- **Style UI**: Edit `css/main.css` for colors, layout, and effects

## Credits

- Game logic and design: [Your Name]
- Sprites: Open source or custom
- Sound effects: Open source or custom

## License

This project is open source. Feel free to use, modify, and share!

## How it Works

- `index.html`: Sets up the game area, HUD, and controls.
- `js/game.js`: Handles player/enemy movement, shooting, collision detection, scoring, and game state.
- `css/main.css`: Styles the game, HUD, buttons, and animations.
- `img/`: Contains sprites for player, enemies, lasers, and background.
- `sound/`: Contains sound effects for actions.

## Getting Started

1. Open `index.html` in your browser.
2. Click **Start** or press **Space** to begin.
3. Use the controls to play!
