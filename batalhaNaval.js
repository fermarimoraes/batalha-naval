var view = {
  displayMessage: function (msg) {
    var mensagemArea = document.getElementById("mensagemArea");
    mensagemArea.innerHTML = msg;
    console.log(mensagemArea);
  },
  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  },
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    {
      locations: [0,0,0],
      hits: ["", "", ""],
    },
    {
      locations: [0,0,0],
      hits: ["", "", ""],
    },
    {
      locations: [0,0,0],
      hits: ["", "", ""],
    },
  ],

  fire: function (guess) {
    // percorre todos os navios
    for (var i = 0; i < this.numShips; i++) {
      // armazena na variavel ship o navio na posição i
      var ship = this.ships[i];
      //verifica se na variavel locations possui a aposta (guess)
      //se encontrar ele retorna o index > ou = a 0
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("Acertou!");
        if (this.isSunk(ship)) {
          this.shipsSunk++;
          view.displayMessage("Você derrubou meu navio!");
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Você errou");
    return false;
  },
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {

      do {
        locations = this.generateShip();
      } while (this.collision(locations));

      this.ships[i].locations = locations;
      console.log(`navio${i}: `, locations)
    }
  },

  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row;
    var col;
    if (direction === 1) {
      // Gere a posição inicial para um navio horizontal
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      // Gere a posição inical para um navio vertical
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength))
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // adiciona a posição ao array para um novo navio horizontal
        newShipLocations.push(row + "" + (col + i));
      } else {
        // adiciona a posição ao array para um novo navio vertical
        newShipLocations.push((row + i) + "" + col); 
      }
    }
    console.log('novaLocalizacao', newShipLocations)
    return newShipLocations;
  },

  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >=0) {
          return true;
        }
      }
    }
    return false;
  }

};
function parseGuess(guess) {
  var alfabeto = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Opss!, por favor, informe uma letra e um número no Board");
  } else {
    var firstChar = guess.charAt(0).toUpperCase();
    var row = alfabeto.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Oops, está fora do Board.");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Oops, está fora do Board.");
    } else {
      return row + column;
    }
  }
  return null;
}
var controller = {
  guesses: 0,
  processGuess: function (guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          "Você acertou todos meus Navios, em " + this.guesses + " apostas."
        );
      }
    }
  },
};

function init() {
  var fireButton = document.getElementById("dispararInput");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("palpiteInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("dispararInput");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

function handleFireButton() {
  // pegue o palpite do jogador no form
  // e envie-o para o controller.
  var guessInput = document.getElementById("palpiteInput");
  var guess = guessInput.value;
  controller.processGuess(guess);

  guessInput.value = "";
}

window.onload = init();
