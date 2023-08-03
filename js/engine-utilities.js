// In this file we have functions that will be used in the Engine.js file.
// nextEnemySpot is a variable that refers to a function. The function has one parameter,
// called enemies. enemies will refer to an array that will contain instances of the
// Enemy class.

// The purpose of this function is to determine in which slot to place our next enemy.
// The possibilities are 0, 1, 2, 3 or 4.
const nextEnemySpot = (enemies) => {
  // enemySpots refers to the number of spots available
  const enemySpots = GAME_WIDTH / ENEMY_WIDTH;

  const spotsTaken = [false, false, false, false, false];
  enemies.forEach((enemy) => {
    spotsTaken[enemy.spot] = true;
  });

  // candidate represents a potential spot. The variable will be repeatedly assigned different numbers.
  let candidate = undefined;
  while (candidate === undefined || spotsTaken[candidate]) {
    // candidate is assigned a random number between 0 and enemySpots (not including enemySpots).
    candidate = Math.floor(Math.random() * enemySpots);
  }

  return candidate;
};

// The parameter represents the DOM node to which we will add the background
const addBackground = (root) => {
  // new img DOM node.
  const bg = document.createElement("img");

  // src attribute and the height and width CSS attributes
  bg.src = "images/rainy-forest.gif";
  bg.style.height = `${GAME_HEIGHT}px`;
  bg.style.width = `${GAME_WIDTH}px`;

  root.append(bg);

  // white div to hide the enemies after they reach the bottom
  const whiteBox = document.createElement("div");

  whiteBox.style.zIndex = 100;
  whiteBox.style.position = "absolute";
  whiteBox.style.top = `${GAME_HEIGHT}px`;
  whiteBox.style.height = `${ENEMY_HEIGHT}px`;
  whiteBox.style.width = `${GAME_WIDTH}px`;
  whiteBox.style.background = "#c1e9bd";
  root.append(whiteBox);
};
