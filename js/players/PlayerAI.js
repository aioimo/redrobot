class PlayerAI extends Player {
  constructor(name, color, src = "", x = 0, y = 0) {
    super();
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.startingX = x;
    this.startingY = y;
    this.img = new Image();
    this.img.src = src;
    this.nextPossibleMoves = { north: 0, east: 0, west: 0, south: 0, stay: 0 };
  }

  //evaluates the coordinates of the 4 adjacent squares
  // and updates nextPossibleMoves object
  lookAround() {
    this.nextPossibleMoves.north = this.evaluateCoordinate(this.y - 1, this.x);
    this.nextPossibleMoves.east = this.evaluateCoordinate(this.y, this.x + 1);
    this.nextPossibleMoves.south = this.evaluateCoordinate(this.y + 1, this.x);
    this.nextPossibleMoves.west = this.evaluateCoordinate(this.y, this.x - 1);
  }

  //determines point value of a given space
  evaluateCoordinate(y, x) {
    if (
      y < 0 ||
      x < 0 ||
      game.world.length - 1 < y ||
      game.world.length - 1 < x ||
      !game.world[y][x].passable
    ) {
      return -1;
    }

    let r = Math.random();

    //Square does not belong to an opponent.
    if (this.checkIfBlank(game.world[y][x]) && r > 0.925) return 8;
    if (this.checkIfBlank(game.world[y][x])) return 2;
    if (this.checkIfOwnColor(game.world[y][x])) return 1;

    //Square belongs to an opponent.
    let durationQuotient = game.world[y][x].duration / game.maxDuration;
    if (this.checkIfLeadingPlayersColor(game.world[y][x]))
      return 5 + durationQuotient;
    if (this.checkIfOpponentsColor(game.world[y][x]))
      return 5 + durationQuotient;
    else return 1;
  }

  //Looks in nextPossibleMoves object
  //and returns the best move (randomly breaks ties)
  determineBestMove() {
    let valueOfBestMove = maxInArray(Object.values(this.nextPossibleMoves));
    let bestMoves = ["north", "east", "west", "south", "stay"].filter(
      direction => {
        return this.nextPossibleMoves[direction] == valueOfBestMove;
      }
    );
    let r = Math.floor(Math.random() * bestMoves.length);
    return bestMoves[r];
  }

  reset() {
    this.x = this.startingX;
    this.y = this.startingY;
    this.score = 0;
    this.connected = true;
    this.nextPossibleMoves = { north: 0, east: 0, west: 0, south: 0, stay: 0 };
  }
}