//let scoreField = document.getElementById("score-field");
let foodField = document.getElementById("food-field");
let score = 0;
let food = 0;

class SnakeBody {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// board
let blockSize = 20;
let cols = 21;
let rows = 21;
let blockCount = (cols + rows) / 2;
let board;
let context;

 
// Snake head
let snakeX = 10 * blockSize;
let snakeY = 10 * blockSize;

let velocityX = 0;
let velocityY = 0;

// Snake body
let snakeBody = [];

// Food
let foodX;
let foodY;

let gameOver = false;

//smartmode
let automodeSmart = true;
// let distToFoodX = foodX - snakeX;
// let distToFoodY = foodY - snakeY;
// let distToFoodXabs = Math.abs(distToFoodX);
// let distToFoodYabs = Math.abs(distToFoodY);

window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d"); // For drawing on the board

  placeFood();

  document.addEventListener("keydown", changeDirection);

  //   update();
  setInterval(update, 1000 / 1000);
};



function update() {
  if (gameOver) {
    return;
  }

  context.fillStyle = "#ffd0a4";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  if (snakeX == foodX && snakeY == foodY) {
    snakeBody.push([foodX, foodY]);
    placeFood();
    food ++;

    foodField.innerText = food;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }
  
  


  context.fillStyle = "green";
  //обновление головы
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  //отрисовка головы
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  context.fillStyle = "#4d1700";
  for (let i = 0; i < snakeBody.length; i++) {
    let part = snakeBody[i];
    context.fillRect(
      part.x * blockCount,
      part.y * blockCount,
      blockSize,
      blockSize
    );
  }

  //отрисовка змейки
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }

  // Game over condition
  if (
    snakeX < 0 ||
    snakeX > cols * blockSize ||
    snakeY < 0 ||
    snakeY > rows * blockSize
  ) {
    gameOver = true;
    //alert("Game Over!");
    location.reload();
  }

  // for (let i = 0; i < snakeBody.length; i++) {
    // if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      // gameOver = true;
      // alert("Game Over!");
      // location.reload();
    // }
  // }
  
    //smart direction
	if (automodeSmart) {	  
	smartDirection();  
	  	  
  }

}

let changeDirection = function (e) {
  if (e.code == "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code == "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code == "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code == "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }

  // if (automodeSmart) {	  
	// smartDirection();  
	  	  
  // }
  // setInterval(() => {
    // score++;

    // scoreField.innerText = score;
  // }, 1000 / 10);
};

function placeFood() {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}

function directionSolver() {
	
	let t_snakeBody = [];
	
	//копирование во временный массив
	for (let i = 0; i < snakeBody.length; i++) {
	t_snakeBody.push(snakeBody[i]);
  }
	if (snakeX == foodX && snakeY == foodY) {
    t_snakeBody.push([foodX, foodY]);

  }

	for (let i = t_snakeBody.length - 1; i > 0; i--) {
    t_snakeBody[i] = t_snakeBody[i - 1];
	}

	if (t_snakeBody.length) {
		t_snakeBody[0] = [snakeX, snakeY];
	}	

	
	let t_snakeX = snakeX + velocityX * blockSize;
	let t_snakeY = snakeX + velocityY * blockSize;
	//проверка поражения
  	if (
		t_snakeX < 0 ||
		t_snakeX > cols * blockSize ||
		t_snakeY < 0 ||
		t_snakeY > rows * blockSize
	  ) {
		randomDirection();
	  }

	// for (let i = 0; i < snakeBody.length; i++) {
		// if (t_snakeX == t_snakeBody[i][0] && t_snakeY == t_snakeBody[i][1]) {
		  // randomDirection();
		// }
	// }
}


function smartDirection() {
	// distToFoodX = foodX - snakeX;
	// distToFoodY = foodY - snakeY;
	// distToFoodXabs = Math.abs(distToFoodX);
	// distToFoodYabs = Math.abs(distToFoodY);
	
	let distToFoodX = foodX - snakeX;
	let distToFoodY = foodY - snakeY;
	let distToFoodXabs = Math.abs(distToFoodX);
	let distToFoodYabs = Math.abs(distToFoodY);
	let chance =  Math.floor(Math.random() * 100) + 1;


	if (chance<=90) {
		if (distToFoodXabs >= distToFoodYabs) {
		velocityY = 0;

			if (distToFoodX >= 0) {
				velocityX = 1;
			}
			else if (distToFoodX < 0) {
				velocityX = -1;
			}

			// else if (distToFoodX === 0) {
				// randomDirection();
			// }
		}

		else if (distToFoodXabs < distToFoodYabs) {
		 velocityX = 0; 
			if (distToFoodY >= 0) {
				velocityY = 1;
			}
			else if (distToFoodY < 0) {
				velocityY = -1;
			}

			// else if (distToFoodY === 0) {
				// randomDirection();
			// }
		}
	}
	
	else if (distToFoodXabs >= distToFoodYabs) {
		velocityX = 0;

			if (distToFoodX >= 0) {
				velocityY = 1;
			}
			else if (distToFoodX < 0) {
				velocityY = -1;
			}

			// else if (distToFoodX === 0) {
				// randomDirection();
			// }
		}

	else if (distToFoodXabs < distToFoodYabs) {
	 velocityY = 0; 
		if (distToFoodY >= 0) {
			velocityX = 1;
		}
		else if (distToFoodY < 0) {
			velocityX = -1;
		}

		// else if (distToFoodY === 0) {
			// randomDirection();
		// }
	}
	
	
	directionSolver();
	
	 // setInterval(() => {
		// score++;

		// scoreField.innerText = score;
	  // }, 1000 / 10);	
	
	  
	// if (snake.some((segment, index) => index !== 0 && (Math.abs(segment.x - snakeX) === 0)  && (Math.abs(segment.y - snake[0].y) === 0))) randomDirection();  
	// }
	
	
	
}

function randomDirection() {
	let direction = Math.floor(Math.random() * 4 + 1);
	  
	  if (direction === 1) {

		velocityX = -1;

		velocityY = 0;

	  }
	  if (direction === 2) {

		velocityX = 1;

		velocityY = 0;

	  }
	  if (direction === 3) {

		velocityX = 0;

		velocityY = -1;

	  }
	  if (direction === 4) {

		velocityX = 0;

		velocityY = 1;

	  }
	  
	  
	directionSolver();
	  
	  // if (snake.some((segment, index) => index !== 0 && (Math.abs(segment.x - snake[0].x) <= 1)  && (Math.abs(segment.y - snake[0].y) <= 1))) {
		
		// smartDirection();
		  
	  // }
}