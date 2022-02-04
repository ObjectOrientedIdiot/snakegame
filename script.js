function waitForKey(){
    return new Promise(function(resolve){
        document.addEventListener('keydown', function handler(e){
            if(e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
                document.removeEventListener('keydown', handler);
                resolve();
            }
        })
    })
}

async function game(speed, canvasHeight, canvasWidth){
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

    function draw(){
        for(let y=0; y<canvasHeight; y++){
            for(let x=0; x<canvasWidth; x++){
                canvasArray[y][x] = document.createElement('div');
                canvasArray[y][x].classList.add('cell');

                if(map[y][x] == "snake"){canvasArray[y][x].classList.add('snake');}
                if(map[y][x] == "fruit"){canvasArray[y][x].classList.add('fruit');}
                
                canvasArray[y][x].style.top = `${y*24}px`;
                canvasArray[y][x].style.left = `${x*24}px`;

                canvas.appendChild(canvasArray[y][x]);
            }
        }
    }
    
    function clear(){
        for(let y=0; y<canvasHeight; y++){
            for(let x=0; x<canvasWidth; x++){
                canvasArray[y][x].remove();
            }
        }
    }

    draw()
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

    //wait until keypress to start game
    await waitForKey();

    //game
    function update(){
		snake = snake.slice(0,snakeLength);

        let head = snake[0]; //snake head
        let prevSeg = snake[1]; //segment of snake before head

        //movement
        let x = head.x, y = head.y;
        let dx = right-left, dy = down-up; //delta x and y for movement

        if(x+dx == prevSeg.x){dx *= -1}; //cant move into previous segment
        if(y+dy == prevSeg.y){dy *= -1};

        let newX = x+dx, newY = y+dy;

        //collect fruit?
        let queueFruit = false;
        if(map[newY][newX] == 'fruit'){
            snakeLength += 1;
            map[newY][newX] = undefined;
            queueFruit = true; //will call createFruit function after moving snake and updating map.
        }
        
        //die?
        if(map[newY][newX] == 'snake' || newX >= canvasWidth || newX < 0 || newY >= canvasHeight || newY < 0){clearInterval(gameloop);}

        //update position and snake length
        snake.unshift({x: newX, y: newY});
        snake = snake.slice(0,snakeLength);
		
        //update map
        for(let i=0; i<map.length; i++){ //clear snake
            for(let v=0; v<map[i].length; v++){
				if(map[i][v] == "snake"){map[i][v] = undefined;}
			}
        }

        for(let i=0; i<snake.length; i++){
            let currentSegment = snake[i];
            map[currentSegment.y][currentSegment.x] = 'snake';
        }

        //create fruit
        if(queueFruit){createFruit()};
        
        //draw array to visual grid
        clear();
        draw();
    }

    let gameloop = setInterval(update, speed);
}

game(250, 16, 16);