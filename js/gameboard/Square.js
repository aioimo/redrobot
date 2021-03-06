class Square {
  constructor(color = null, duration = 0, pointValue = 1, passable = true) {
    this.occupyingPlayer = null;
    this.color = color;
    this.duration = duration;
    this.pointValue = pointValue;
    this.passable = passable;
  }

  isOccupied() {
    return this.occupyingPlayer != null;
  }

  isBlank() {
    return this.color === null;
  }

  isColored() {
    return this.color !== null;
  }

  addPlayerToSquare(player) {
    this.occupyingPlayer = player;
    this.color = player.color;
    this.passable = false;
    this.duration = 0;
  }

  removePlayerFromSquare(player) {
    this.occupyingPlayer = null;
    this.color = player.color;
    this.passable = true;
  }
}
