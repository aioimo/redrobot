class Player {
  constructor(x = 0, y = 0) {
    console.log("contructor Player called")
    this.name = "Red Robot";
    this.x = x;
    this.y = y;
    this.startingX = x;
    this.startingY = y;
    this.color = "red";
    this.score = 0;
    this.img = new Image();
    this.img.src = "../images/redRobot.jpg"
  }

  //determines point value of a given space 
  evaluateCoordinate(y,x) {  
    console.log("evalue coordinate called from Player");
    if (y < 0 || x < 0 || game.world.length-1 < y || game.world.length-1 < x) return -1 
    if (game.world[y][x] instanceof Player) return -1 
    if (typeof game.world[y][x] == "string" && game.world[y][x] != this.color) return 5
    if (game.world[y][x] == null) return 2
     //if game.world[y][x] == own color --> return 1
    else return 1
  }

  executeMove(direction) {
    game.world[this.y][this.x] = this.color;
    switch(direction) {
      case "north":
        this.moveNorth()
        break;
      case "east":
        this.moveEast();
        break;
      case "west":
        this.moveWest();
        break;
      case "south":
        this.moveSouth();
        break;
      default:
        break;
    }
    game.world[this.y][this.x] = this
  }

  moveNorth() {
    this.y -= 1;
  }
  moveEast() {
    this.x += 1;
  }
  moveWest() {
    this.x -= 1;
  }
  moveSouth() {
    this.y += 1;
  }


  reset() {
    this.x = this.startingX;
    this.y = this.startingY;
    this.score = 0;
    
  }

}

class AIPlayer extends Player {
  constructor(name, color, src="", x=0, y=0) {
    super();
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.startingX = x;
    this.startingY = y;
    this.img = new Image();
    this.img.src = src
    this.nextPossibleMoves = {north: 0, east: 0, west: 0, south: 0, stay: 0}
  }

  //evaluates the coordinates of the 4 adjacent squares
  // and updates nextPossibleMoves object
  lookAround() {      
    this.nextPossibleMoves.north = this.evaluateCoordinate(this.y-1,this.x)
    this.nextPossibleMoves.east = this.evaluateCoordinate(this.y,this.x+1)
    this.nextPossibleMoves.south = this.evaluateCoordinate(this.y+1,this.x)
    this.nextPossibleMoves.west = this.evaluateCoordinate(this.y,this.x-1)
  }


  //Looks in nextPossibleMoves object 
  //and returns the best move (randomly breaks ties)
  determineBestMove() {  
    let valueOfBestMove = maxInArray(Object.values(this.nextPossibleMoves))
    let bestMoves = ["north","east","west","south","stay"].filter(direction => {  
      return this.nextPossibleMoves[direction] == valueOfBestMove
    })
    let r = Math.floor(Math.random()*bestMoves.length)
    return bestMoves[r]
  }

  reset() {
    this.x = this.startingX;
    this.y = this.startingY;
    this.score = 0;
    this.nextPossibleMoves = {north: 0, east: 0, west: 0, south: 0, stay: 0}
  }

}

class EasyAI extends AIPlayer {
  constructor(name, color, src="", x=0, y=0) {
    super(name,color, src,x,y);
  }

  evaluateCoordinate(y,x) {  
    console.log("evalue coordinate Easy AI called")
    if (y < 0 || x < 0 || game.world.length-1 < y || game.world.length-1 < x) {
      return -1 
    } else if (game.world[y][x] instanceof Player) {
      return -1
    } else if (typeof game.world[y][x] == "string" && game.world[y][x] != this.color) {
      return 1
    } else if (game.world[y][x] == null) {
      return 1
    } else return 1
  }
}

class FairAI extends AIPlayer {
  constructor(name, color, src="", x=0, y=0) {
    super(name,color, src,x,y);
  }

  evaluateCoordinate(y,x) {
    console.log("evalue coordinate Fair AI called")
    if (y < 0 || x < 0 || game.world.length-1 < y || game.world.length-1 < x) return -1 
    if (game.world[y][x] instanceof Player) return -1
    if (typeof game.world[y][x] == "string") {
      if (this.checkIfOwnColor(game.world[y][x])) {
        return 1    //stepping on own color is least preferred
      } else if (this.checkIfLeadingPlayersColor(game.world[y][x])) {
        return 5    //stepping on the leader's color is most preferred
      } else {
        return 3    //stepping on anohter player (who isn's leader) is second preferred
      }
    }
    if (game.world[y][x] == null) return 2
   return 1
  }

  checkIfLeadingPlayersColor(color) {
    console.log(this.name, "thinks", game.allPlayers[0], "is in the lead")
    return game.allPlayers[0].color === color
  }

  checkIfOwnColor(color) {
    return this.color === color;
  }

}


/*

class Player {
  constructor(ctx, world) {
    this.name = "Red Robot";
    this.x = 0;
    this.y = 0;
    this.color = "red";
    this.world = world;
    this.score = 0;
    this.img = new Image();
    this.img.src = "../images/redRobot.jpg"
  }

  //determines point value of a given space 
  evaluateCoordinate(y,x) {  
    if (y < 0 || x < 0 || this.world.length-1 < y || this.world.length-1 < x) return -1 
    if (this.world[y][x] instanceof Player) return -1 
    if (typeof this.world[y][x] == "string" && this.world[y][x] != this.color) return 5
    if (this.world[y][x] == null) return 2
     //if this.world[y][x] == own color --> return 1
    else return 1
  }

  executeMove(direction) {
    this.world[this.y][this.x] = this.color;
    switch(direction) {
      case "north":
        this.moveNorth()
        break;
      case "east":
        this.moveEast();
        break;
      case "west":
        this.moveWest();
        break;
      case "south":
        this.moveSouth();
        break;
      default:
        break;
    }
    this.world[this.y][this.x] = this
  }

  moveNorth() {
    this.y -= 1;
  }
  moveEast() {
    this.x += 1;
  }
  moveWest() {
    this.x -= 1;
  }
  moveSouth() {
    this.y += 1;
  }


}



class AIPlayer extends Player {
  constructor(name, color, world, src="", x=0, y=0) {
    super();
    this.name = name,
    this.color = color;
    this.x = x;
    this.y = y;
    this.world = world;
    this.img = new Image();
    this.img.src = src
    this.nextPossibleMoves = {north: 0, east: 0, west: 0, south: 0, stay: 0}
  }

  //evaluates the coordinates of the 4 adjacent squares
  // and updates nextPossibleMoves object
  lookAround() {      
    this.nextPossibleMoves.north = this.evaluateCoordinate(this.y-1,this.x)
    this.nextPossibleMoves.east = this.evaluateCoordinate(this.y,this.x+1)
    this.nextPossibleMoves.south = this.evaluateCoordinate(this.y+1,this.x)
    this.nextPossibleMoves.west = this.evaluateCoordinate(this.y,this.x-1)
  }


  //Looks in nextPossibleMoves object 
  //and returns the best move (randomly breaks ties)
  determineBestMove() {  
    let valueOfBestMove = maxInArray(Object.values(this.nextPossibleMoves))
    let bestMoves = ["north","east","west","south","stay"].filter(direction => {  
      return this.nextPossibleMoves[direction] == valueOfBestMove
    })
    let r = Math.floor(Math.random()*bestMoves.length)
    return bestMoves[r]
  }
}

class AIPlayerHard extends AIPlayer {
  constructor(name, color, world, x=0, y=0) {
    super(name, color, world, x,y);
  }
 lookAround() {
    this.nextPossibleMoves.north = 2*this.evaluateCoordinate(this.y-1,this.x) + this.evaluateCoordinate(this.y-1,this.x-1) + this.evaluateCoordinate(this.y-1,this.y-2) + this.evaluateCoordinate(this.y-1,this.x+1)
    this.nextPossibleMoves.east = 2*this.evaluateCoordinate(this.y,this.x+1) + this.evaluateCoordinate(this.y-1,this.x+1) + this.evaluateCoordinate(this.y,this.x+2) + this.evaluateCoordinate(this.y+1,this.x+1)

    this.nextPossibleMoves.south = 2*this.evaluateCoordinate(this.y+1,this.x) + this.evaluateCoordinate(this.y+2,this.x) + this.evaluateCoordinate(this.y+1,this.x+1) + this.evaluateCoordinate(this.y+1,this.x-1)

    this.nextPossibleMoves.west = 2*this.evaluateCoordinate(this.y,this.x-1) + this.evaluateCoordinate(this.y,this.x-2) + this.evaluateCoordinate(this.y+1,this.x-1) + this.evaluateCoordinate(this.y-1,this.x-1)
  } 
}

*/