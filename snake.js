let foodField = document.getElementById("food-field");
let bestField = document.getElementById("best-field");
let speed = 2; //default = 1; max = 100 (turbomode)


let food = 0;
//let best = 0;
let best = 71; //best I've ever seen :D (with body and board rules, 35x35)

foodField.innerText = food;
bestField.innerText = best;

//rules
let gameOver = false;
let bodyRule = true;
let boardRule = true;

//modes
let automodeSmart = true;
let liveFood = false;
let snakeCrazyness = 0; // from 0 to 100, default = 0; this value using only if automodeSmart === true 
let foodCrazyness = 56; // from 0 to 100, default = 56; this value using only if liveFood === true 

class SnakeBody {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// board
let blockSize = 15;
let cols = 35;
let rows = 35;
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
let f_velocityX = 0;
let f_velocityY = 0;





window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d"); // For drawing on the board
  updateValues();
  placeFood();
	
  document.addEventListener("keydown", changeDirection);

  //   update();
  setInterval(updateWorld, 1000 / 10);
};

function updateValues(){

	automodeSmart = document.getElementById('automodeSmart').checked;
	liveFood = document.getElementById('liveFood').checked;
	
	bodyRule = document.getElementById('bodyRule').checked;
	boardRule = document.getElementById('boardRule').checked;
}


function updateWorld() {
  if (gameOver) {
	if (food > best) best = food;
	updateValues();
	bestField.innerText = best;
	
	snakeX = 10 * blockSize;
	snakeY = 10 * blockSize;  
    velocityX = 0;
	velocityY = 0;
	
	food = 0;
	foodField.innerText = food;
	
	snakeBody = [];
	let f_velocityX = 0;
	let f_velocityY = 0;
	placeFood();
    gameOver = false;
	//return;
  }

  //отрисовка игрового поля
  context.fillStyle = "#ffd0a4";
  context.fillRect(0, 0, board.width, board.height);

  //отрисовка еды
  //context.fillStyle = "red"; #6699CC
  context.fillStyle = "#ad3c1f";
  context.fillRect(foodX, foodY, blockSize, blockSize);

   /* обновление координат тела*/
  //если змея съела еду
  if (snakeX == foodX && snakeY == foodY) {
    snakeBody.push([foodX, foodY]); // увеличиваем хвост
    placeFood(); // добавляем новую еду

	//увеличиваем счетчик поглощенной пищи
    food ++;
    foodField.innerText = food;
  }

 
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  //шея теперь на месте головы
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }
   /* конец обновления координат тела*/
  


  
  //обновление координат головы
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  

  //отрисовка тела змеи 
  context.fillStyle = "#4d1700";
  
  /// (???) я отключил, ничего не поменялось
  // for (let i = 0; i < snakeBody.length; i++) {
    // let part = snakeBody[i];
    // context.fillRect(
      // part.x * blockCount,
      // part.y * blockCount,
      // blockSize,
      // blockSize
    // );
  // }

  //отрисовка тела, если отключить, тело не будет отображаться
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }
  
  //отрисовка головы
  context.fillStyle = "green";
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  // Условие проигрыша
  // голова змеи выходит за границы поля
  if (boardRule) { //правило поля
	  if (
		snakeX < 0 ||
		snakeX > cols * blockSize ||
		snakeY < 0 ||
		snakeY > rows * blockSize
	  ) {
		gameOver = true;
		//alert("Game Over!");
		console.log("Game Over! Food: " + food);
		//location.reload();
	  }
  }
  if (bodyRule) { //правило тела
	  for (let i = 0; i < snakeBody.length; i++) {
		if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
		  gameOver = true;
		  //alert("Game Over!");
		  console.log("Game Over! Food: " + food);
		  //location.reload();
		}
	  }
  }
  
    //если змея движется сама
	if (automodeSmart) {	  
		smartDirection();  
	  	  
  }
	//если еда движется
	if (liveFood) {
		foodDirection(f_velocityX, f_velocityY);
		//если еда вышла за границы экрана, то она создается заново
		if (
			foodX < 0 ||
			foodX > cols * blockSize ||
			foodY < 0 ||
			foodY > rows * blockSize
		  ) {
			placeFood();
		  }	
	}
    updateValues();
	

}

//управление с клавиатуры
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
  else if (e.code == "Escape" || e.code == "Numpad0"|| e.code == "Space") {
    document.getElementById('automodeSmart').click();
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
  
	//если еда на создалась теле змеи, то создаём заново
	for (let i = 0; i < snakeBody.length; i++) {
		if (foodX == snakeBody[i][0] && foodY == snakeBody[i][1]) {
		  placeFood();
		}
	}
  
}

//змея оценивает риски 
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
	let t_snakeY = snakeY + velocityY * blockSize;
	
	//проверка поражения
	//правило поля
	if ( 
		t_snakeX < 0 ||
		(t_snakeX + 1) > cols * blockSize ||
		t_snakeY < 0 ||
		(t_snakeY + 1) > rows * blockSize
	  ) {
		randomDirection();
	  }
	

	for (let i = 0; i < snakeBody.length; i++) {
		if (t_snakeX == t_snakeBody[i][0] && t_snakeY == t_snakeBody[i][1]) {
		  randomDirection();
		}
	}

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


	if (chance <= (101 - snakeCrazyness)) {
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

function foodDirection(velocityX, velocityY) {
	
	let chance =  Math.floor(Math.random() * 100) + 1;
	if (chance <= (101 - foodCrazyness)) {
	
		let direction = Math.floor(Math.random() * 5);
		

		  if (direction === 0) {

			velocityX = 0;

			velocityY = 0;

		  }
		  
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
	}
	else {
		
		let distToFoodX = foodX - snakeX;
		let distToFoodY = foodY - snakeY;
		let distToFoodXabs = Math.abs(distToFoodX);
		let distToFoodYabs = Math.abs(distToFoodY);
		let d_square = distToFoodXabs * distToFoodXabs + distToFoodYabs * distToFoodYabs;  
		
		if (d_square >= 100) return;
		
		let chance =  Math.floor(Math.random() * 100) + 1;

		
		if (chance>=90) {
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
	
	}
	  
	  foodX += velocityX * blockSize;
	  foodY += velocityY * blockSize;
	  
	  
	//directionSolver();
	  
	  // if (snake.some((segment, index) => index !== 0 && (Math.abs(segment.x - snake[0].x) <= 1)  && (Math.abs(segment.y - snake[0].y) <= 1))) {
		
		// smartDirection();
		  
	  // }
}