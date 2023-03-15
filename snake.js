window.onload = function () {
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
    const ctx = canvas.getContext("2d");
    const tileSize = 20;
    const boardWidth = canvas.width;
    const boardHeight = canvas.height;
    const boardSizeX = Math.floor(boardWidth / tileSize);
    const boardSizeY = Math.floor(boardHeight / tileSize);
    const colors = {
        board: "#222",
        snake: "#0f0",
        food: "#f00",
        head: "#0f0",
        eye: "#fff",
    };
    let isGameOver = false;

    let snake = {
        body: [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
        ],
        direction: "right",
    };



// Generate a random lake shape
function generateLakeShape() {
    const shapes = [
        { x: 1, y: 0, width: 3, height: 1 },
        { x: 0, y: 1, width: 5, height: 1 },
        { x: -1, y: 2, width: 9, height: 1 },
        { x: -1, y: 3, width: 9, height: 1 },
        { x: 0, y: 4, width: 7, height: 1 },
        { x: 1, y: 5, width: 5, height: 1 },
    ];

    return shapes.map((shape) => {
        const widthVariation = Math.floor(Math.random() * 3) - 1;
        const heightVariation = Math.floor(Math.random() * 3) - 1;

        return {
            x: shape.x,
            y: shape.y,
            width: Math.max(1, shape.width + widthVariation),
            height: Math.max(1, shape.height + heightVariation),
        };
    });
}

// Create a random lake
function createRandomLake() {
    const x = Math.floor(Math.random() * (boardSizeX - 10)) + 5;
    const y = Math.floor(Math.random() * (boardSizeY - 10)) + 5;
    return { x, y, shapes: generateLakeShape() };
}

// Create a few random lakes
const lakes = [createRandomLake(), createRandomLake(), createRandomLake()];

function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * boardSizeX);
        y = Math.floor(Math.random() * boardSizeY);
    } while (isPositionInsideLake(x, y));

    const hue = Math.floor(Math.random() * (60 - 0 + 1) + 0); // Random hue between 0 (red) and 60 (yellow)
    const saturation = Math.floor(Math.random() * (100 - 50 + 1) + 50); // Random saturation between 50% and 100%
    const lightness = Math.floor(Math.random() * (70 - 40 + 1) + 40); // Random lightness between 40% and 70%

    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    return { x, y, color };
}



function drawLake(lake) {
    lake.shapes.forEach((shape) => {
        ctx.fillRect(
            (lake.x + shape.x) * tileSize,
            (lake.y + shape.y) * tileSize,
            shape.width * tileSize,
            shape.height * tileSize
        );
    });
}
function isPositionInsideLake(x, y) {
    for (let lake of lakes) {
        for (let shape of lake.shapes) {
            const minX = lake.x + shape.x;
            const minY = lake.y + shape.y;
            const maxX = minX + shape.width;
            const maxY = minY + shape.height;

            if (x >= minX && x < maxX && y >= minY && y < maxY) {
                return true;
            }
        }
    }

    return false;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}


function drawSnakeSegment(segment, index) {
    const x = segment.x * tileSize;
    const y = segment.y * tileSize;

    // Draw body segment with gradient
    let gradientPercentage = index / snake.body.length;
    let greenValue = Math.floor(255 * (1 - gradientPercentage));
    ctx.fillStyle = `rgb(0, ${greenValue}, 0)`;
    ctx.fillRect(x, y, tileSize, tileSize);

    // Draw eyes
    if (index === 0) {
        ctx.fillStyle = colors.eye;
        let eyeX1, eyeY1, eyeX2, eyeY2;
        const eyeSize = tileSize / 5;
        const eyeOffset = tileSize / 4;

        switch (snake.direction) {
            case "up":
                eyeX1 = x + eyeOffset;
                eyeY1 = y + eyeOffset;
                eyeX2 = x + tileSize - eyeOffset - eyeSize;
                eyeY2 = y + eyeOffset;
                break;
            case "down":
                eyeX1 = x + eyeOffset;
                eyeY1 = y + tileSize - eyeOffset - eyeSize;
                eyeX2 = x + tileSize - eyeOffset - eyeSize;
                eyeY2 = y + tileSize - eyeOffset - eyeSize;
                break;
            case "left":
                eyeX1 = x + eyeOffset;
                eyeY1 = y + eyeOffset;
                eyeX2 = x + eyeOffset;
                eyeY2 = y + tileSize - eyeOffset - eyeSize;
                break;
            case "right":
                eyeX1 = x + tileSize - eyeOffset - eyeSize;
                eyeY1 = y + eyeOffset;
                eyeX2 = x + tileSize - eyeOffset - eyeSize;
                eyeY2 = y + tileSize - eyeOffset - eyeSize;
                break;
        }

        ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize);
        ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize);
    }
}

    
    
    

    function draw() {
        // Clear canvas
        ctx.fillStyle = colors.board;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        snake.body.forEach((segment, index) => {
            drawSnakeSegment(segment, index);
        });

        // Draw food
        foods.forEach(food => {
            ctx.fillStyle = food.color;
            ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
        });

        // Draw lakes
        ctx.fillStyle = "#00f";
        lakes.forEach(drawLake);

        // Update and draw particles
        particles.forEach((particle, index) => {
            particle.update();
            particle.draw(ctx);
            if (particle.life <= 0) {
                particles.splice(index, 1);
            }
        });


    }

    function move() {
        if (isGameOver) {
            return;
        }

        // Move snake
        let head = { ...snake.body[0] };
        switch (snake.direction) {
            case "up":
                head.y -= 1;
                break;
            case "down":
                head.y += 1;
                break;
            case "left":
                head.x -= 1;
                break;
            case "right":
                head.x += 1;
                break;
        }
        snake.body.unshift(head);

        // Check for collision with food
        let ateFood = false;
        foods.forEach((food, index) => {
            if (head.x === food.x && head.y === food.y) {
                ateFood = true;
                createFirework(food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 2, food.color); // Pass the food color
                playFoodSound(food.color);

                // Remove the eaten food from the array
                foods.splice(index, 1);

                // Add between 0 and 5 new food items
                const newFoodCount = 1+Math.floor(Math.random() * 2);
                for (let i = 1; i <= newFoodCount; i++) {
                    foods.push(generateFood());
                }
            }
        });

        if (!ateFood) {
            snake.body.pop();
        }

        // Check for collision with wall or self
        if (head.x < 0 || head.x >= boardSizeX || head.y < 0 || head.y >= boardSizeY) {
            isGameOver = true;
            createExplosion(head.x * tileSize + tileSize / 2, head.y * tileSize + tileSize / 2);
            playExplosionSound();
            return;
        }

       
        snake.body.slice(1).forEach(segment => {
            if (head.x === segment.x && head.y === segment.y) {
                isGameOver = true;
                createExplosion(head.x * tileSize + tileSize / 2, head.y * tileSize + tileSize / 2);
                playExplosionSound();
                return;
            }
        });

        if (isPositionInsideLake(head.x, head.y)) {
            isGameOver = true;
            createExplosion(head.x * tileSize + tileSize / 2, head.y * tileSize + tileSize / 2);
            playExplosionSound();
            return;
        }
    }

    function changeDirection(event) {
        switch (event.keyCode) {
            case 37: // left arrow
                if (snake.direction !== "right") {
                    snake.direction = "left";
                }
                break;
            case 38: // up arrow
                if (snake.direction !== "down") {
                    snake.direction = "up";
                }
                break;
            case 39: // right arrow
                if (snake.direction !== "left") {
                    snake.direction = "right";
                }
                break;
            case 40: // down arrow
                if (snake.direction !== "up") {
                    snake.direction = "down";
                }
                break;
        }
    }

    let snakeSpeed = 150;


    let lastUpdateTime = 0;

    function gameLoop(currentTime) {
        if (!isGameOver) {
            const elapsedTime = currentTime - lastUpdateTime;
    
            if (elapsedTime > snakeSpeed) {
                move();
                lastUpdateTime = currentTime;
            }
        }
    
        draw();
        window.requestAnimationFrame(gameLoop);
    }
    
    
    
    
    window.requestAnimationFrame(gameLoop);
    

    let foods = [generateFood()];
    document.addEventListener("keydown", changeDirection);

    
};
