function Board () {
  this.matrix = [];
  this.score  = 0;

  for (var i = 0; i < 4; i++) {
    this.matrix.push([]);

    for (var j = 0; j < 4; j++) {
      this.matrix[i].push(null);
    }
  }

  for (i = 0; i < 2; i++) {
    this._generateTile();
  }
}

Board.prototype._renderBoard = function () {
  for (var i = 0; i < 4; i++) {
    console.log(this.matrix[i]);
  }

  this._printScore();
};

Board.prototype._generateTile = function () {
  var initialValues = [2, 4];
  var random        = Math.random();
  var pos           = this._getAvailablePosition();

  if (pos)
    this.matrix[pos.x][pos.y] = random < 0.8 ? initialValues[0] : initialValues[1];
};

Board.prototype._getAvailablePosition = function () {
  var availablePositions = [];

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (this.matrix[i][j] === null) {
        availablePositions.push({ x: i, y: j });
      }
    }
  }

  if (availablePositions.length === 0) {
    return false;
  } else {
    var randomPosition = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[randomPosition];
  }
};

Board.prototype._moveLeft = function () {
  var newBoard = [];
  var that = this;

  this.matrix.forEach (function (row) {
    var newRow = row.filter(function (i) { return i !== null; });

    for(i = 0; i < newRow.length - 1; i++) {
      if (newRow[i+1] === newRow[i]) {
        var value = newRow[i] * 2;
        newRow[i+1] = value;
        that._updateScore(value);
        console.log(that._win(value));
        newRow[i] = null;
      }
    }

    var merged = newRow.filter( function (i) { return i !== null; });
    while(merged.length < 4) { merged.push(null); }
    newBoard.push(merged);
  });

  this.matrix = newBoard;
};

Board.prototype._moveRight = function () {
  var newBoard = [];
  var that = this;
  this.matrix.forEach (function (row) {
    var newRow = row.filter(function (i) { return i !== null; });

    for(i = newRow.length-1; i > 0; i--) {
      if (newRow[i-1] === newRow[i]) {
        var value = newRow[i] * 2;
        newRow[i-1] = value;
        that._updateScore(value);
        console.log(that._win(value));
        newRow[i] = null;
      }
    }

    var merged = newRow.filter( function (i) { return i !== null; });
    while(merged.length < 4) { merged.unshift(null); }
    newBoard.push(merged);
  });

  this.matrix = newBoard;
};

Board.prototype._moveUp = function () {
  this._transposeMatrix();
  this._moveLeft();
  this._transposeMatrix();
};

Board.prototype._moveDown = function () {
  this._transposeMatrix();
  this._moveRight();
  this._transposeMatrix();
};

Board.prototype.move = function (direction) {
  switch (direction) {
    case "up":    this._moveUp();    break;
    case "down":  this._moveDown();  break;
    case "left":  this._moveLeft();  break;
    case "right": this._moveRight(); break;
  }

  this._generateTile();
  this._renderBoard();
};

Board.prototype._transposeMatrix = function() {
  for (var row = 0; row < this.matrix.length; row++) {
    for (var column = row+1; column < this.matrix.length; column++) {
      var temp = this.matrix[row][column];
      this.matrix[row][column] = this.matrix[column][row];
      this.matrix[column][row] = temp;
    }
  }
};

Board.prototype._updateScore = function(pointsGained) {
  this.score += pointsGained;
};

Board.prototype._printScore = function() {
  console.log("Score:", this.score);
};

Board.prototype._win = function(value) {
  if (value == 2048)
    return true;
};

var board = new Board();
board._renderBoard();
