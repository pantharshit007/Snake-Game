// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instructions');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const muteButton = document.getElementById('muteButton');
const icon = document.querySelector("#muteButton > i")

//Defin Game Variabes:  
const gridSize = 20;
//Object of X and Y coordinates
let snake = [{x:10, y:10}]  //start with centre
let food = generateFood();  
let highScore = 0;
let direction = 'right' //default: right
let gameInterval;
let gameSpeedDelay = defaultSpeedDelay = 200;
let gameStarted = false;
const munchingAudio = new Audio("./audio/eating-sound.mp3");


// Draw snake, food, Game Map
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
    updateHighScore();
}

// Creating Snake
function drawSnake() {
    if (gameStarted) {
        snake.forEach((fragment)=>{
            // creating div and snake with createGaneElement()
            const snakeElement = createGameElement('div', 'snake');
            setPosition(snakeElement, fragment);
            // Appending the block on board
            board.appendChild(snakeElement);
        });
    }
}

// Create Snake or Food [div]
function createGameElement(tag, class_Name){
    const element = document.createElement(tag);
    element.className = class_Name; // assigning a new class name to newly created div
    return element;
}

// Set the position of snake/ Food
function setPosition(elem, position){
    elem.style.gridColumn = position.x; // Assigning column based on X coord.
    elem.style.gridRow = position.y; // Assigning row based on Y coord.
} 

// Testing the Draw Function
// draw();

// Drawing food Function
function drawFood(){
    if (gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

//Generate food spawning coordinates
function generateFood(){
    const x = Math.floor(Math.random()* gridSize)+ 1;
    const y = Math.floor(Math.random()* gridSize)+ 1;
    
    //to prevent food spawning on the snake body
    for (let i = 1; i < snake.length; i++) {
         if ( x === snake[i].x && y === snake[i].y ){
            generateFood();
         }
    }


    return { x,y };
}

//Moving the snake
function move(){
    // making a shallow copy of snake where we are accesing obj @ 0th idx
    const head = { ...snake[0]} 
    switch (direction) {
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    // Inserts head at the start of an array
    snake.unshift(head);
    
    // once snake eats food size grows
    if (head.x == food.x && head.y == food.y) {
        munchingAudio.play();
        food = generateFood();
        increaseSpeed();    //speed++
        clearInterval(gameInterval); //clear the setInterval command
        gameInterval = setInterval(()=>{
            move(); //moving snake
            checkCollision();
            draw(); //draw again from new positon 
        }, gameSpeedDelay);
    }
    else{
        // poping the tail of snake [seems like its moving]
        snake.pop();
    }
}

//Start game Function
function startGame() {
    gameStarted = true; //while true game Running
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(()=>{
        move(); 
        checkCollision(); 
        draw();
    }, gameSpeedDelay);
}


//keypress listner
function handleKeyPress(e) {
    if ((!gameStarted && e.code === 'Space') || (!gameStarted && e.key === ' ')) {
        startGame();
    } else {
        switch (e.key) {
            case 'ArrowUp':
            case 'W':
            case 'w':
                if (direction !== 'down') {
                    direction = 'up'; 
                } 
                break;
            case 'ArrowDown':
            case 'S':
            case 's':
                if (direction !== 'up') {
                    direction = 'down';
                } 
                break;
            case 'ArrowLeft':
            case 'A':
            case 'a':
                if (direction !== 'right') {
                    direction = 'left';
                } 
                break;
            case 'ArrowRight':
            case 'D':
            case 'd':
                if (direction !== 'left') {
                    direction = 'right';
                }
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// Increasing the speed of snake as we progress
function increaseSpeed() {
    // console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }else if (gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }else if (gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }else if (gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

// check whether snake collided with something or itself
function checkCollision(){
    const head = snake[0];
    

    if (head.x < 1 || head.x > gridSize || 
        head.y < 1 || head.y > gridSize){
            resetGame();
        }
    
    for (let i = 1; i < snake.length; i++) {
         if ( head.x === snake[i].x && head.y === snake[i].y ){
            resetGame();
         }
    }
}

//If snake collides reseting the game
function resetGame(){ 
    updateScore();
    updateHighScore();
    stopGame();
}

//Update the score as the snake eat the fruit
function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

//max Score will be updated every frame
function updateHighScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');

        highScoreText.style.display = 'block';
    }
}

//Once we restart it will be back to beginning
function stopGame(){
    clearInterval(gameInterval)
    gameStarted = false;
    instructionText.style.display = 'block'; 
    logo.style.display = 'block'; 
    ////////\\\\\\\\
    snake = [{x:10,y:19}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = defaultSpeedDelay;
}

muteButton.addEventListener('click', toggleMute);

function toggleMute(){
        munchingAudio.muted = !munchingAudio.muted;

    // Change the icon based on the mute state
    if (munchingAudio.muted) {
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
    } else {
        munchingAudio.volume = 0.8;
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
    }
}