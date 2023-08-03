// The Enemy class contain information about the enemy such as
// its position on screen. It will also provide methods for updating
// and destroying the enemy.
class Enemy {
  constructor(theRoot, enemySpot) {
    this.root = theRoot;
    this.spot = enemySpot;

    // The x position of the enemy is determined by its width and its spot. We need this information for the lifetime
    // of the instance, so we make it a property of the instance.
    this.x = enemySpot * ENEMY_WIDTH;

    // The y position is initially less than 0 so that the enemies fall from the top. This data is stored as a property
    // of the instance since it is needed throughout its lifetime. The destroyed property will indicate whether this enemy
    // is still in play. It is set to true whenever the enemy goes past the bottom of the screen.
    // It is used in the Engine to determine whether or not an enemy is in a particular column.
    this.y = -ENEMY_HEIGHT;
    this.destroyed = false;

    // enemy dimensions
    this.w = ENEMY_WIDTH;
    this.h = ENEMY_HEIGHT;

    // We create a new DOM element that will display the enemy image to the user. When the enemy is no longer needed,
    // we will use a reference to this DOM node to remove it from the game.
    this.domElement = document.createElement("img");

    this.domElement.src = "./images/rain_drop_cute_fixed.png";
    // CSS
    this.domElement.style.position = "absolute";
    this.domElement.style.left = `${this.x + 3}px`;
    this.domElement.style.top = `${this.y}px`;
    this.domElement.style.zIndex = 0;
    this.domElement.style.width = ENEMY_WIDTH;

    // Show that the user can actually see the img DOM node, we append it to the root DOM node.
    theRoot.appendChild(this.domElement);
    this.speed = Math.random() / 2 + 0.25;
  }

  // We set the speed property of the enemy. This determines how fast it moves down the screen.
  update(timeDiff) {
    // We update the y property of the instance in proportion of the amount of time
    // since the last call to update. We also update the top css property so that the image
    // is updated on screen
    this.y = this.y + timeDiff * this.speed;
    this.domElement.style.top = `${this.y}px`;

    // If the y position of the DOM element is greater than the GAME_HEIGHT then the enemy is at the bottom
    // of the screen and should be removed. We remove the DOM element from the root DOM element and we set
    // the destroyed property to indicate that the enemy should no longer be in play
    if (this.y > GAME_HEIGHT) {
      this.removeEnemy();
    }
  }

  // remove enemy when destroyed or when new game
  removeEnemy = () => {
    this.root.removeChild(this.domElement);
    this.destroyed = true;
  };
}
