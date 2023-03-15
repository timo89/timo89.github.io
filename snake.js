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

    let snake = {
        body: [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
        ],
        direction: "right",
    };

    let food = {
        x: Math.floor(Math.random() * boardSizeX),
        y: Math.floor(Math.random() * boardSizeY),
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

function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * boardSizeX),
            y: Math.floor(Math.random() * boardSizeY),
        };
    } while (isPositionInsideLake(food.x, food.y));
}

    function draw() {
        // Clear canvas
        ctx.fillStyle = colors.board;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        snake.body.forEach((segment, index) => {
            if (index === 0) {
                // Draw head
                ctx.beginPath();
                ctx.arc((segment.x + 0.5) * tileSize, (segment.y + 0.5) * tileSize, tileSize / 2, 0, 2 * Math.PI);
                ctx.fillStyle = colors.head;
                ctx.fill();

                // Draw eyes
                let eyeX = segment.x * tileSize + tileSize * 0.2;
                let eyeY = segment.y * tileSize + tileSize * 0.2;
                let eyeSize = tileSize * 0.3;
                ctx.fillStyle = colors.eye;
                ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);
                ctx.fillRect(eyeX + tileSize * 0.6, eyeY, eyeSize, eyeSize);
            } else {
                // Draw body segment with gradient
                let gradientPercentage = index / snake.body.length;
                let greenValue = Math.floor(255 * (1 - gradientPercentage));
                ctx.fillStyle = `rgb(0, ${greenValue}, 0)`;
                ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
            }
        });

        // Draw food
        ctx.fillStyle = colors.food;
        ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

        // Draw lakes
        ctx.fillStyle = "#00f";
        lakes.forEach(drawLake);

    }

    function move() {
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
        if (head.x === food.x && head.y === food.y) {
            spawnFood();
        } else {
            snake.body.pop();
        }

        // Check for collision with wall or self
        if (head.x < 0 || head.x >= boardSizeX || head.y < 0 || head.y >= boardSizeY) {
            clearInterval(intervalId);
            alert("Game over!");
            return;
        }

       
        snake.body.slice(1).forEach(segment => {
            if (head.x === segment.x && head.y === segment.y) {
                clearInterval(intervalId);
                alert("Game over!");
                return;
            }
        });

        if (isPositionInsideLake(head.x, head.y)) {
            clearInterval(intervalId);
            alert("Game over!");
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

    let intervalId = setInterval(() => {
        move();
        draw();
    }, 100);

    document.addEventListener("keydown", changeDirection);
};
