// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  constructor(theRoot) {
    this.root = theRoot;

    this.player = new Player(this.root);

    this.enemies = [];

    // the number of lives when you start the game
    this.lives = 9;
    this.displayLives();

    // text container at the beginning of the game or at the game over
    this.createTextContainer();

    // background image to the game
    addBackground(this.root);

    // score of enemies avoided
    this.score = 0 - MAX_ENEMIES;
    this.displayScore();

    // pressing the key starts the game
    addEventListener("keypress", this.startKey);

    //function that was in the main.js, for moving the player with left and right keys
    addEventListener("keydown", this.keydownHandler);
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.

    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    // removes all the destroyed enemies from the array referred to by \`this.enemies\`.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
      // update score text
      this.updateScore();
    }

    // check if player is dead
    if (this.isPlayerDead()) {
      this.lives -= 1;
      this.updateLives();
      if (this.lives === 0) {
        this.endGame();
      } else {
        this.displayGameOver();
      }
      return;
    }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  isPlayerDead = () => {
    const isPlayerCollided = this.enemies.some((enemy) => {
      if (
        this.player.x < enemy.x + enemy.w &&
        this.player.x + this.player.w > enemy.x &&
        this.player.y < enemy.y + enemy.h &&
        this.player.h + this.player.y > enemy.y
      ) {
        return true;
      }
      return false;
    });
    return isPlayerCollided;
  };

  // display the score
  displayScore = () => {
    // score number
    const score = document.createElement("p");
    score.setAttribute("id", "score");
    // raindrop picture
    const raindrop = document.createElement("img");
    raindrop.src = "./images/rain_drop_cute_fixed.png";
    raindrop.setAttribute("id", "raindrop");
    // avoided text
    const avoided = document.createElement("p");
    avoided.setAttribute("id", "avoided");
    // put into array to make it easier of setting styles that are all the same for those elements
    const scoreText = [score, raindrop, avoided];

    scoreText.forEach((element) => {
      element.style.fontFamily = "VT323, monospace";
      element.style.fontSize = "1.5rem";
      element.style.color = "#c482c4f7";
      element.style.position = "absolute";
      element.style.textAlign = "right";
      element.style.zIndex = 2;
      element.style.visibility = "hidden";
    });

    score.style.top = 0;
    score.style.left = "263px";

    avoided.style.top = 0;
    avoided.style.left = "298px";
    raindrop.style.top = "21px";
    raindrop.style.left = "272px";

    raindrop.style.width = "25px";
    raindrop.style.position = "absolute";

    this.root.appendChild(score);
    this.root.appendChild(raindrop);
    this.root.appendChild(avoided);
  };

  // updates the score during the game
  updateScore = () => {
    const score = document.getElementById("score");
    const avoided = document.getElementById("avoided");
    const raindrop = document.getElementById("raindrop");
    score.style.visibility = "visible";
    avoided.style.visibility = "visible";
    raindrop.style.visibility = "visible";
    this.score += 1;
    score.innerText = `${this.score}`;
    // to make space for the number the more it grows
    if (this.score >= 10) {
      score.style.left = "253px";
    }
    if (this.score >= 100) {
      score.style.left = "243px";
    }
    avoided.innerText = "avoided";
  };

  // display lives
  displayLives = () => {
    // lives number
    const lives = document.createElement("p");
    lives.setAttribute("id", "lives");
    // player picture
    const playerIcon = document.createElement("img");
    playerIcon.src = "./images/purple_cat_test.png";
    playerIcon.setAttribute("id", "player-icon");

    // put into array to make it easier of setting styles that are all the same for those elements
    const livesText = [lives, playerIcon];

    livesText.forEach((element) => {
      element.style.fontFamily = "VT323, monospace";
      element.style.fontSize = "1.5rem";
      element.style.color = "#c482c4f7";
      element.style.position = "absolute";
      element.style.textAlign = "right";
      element.style.zIndex = 2;
      element.style.visibility = "hidden";
    });

    lives.style.top = 0;
    lives.style.left = "47px";

    playerIcon.style.top = "26px";
    playerIcon.style.left = "20px";
    playerIcon.style.width = "25px";

    this.root.appendChild(lives);
    this.root.appendChild(playerIcon);
  };

  // updates the lives after each game over
  updateLives = () => {
    const lives = document.getElementById("lives");
    const playerIcon = document.getElementById("player-icon");
    lives.style.visibility = "visible";
    playerIcon.style.visibility = "visible";
    lives.innerText = `${this.lives}`;
  };

  // create text container and the basics style of the elements that will be inside
  createTextContainer = () => {
    // container
    const textContainer = document.createElement("div");
    textContainer.setAttribute("id", "container");
    textContainer.style.backgroundColor = "rgb(135 65 135 / 77%)";
    textContainer.style.width = GAME_WIDTH - 10;
    textContainer.style.height = "150px";
    textContainer.style.position = "absolute";
    textContainer.style.zIndex = 1;
    textContainer.style.display = "none";
    textContainer.style.marginTop = "160px";
    textContainer.style.marginLeft = "5px";
    textContainer.style.marginRight = "5px";
    this.root.appendChild(textContainer);

    // main text (at the start of the game over text)
    const mainText = document.createElement("p");
    mainText.setAttribute("id", "main-text");
    mainText.style.fontFamily = "VT323, monospace";
    mainText.style.color = "white";
    mainText.style.position = "absolute";
    mainText.style.textAlign = "center";
    mainText.style.marginTop = "10px";
    mainText.style.marginBottom = 0;
    mainText.style.zIndex = 2;
    mainText.style.width = "200px";
    mainText.style.left = GAME_WIDTH / 2 - 100;
    textContainer.appendChild(mainText);

    // explanation text
    const message = document.createElement("p");
    message.setAttribute("id", "message");
    message.style.fontFamily = "VT323, monospace";
    message.style.color = "white";
    message.style.position = "absolute";
    message.style.textAlign = "center";
    message.style.zIndex = 2;
    message.style.right = "10px";
    message.style.left = "10px";
    textContainer.appendChild(message);

    // button
    const toStartButton = document.createElement("button");
    toStartButton.setAttribute("id", "start-button");
    toStartButton.style.fontFamily = "VT323, monospace";
    toStartButton.style.color = "rgb(135 65 135 / 77%)";
    toStartButton.style.backgroundColor = "#ffffffdb";
    toStartButton.style.border = "none";
    toStartButton.style.borderRadius = "10px";
    toStartButton.style.position = "absolute";
    toStartButton.style.zIndex = 2;
    textContainer.appendChild(toStartButton);
  };

  // display the start game elements
  displayStartGame = () => {
    // start text
    const startText = document.getElementById("main-text");
    startText.innerText = "Help the kitty!";
    startText.style.fontSize = "2rem";

    // message explaining game
    const message = document.getElementById("message");
    message.innerText =
      "Poor kitty is stuck in the forest during an acid rain. Good thing it is so agile it can avoid raindrops! Use arrow keys LEFT and RIGHT to move. Press ENTER or click Start to start.";
    message.style.fontSize = "0.98rem";
    message.style.marginTop = "46px";

    // start button
    const startButton = document.getElementById("start-button");
    startButton.innerText = "Start";
    startButton.style.fontSize = "1.5rem";
    startButton.style.top = "114px";
    startButton.style.width = "105px";
    startButton.style.left = GAME_WIDTH / 2 - 52.5;
    startButton.addEventListener("click", this.startClick);

    // display
    const textContainer = document.getElementById("container");
    textContainer.style.display = "block";
  };

  // displaying the game over elements
  displayGameOver = () => {
    // game over text
    const gameOverText = document.getElementById("main-text");
    gameOverText.innerText = "Game Over";
    gameOverText.style.fontSize = "3rem";

    // restart button
    const restartButton = document.getElementById("start-button");
    restartButton.innerText = "Restart";
    restartButton.style.fontSize = "2rem";
    restartButton.style.top = "98px";
    restartButton.style.width = "150px";
    restartButton.style.left = GAME_WIDTH / 2 - 70.8;
    restartButton.addEventListener("click", this.restartClick);
    addEventListener("keypress", this.restartKey);

    // display
    const textContainer = document.getElementById("container");
    textContainer.style.display = "block";

    // the message under the game over text, changing depending of the score
    const message = document.getElementById("message");
    message.style.fontSize = "1rem";
    message.style.marginTop = "55px";

    if (this.score < 5) {
      message.innerText =
        "HINT: AVOID the deadly raindrops. Hope this helped! Press ENTER or click Restart to try again.";
    } else if (this.score < 50) {
      message.innerText =
        "Ah... seems like you killed the kitty... Press ENTER or click Restart to try again.";
    } else if (this.score < 100) {
      message.innerText =
        "This rain sure seems interminable, like literally! Press ENTER or click Restart to try again.";
    } else {
      message.innerText =
        "This rain does not stop ha ha... Press ENTER or click Restart if you cannot let the kitty rest peacefully.";
    }

    //makes it not possible to move around the dead player
    removeEventListener("keydown", this.keydownHandler);
  };

  // restart the game with button click
  restartClick = () => {
    const textContainer = document.getElementById("container");
    const score = document.getElementById("score");

    score.style.left = "263px";
    textContainer.style.display = "none";

    this.player.resetPlayer();
    this.enemies.forEach((enemy) => {
      enemy.removeEnemy();
    });
    this.enemies = [];
    this.score = 0 - MAX_ENEMIES;

    // removing the action of pressing the enter key so that it does not reset our game without the game over
    removeEventListener("keypress", this.restartKey);
    // so the player can move again
    addEventListener("keydown", this.keydownHandler);

    this.gameLoop();
  };

  // restart the game with enter key after game over
  restartKey = (event) => {
    if (event.key === "Enter") {
      this.restartClick();
    }
  };

  // start game with button click
  startClick = () => {
    const textContainer = document.getElementById("container");
    textContainer.style.display = "none";
    removeEventListener("keypress", this.startKey);
    this.updateLives();
    this.gameLoop();
  };

  // start game with enter key
  startKey = (event) => {
    if (event.key === "Enter") {
      this.startClick();
    }
  };

  // end of the game when 0 lives left
  endGame = () => {
    // ending game text
    const endGame = document.getElementById("main-text");
    endGame.innerText = "End of the Game";
    endGame.style.fontSize = "2rem";

    // restart button
    const restartButton = document.getElementById("start-button");
    restartButton.style.display = "none";

    // display
    const textContainer = document.getElementById("container");
    textContainer.style.display = "block";

    // the message under the game over text, changing depending of the score
    const message = document.getElementById("message");
    message.style.fontSize = "1rem";
    message.style.marginTop = "53px";

    message.innerText =
      "No more lives to spare. The kitty has fallen indefinitely. Its death was a reminder that even the best of us are vulnerable to the whims of fate. Thank you for playing.";

    //makes it not possible to move around the dead player
    removeEventListener("keydown", this.keydownHandler);
    // removes the ability to restart the game
    removeEventListener("keypress", this.restartKey);
  };

  // moved this function from the main.js so that i could access it (function to move the player)
  keydownHandler = (event) => {
    if (event.code === "ArrowLeft") {
      gameEngine.player.moveLeft();
    }
    if (event.code === "ArrowRight") {
      gameEngine.player.moveRight();
    }
  };
}
