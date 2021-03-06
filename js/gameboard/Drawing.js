const BORDER_WIDTH = 2;
const BOX_SHADOW = 2;

class Drawing {
  constructor({ ctx, world, text, backgroundColor, scoreBoardColor }) {
    this.ctx = ctx;
    this.world = world;
    this.gameText = text;
    this.backgroundColor = backgroundColor;
    this.scoreBoardColor = scoreBoardColor;
    this.squareSize = (H_100 - 2 * Y_DISPLACEMENT) / this.world.length;
  }

  draw({ allPlayers, isGameOver, isRedRobotWinner, turnCounter }) {
    this.ctx.save();
    this.ctx.clearRect(0, 0, W_100, H_100);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, W_100, H_100);

    // Draw the board, squares, and characters
    for (let row = 0; row < this.world.length; row++) {
      for (let col = 0; col < this.world[row].length; col++) {
        const square = this.world[row][col];
        if (square.isOccupied()) {
          this.drawEmptySquare(row, col);
          this.drawCharacter(row, col);
        } else if (square.isBlank()) {
          this.drawEmptySquare(row, col);
        } else if (!square.isBlank()) {
          this.drawColoredSquare(row, col, square.color);
        }
      }
    }

    // Draw the impassable squares
    for (let row = 0; row < this.world.length; row++) {
      for (let col = 0; col < this.world[row].length; col++) {
        const square = this.world[row][col];
        if (!square.isOccupied() && !square.passable) {
          this.drawImpassableSquare(row, col);
        }
      }
    }
    this.drawScoreBoard({ allPlayers });
    this.drawStatusTextBox({
      isGameOver,
      allPlayers,
      isRedRobotWinner,
      turnCounter
    });
    this.ctx.restore();
  }

  drawEmptySquare(row, col) {
    this.ctx.save();
    this.ctx.fillStyle = '#F0F0F0';
    // this.ctx.fillStyle = "#white";
    this.ctx.translate(
      BOARD_X_DISPLACEMENT + this.squareSize * col,
      Y_DISPLACEMENT + this.squareSize * row
    );
    this.ctx.fillRect(
      BORDER_WIDTH,
      BORDER_WIDTH,
      this.squareSize - 2 * BORDER_WIDTH,
      this.squareSize - 2 * BORDER_WIDTH
    );

    this.ctx.restore();
  }

  drawColoredSquare(row, col, color) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = 'white';
    this.ctx.translate(
      BOARD_X_DISPLACEMENT + this.squareSize * col,
      Y_DISPLACEMENT + this.squareSize * row
    );
    this.ctx.fillRect(
      BORDER_WIDTH,
      BORDER_WIDTH,
      this.squareSize - 2 * BORDER_WIDTH,
      this.squareSize - 2 * BORDER_WIDTH
    );
    this.ctx.strokeRect(0, 0, this.squareSize, this.squareSize);
    this.ctx.restore();
  }

  drawImpassableSquare(row, col) {
    this.ctx.save();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    this.ctx.translate(
      BOARD_X_DISPLACEMENT + this.squareSize * col,
      Y_DISPLACEMENT + this.squareSize * row
    );
    this.ctx.strokeRect(0, 0, this.squareSize, this.squareSize);
    this.ctx.restore();
  }

  drawCharacter(row, col) {
    this.ctx.save();
    this.ctx.translate(
      BOARD_X_DISPLACEMENT + this.squareSize * col,
      Y_DISPLACEMENT + this.squareSize * row
    );
    this.ctx.drawImage(
      this.world[row][col].occupyingPlayer.img,
      0,
      0,
      this.squareSize,
      this.squareSize
    );
    this.ctx.restore();
  }

  drawStatusTextBox({ isGameOver, allPlayers, isRedRobotWinner, turnCounter }) {
    this.ctx.save();
    const textBoxWidth = W_100 - H_100 - X_DISPLACEMENT;
    const textBoxHeight = H_100 / 3 - Y_DISPLACEMENT + 50;
    const textBoxY = 75;
    const radius = 25;
    if (isGameOver) {
      this.gameText = [];
      this.gameText.push('Round Over');
      this.gameText.push('Winner is ' + allPlayers[0].name);
      this.gameText.push(`Turn: ${turnCounter}`);
    }
    if (isRedRobotWinner) {
      this.gameText.push('Congratulations!');
      this.gameText.push(
        'Click the button the right to play level ' + (levelCounter + 2)
      );
    }
    this.ctx.translate(X_DISPLACEMENT, textBoxY + H_100 / 2);
    drawRoundedBoard({
      ctx: this.ctx,
      boxShadow: BOX_SHADOW,
      width: textBoxWidth,
      height: textBoxHeight,
      radius,
      color: this.scoreBoardColor
    });

    //draw title
    this.ctx.font = '18px PokemonGB';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'white';
    wrapText(
      this.ctx,
      this.gameText[0],
      textBoxWidth / 2,
      50,
      textBoxWidth - 20,
      35
    );

    //draw other text
    this.ctx.font = '12px PokemonGB';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'white';
    for (let i = 1; i < this.gameText.length; i++) {
      wrapText(
        this.ctx,
        this.gameText[i],
        20,
        35 + 50 * i,
        textBoxWidth - 20,
        10
      );
    }

    this.ctx.restore();
  }

  drawScoreBoard({ allPlayers }) {
    this.ctx.save();
    const LEADERBOARD_HEIGHT = 40;
    const LEADERBOARD_MARGIN_BOTTOM = 10;
    const SPACE_BETWEEN_SCORES = 12;
    const SCORE_HEIGHT = 30;

    this.ctx.translate(X_DISPLACEMENT, Y_DISPLACEMENT);
    this.drawLeaderboardTitle(0, 0, LEADERBOARD_HEIGHT / 2);
    allPlayers.forEach((player, i) => {
      this.drawScorePanel({
        x: 0,
        y:
          LEADERBOARD_HEIGHT +
          LEADERBOARD_MARGIN_BOTTOM +
          i * (SPACE_BETWEEN_SCORES + SCORE_HEIGHT),
        player,
        radius: SCORE_HEIGHT / 2
      });
    });
    this.ctx.restore();
  }

  drawLeaderboardTitle(x, y, radius) {
    const HEIGHT = 2 * radius;
    const MAX_TEXT_SIZE = 25;
    const TEXT_SIZE = Math.min(radius, MAX_TEXT_SIZE);

    this.ctx.save();
    //background
    this.ctx.fillStyle = 'black';
    drawHalfCircleLeft({
      ctx: this.ctx,
      x: x + BOX_SHADOW + radius,
      y: y + BOX_SHADOW + radius,
      color: 'black',
      radius
    });
    drawHalfCircleRight({
      ctx: this.ctx,
      x: x + BOX_SHADOW + W_100 - H_100 - X_DISPLACEMENT - radius,
      y: y + BOX_SHADOW + radius,
      color: 'black',
      radius
    });
    this.ctx.fillRect(
      x + BOX_SHADOW + radius,
      y + BOX_SHADOW,
      W_100 - H_100 - X_DISPLACEMENT - HEIGHT,
      HEIGHT
    );

    //The panel
    this.ctx.fillStyle = this.scoreBoardColor;
    drawHalfCircleLeft({
      ctx: this.ctx,
      x: x + radius,
      y: y + radius,
      color: this.scoreBoardColor,
      radius
    });
    drawHalfCircleRight({
      ctx: this.ctx,
      x: x + W_100 - H_100 - X_DISPLACEMENT - radius,
      y: y + radius,
      color: this.scoreBoardColor,
      radius
    });
    this.ctx.fillRect(
      x + radius,
      y,
      W_100 - H_100 - X_DISPLACEMENT - HEIGHT,
      HEIGHT
    );

    //Text
    this.ctx.fillStyle = 'white';
    this.ctx.font = `${TEXT_SIZE}px PokemonGB`;
    let text = 'Leaderboard:';
    this.ctx.fillText(text, x + 60, y + radius + 0.5 * TEXT_SIZE);
    this.ctx.restore();
  }

  drawScorePanel({ x, y, player, radius = 30 }) {
    this.ctx.save();

    const DIAMETER = 2 * radius;
    const INDENT = 10;
    const MAX_TEXT_SIZE = 20;
    const TEXT_SIZE = Math.min(0.75 * radius, MAX_TEXT_SIZE);

    // background
    this.ctx.fillStyle = 'black';
    drawHalfCircleLeft({
      ctx: this.ctx,
      x: x + BOX_SHADOW + radius + INDENT,
      y: y + BOX_SHADOW + radius,
      color: 'black',
      radius
    });
    drawHalfCircleRight({
      ctx: this.ctx,
      x: x + BOX_SHADOW + W_100 - H_100 - X_DISPLACEMENT - radius,
      y: y + BOX_SHADOW + radius,
      color: 'black',
      radius
    });
    this.ctx.fillRect(
      x + BOX_SHADOW + radius + INDENT,
      y + BOX_SHADOW,
      W_100 - H_100 - X_DISPLACEMENT - DIAMETER - INDENT,
      DIAMETER
    );

    // The panel itself
    this.ctx.fillStyle = player.color;
    drawHalfCircleLeft({
      ctx: this.ctx,
      x: x + radius + INDENT,
      y: y + radius,
      color: player.color,
      radius
    });
    drawHalfCircleRight({
      ctx: this.ctx,
      x: x + W_100 - H_100 - X_DISPLACEMENT - radius,
      y: y + radius,
      color: player.color,
      radius
    });
    this.ctx.fillRect(
      x + radius + INDENT,
      y,
      W_100 - H_100 - X_DISPLACEMENT - DIAMETER - INDENT,
      DIAMETER
    );

    //Text
    this.ctx.fillStyle = 'white';
    this.ctx.font = `${TEXT_SIZE}px PokemonGB`;
    const textName = player.name;
    const yPosition = y + radius + 0.5 * TEXT_SIZE;
    //   this.ctx.fillText(text, x + 60, y + radius + 0.5 * TEXT_SIZE);
    this.ctx.fillText(textName, x + 60, yPosition);
    const textScore = player.score;
    this.ctx.fillText(textScore, x + 280 + INDENT, yPosition);
    this.ctx.restore();
  }
}
