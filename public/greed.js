class PageModel {
  constructor() {
    this.greedModel = null;
    this.modelSize = { X: 80, Y: 20 };
    this.playerPos = { X: 0, Y: 0 };
    this.score = 0;
    this.scorePercentage = 0;
    this.gameState = true;
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
		console.log(this.score);
		console.log(this.modelSize.X);
		console.log(this.modelSize.Y);
		console.log(this.scorePercentage);
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
    this.highScores = null;
  }
  initialize() {
    this.getElements();
  }
  getElements() {
    this.pageElement = document.getElementById("page");
    this.greedContainer = document.getElementById("greedContainer");
    this.highScores = document.getElementById("highScores");
  }
  resetView() {
    this.pageElement = null;
    this.greedContainer = null;
    this.highScores = null;
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
	let bottom_message = document.createElement("h2");
	bottom_message.innerHTML = "Score: 0 | 0% Press 'r' to restart or 't' to save score";
	this.greedContainer.appendChild(bottom_message);
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
	let bottom_message = row;
	bottom_message.innerHTML = "Score: " + score + " | " + scorePercentage + "% Press 'r' to restart or 't' to save score";
    /* if (gameState === false) {
      alert("Game over");
    }
	*/
  }
}

class MenuView {
  constructor() {
    this.pageElement = null;
    this.greedContainer = null;
    this.highScores = null;
  }
  initialize() {
    this.getElements();
  }
  getElements() {
    this.pageElement = document.getElementById("page");
    this.greedContainer = document.getElementById("greedContainer");
    this.highScores = document.getElementById("highScores");
  }
  resetView() {
    this.pageElement = null;
    this.greedContainer = null;
    this.highScores = null;
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
    this.createView("menu");
    this.setGreedListener();
  }
  initialize() {
	pageModel.initialize();
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
      this.pageModel.gameState
    );
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
          removeChilds("greedContainer");
          pageController.menuView.resetView();
          pageController.initialize();
          pageController.viewType = "greed";
        }
      } else if (event.code === "KeyR") {
        pageController.resetGame();
      } else if (event.code === "KeyT") {
		post("/highscores/", {score: pageController.pageModel.score});
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
  
  return scoreArray;
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