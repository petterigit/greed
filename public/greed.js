class PageModel {
  constructor() {
    this.greedModel = null;
    this.modelSize = { X: 80, Y: 20 };
    this.playerPos = { X: 0, Y: 0 };
    this.score = 0;
    this.scorePercentage = 0;
    this.gameState = true;
	this.playerName = "";
  }

  initialize() {
    this.generateGreedModel();
    this.setPlayerPos(null);
  }
  generateGreedModel() {
    this.greedModel = [...Array(this.modelSize.Y)].map(e =>
      Array(this.modelSize.X).fill(null)
    );
    for (let i = 0; i < this.modelSize.Y; i++) {
      for (let j = 0; j < this.modelSize.X; j++) {
        this.greedModel[i][j] = Math.floor(Math.random() * 9 + 1);
      }
    }
  }
  resetModel() {
    this.greedModel = null;
    this.modelSize = { X: 80, Y: 20 };
    this.playerPos = { X: 0, Y: 0 };
    this.score = 0;
    this.scorePercentage = 0;
    this.gameState = true;
	this.playerName = "";
    this.initialize();
  }

  checkGameOver() {
    let falseScore = 0;
    let moving = this.getMovement({ X: 0, Y: 1 });
    falseScore = falseScore + this.allowMovement(moving);
    moving = this.getMovement({ X: 0, Y: -1 });
    falseScore = falseScore + this.allowMovement(moving);
    moving = this.getMovement({ X: 1, Y: 0 });
    falseScore = falseScore + this.allowMovement(moving);
    moving = this.getMovement({ X: -1, Y: 0 });
    falseScore = falseScore + this.allowMovement(moving);
    return falseScore;
  }
  setPlayerPos(movement) {
    if (movement === null) {
      this.playerPos.X = Math.floor(this.modelSize.X / 2);
      this.playerPos.Y = Math.floor(this.modelSize.Y / 2);
      this.greedModel[this.playerPos.Y][this.playerPos.X] = null;
    } else {
      if (this.allowMovement(movement)) {
        this.nullMovementLine(movement);
        this.playerPos.X = this.playerPos.X + movement.X;
        this.playerPos.Y = this.playerPos.Y + movement.Y;
        this.score = this.score + Math.abs(movement.X) + Math.abs(movement.Y);
        this.scorePercentage = (
          (this.score / (this.modelSize.X * this.modelSize.Y)) *
          100
        ).toFixed(2);
      }
    }
  }
  nullMovementLine(movement) {
    for (let i = 0; i < Math.abs(movement.X + movement.Y); i++) {
      this.greedModel[this.playerPos.Y + (i + 1) * Math.sign(movement.Y)][
        this.playerPos.X + (i + 1) * Math.sign(movement.X)
      ] = null;
    }
  }
  allowMovement(movement) {
    if (movement.X === undefined || movement.Y === undefined) {
      return 0;
    }
    if (movement.X === 0 && movement.Y === 0) {
      return 0;
    }
    if (movement.X !== 0) {
      for (let i = 0; i < Math.abs(movement.X); i++) {
        let next = this.greedModel[this.playerPos.Y][
          this.playerPos.X + (i + 1) * Math.sign(movement.X)
        ];
        if (next === null || next === undefined) {
          return 0;
        }
      }
    } else if (movement.Y !== 0) {
      for (let i = 0; i < Math.abs(movement.Y); i++) {
        let next = this.greedModel[
          this.playerPos.Y + (i + 1) * Math.sign(movement.Y)
        ][this.playerPos.X];
        if (next === null || next === undefined) {
          return 0;
        }
      }
    }
    return 1;
  }
  getMovement(movement) {
    if (movement.X === 0 && movement.Y === 1) {
      let adjacent = this.greedModel[this.playerPos.Y + 1][this.playerPos.X];
      if (this.playerPos.Y + 1 > this.modelSize.Y) {
        return { X: 0, Y: 0 };
      }
      if (adjacent === null) {
        return { X: 0, Y: 0 };
      }
      return {
        X: 0,
        Y: adjacent
      };
    } else if (movement.X === 0 && movement.Y === -1) {
      let adjacent = this.greedModel[this.playerPos.Y - 1][this.playerPos.X];
      if (this.playerPos.Y - 1 < 0) {
        return { X: 0, Y: 0 };
      }
      if (adjacent === null) {
        return { X: 0, Y: 0 };
      }
      return {
        X: 0,
        Y: -adjacent
      };
    } else if (movement.X === -1 && movement.Y === 0) {
      let adjacent = this.greedModel[this.playerPos.Y][this.playerPos.X - 1];
      if (this.playerPos.X - 1 < 0) {
        return { X: 0, Y: 0 };
      }
      if (adjacent === null) {
        return { X: 0, Y: 0 };
      }
      return {
        X: -adjacent,
        Y: 0
      };
    } else if (movement.X === 1 && movement.Y === 0) {
      let adjacent = this.greedModel[this.playerPos.Y][this.playerPos.X + 1];
      if (this.playerPos.X + 1 > this.modelSize.X) {
        return { X: 0, Y: 0 };
      }
      if (adjacent === null) {
        return { X: 0, Y: 0 };
      }
      return {
        X: adjacent,
        Y: 0
      };
    }
  }
}

class PageView {
  constructor() {
    this.pageElement = null;
    this.greedContainer = null;
    this.infoContainer = null;
  }
  initialize() {
    this.getElements();
  }
  getElements() {
    this.pageElement = document.getElementById("page");
    this.greedContainer = document.getElementById("greedContainer");
    this.infoContainer = document.getElementById("infoContainer");
  }
  resetView() {
    this.pageElement = null;
    this.greedContainer = null;
    this.infoContainer = null;
    this.initialize();
  }
  createGreedView(greedModel, modelSize, playerPos) {
    for (let i = modelSize.Y - 1; i >= 0; i--) {
      let row = document.createElement("p");
      for (let j = 0; j < modelSize.X; j++) {
        let span = document.createElement("span");
        if (playerPos.X !== j || playerPos.Y !== i) {
          let color = getColor(greedModel[i][j]);
          span.style.color = color;
          if (greedModel[i][j] === null) {
          } else {
            span.textContent = greedModel[i][j];
          }
        } else {
          span.style.color = "#ffffff";
          span.textContent = "@";
        }
        row.appendChild(span);
      }
      this.greedContainer.appendChild(row);
    }
	//let bottom_message = document.createElement("h2");
	let message_text = "Score: - | - %";
	message_text += "<br>Controls";
	message_text += "<br>W A S D	Move";
	message_text += "<br>R			Reset Grid";
	message_text += "<br>T			Save a highscore (And reset)";
	message_text += "<br>K			Show highscores (Reloads page)";
	//bottom_message.innerHTML = message_text;
	this.infoContainer.innerHTML = "<h2>" + message_text + "</h2>";
  }

  renderGreedView(greedModel, modelSize, playerPos, gameState, score, scorePercentage) {
    let row = this.greedContainer.firstChild;
    for (let i = modelSize.Y - 1; i >= 0; i--) {
      let span = row.firstChild;
      for (let j = 0; j < modelSize.X; j++) {
        if (playerPos.X !== j || playerPos.Y !== i) {
          if (greedModel[i][j] === null) {
            span.innerHTML = "&nbsp";
          } else {
            span.textContent = greedModel[i][j];
          }
        } else {
          span.style.color = "#ffffff";
          span.textContent = "@";
        }
        span = span.nextSibling;
      }
      row = row.nextSibling;
    }
	//let bottom_message = this.infoContainer.firstChild;
	let message_text = "Score: " + score + " | " + scorePercentage + "%";
	message_text += "<br>Controls";
	message_text += "<br>W A S D	Move";
	message_text += "<br>R			Reset Grid";
	message_text += "<br>T			Save a highscore (And reset)";
	message_text += "<br>K			Show highscores (In a different page)";
	this.infoContainer.innerHTML = "<h2>" + message_text + "</h2>";
  }
}

class MenuView {
  constructor() {
    this.pageElement = null;
    this.greedContainer = null;
  }
  initialize() {
    this.getElements();
  }
  getElements() {
    this.pageElement = document.getElementById("page");
    this.greedContainer = document.getElementById("greedContainer");
  }
  resetView() {
    this.pageElement = null;
    this.greedContainer = null;
  }
  createMenuView() {
    let menutext = document.createElement("h2");
    menutext.textContent = "Welcome to greed! \n Press Enter to start!";
    this.greedContainer.appendChild(menutext);
  }
}

class PageController {
  constructor(pageModel, pageView, menuView) {
    this.pageModel = pageModel;
    this.pageView = pageView;
    this.menuView = menuView;
    this.viewType = "menu";
  }

  initializeMenu() {
    menuView.initialize();
	pageModel.initialize();
    this.createView("menu");
    this.setGreedListener();
  }
  initialize() {
    pageView.initialize();
    this.createView("greed");
  }
  checkGameOver() {
    let falseScore = this.pageModel.checkGameOver();
    if (!falseScore) {
      this.pageModel.gameState = false;
      this.renderView();
    }
  }
  createView(scene) {
    if (scene === "menu") {
      this.menuView.createMenuView();
    } else if (scene === "greed") {
      this.pageView.createGreedView(
        this.pageModel.greedModel,
        this.pageModel.modelSize,
        this.pageModel.playerPos,
        this.pageModel.gameState
      );
    }
  }
  renderView() {
    this.pageView.renderGreedView(
      this.pageModel.greedModel,
      this.pageModel.modelSize,
      this.pageModel.playerPos,
      this.pageModel.gameState,
	  this.pageModel.score,
	  this.pageModel.scorePercentage
    );
  }
  resetGame() {
    this.pageModel.resetModel();
    this.pageView.resetView();
    this.renderView(
      this.pageModel.greedModel,
      this.pageModel.modelSize,
      this.pageModel.playerPos,
      this.pageModel.gameState,
	  this.pageModel.score,
	  this.pageModel.scorePercentage
    );
  }
  setPlayerInfo() {
	  this.pageModel.playerName = prompt("Enter your name");
	  console.log(this.pageModel.playerName);
  }
  
  setGreedListener() {
    document.addEventListener("keypress", function(event) {
      if (event.code === "KeyW") {
        pageController.move({ X: 0, Y: 1 });
      } else if (event.code === "KeyS") {
        pageController.move({ X: 0, Y: -1 });
      } else if (event.code === "KeyA") {
        pageController.move({ X: -1, Y: 0 });
      } else if (event.code === "KeyD") {
        pageController.move({ X: 1, Y: 0 });
      } else if (event.code === "Enter") {
        if (pageController.viewType === "menu") {
		  pageController.setPlayerInfo();
          removeChilds("greedContainer");
          pageController.menuView.resetView();
          pageController.initialize();
          pageController.viewType = "greed";
        }
      } else if (event.code === "KeyR") {
        pageController.resetGame();
	  } else if (event.code === "KeyK") {
        getScores();
      } else if (event.code === "KeyT") {
		post("/highscores/", {name: pageController.pageModel.playerName, score: pageController.pageModel.score});
	  }
      pageController.renderView();
    });
  }
  move(direction) {
    let movement = this.pageModel.getMovement(direction);
    if (direction.Y === 1 && direction.X === 0) {
      this.pageModel.setPlayerPos(movement);
    } else if (direction.Y === -1 && direction.X === 0) {
      this.pageModel.setPlayerPos(movement);
    } else if (direction.Y === 0 && direction.X === -1) {
      this.pageModel.setPlayerPos(movement);
    } else if (direction.Y === 0 && direction.X === 1) {
      this.pageModel.setPlayerPos(movement);
    }
  }
}

/* M V C */
var pageModel = new PageModel();
var pageView = new PageView();
var menuView = new MenuView();
var pageController = new PageController(pageModel, pageView, menuView);


pageController.initializeMenu();

function getColor(inputNumber) {
  switch (inputNumber) {
    case 1:
      return "#ff6600"; // Orange
    case 2:
      return "#00ccff"; // Cyan
    case 3:
      return "#ffff00"; // Yellow
    case 4:
      return "#9900cc"; // Purple
    case 5:
      return "#3333ff"; // Blue
    case 6:
      return "#cc0000"; // Red
    case 7:
      return "#009933"; // Green
    case 8:
      return "#66ff66"; // Green -l
    case 9:
      return "#996600"; //  rown
    default:
      return "#000000"; // default = black
  }
}

function removeChilds(containerName) {
  const myNode = document.getElementById(containerName);
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}

function getScores() {
  let scoreArray;
  
  let form = document.getElementById("getScoresForm");
  form.submit();
}

/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the paramiters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

function post(path, params, method='post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}