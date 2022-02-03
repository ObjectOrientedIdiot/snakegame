let canvasHeight = 16;
let canvasWidth = 16;

async function game(speed){
    //create grid
    let map = new Array(canvasHeight);
    for(let i=0; i<map.length; i++){
        map[i] = new Array(canvasWidth);
    }

    //create canvas
    let canvasArray = new Array(canvasHeight);
    for(let i=0; i<canvasArray.length; i++){
        canvasArray[i] = new Array(canvasWidth);
    }

    const canvas = document.getElementById('canvas');

    for(let y=0; y<canvasHeight; y++){
        for(let x=0; x<canvasWidth; x++){
            canvasArray[y][x] = document.createElement('div');
            canvasArray[y][x].classList.add('cell');
            
            canvasArray[y][x].style.top = `${y*24}px`;
            canvasArray[y][x].style.left = `${x*24}px`;

            canvas.appendChild(canvasArray[y][x]);
        }
    }

    //snake body
    let snakeLength = 3; //starting size
    let snake = new Array();

    //initialize snake
    for(let i=0; i<snakeLength; i++) {
        let x=Math.floor(canvasWidth/2)+i;
        let y=Math.floor(canvasHeight/2);
        snake[i] = {x: x, y: y};
        map[y][x] = "snake";
    }
	console.log(snake);

    //snake directions
    let up = 0,down = 0,left = 0,right = 0;
    document.addEventListener('keydown',function(e){
        switch(e.key){
            case('ArrowUp'):
                up = 1;
                down = 0;
                left = 0;
                right = 0;
                break;
            case('ArrowDown'):
                down = 1;
                up = 0;
                left = 0;
                right = 0;
                break;
            case('ArrowLeft'):
                left = 1;
                right = 0;
                up = 0;
                down = 0;
                break;
            case('ArrowRight'):
                right = 1;
                left = 0;
                up = 0;
                down = 0;
                break;
        }
    });

    function createFruit() {
        while(true){
            let x=Math.floor(Math.random() * canvasWidth);
            let y=Math.floor(Math.random() * canvasHeight);

            if(typeof(map[y][x]) == 'undefined'){
                map[y][x] = "fruit";
                break;
            }
        }
    }

    createFruit();
    //game
    function update(){
		snake = snake.slice(0,snakeLength);

        let head = snake[0]; //snake head
        let prevSeg = snake[1]; //segment of snake before head

        //movement
        let x = head.x, y = head.y;
        let dx = right-left, dy = down-up; //delta x and y for movement

        if(x+dx == prevSeg.x){dx = 0}; //cant move into previous segment
        if(y+dy == prevSeg.y){dy = 0};

        let newX = x+dx, newY = y+dy;

        //collect fruit?
        let queueFruit = false;
        if(map[newY][newX] == 'fruit'){
            snakeLength += 1;
            map[newY][newX] = undefined;
            queueFruit = true; //will call createFruit function after moving snake and updating map.
        }
        
        //die?
        if(map[newY][newX] == 'snake' || newX >= canvasWidth || newX < 0 || newY >= canvasHeight || newY < 0){clearInterval(gameloop)};

        //update position and snake length
        snake.unshift({x: newX, y: newY});
        snake = snake.slice(0,snakeLength);
		
        //update map
        for(let i=0; i<map.length; i++){ //clear map
            for(let v=0; v<map[i].length; v++){
				map[i][v] = undefined;
			}
        }

        for(let i=0; i<snake.length; i++){
            let currentSegment = snake[i];
            map[currentSegment.y][currentSegment.x] = 'snake';
			console.log(currentSegment);
        }

        //create fruit
        if(queueFruit){createFruit()};
        
		console.log(map);
        
        //draw array to visual grid
        for(let ypos=0; ypos<canvasHeight; ypos++){
            for(let xpos=0; xpos<canvasWidth; xpos++){
                canvasArray[ypos][xpos].setAttribute('class','');
                canvasArray[ypos][xpos].classList.add('cell');
                if(map[ypos][xpos] === 'fruit'){
					canvasArray[y][x].classList.add('fruit');
				};

                if(map[ypos][xpos] === 'snake'){
					canvasArray[y][x].classList.add('snake');
				}
            }
        }
		console.log(canvasArray);
    }

    let gameloop = setInterval(update, speed);
}

game(500);