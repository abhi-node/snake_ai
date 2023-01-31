const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');
const RECT_SIZE = 20;
const SPACE = 5;
const GRID = Array.from(Array((canvas.width) / (RECT_SIZE + SPACE)), () => new Array((canvas.height) / (RECT_SIZE + SPACE)));
let notLost = true;
let score = 0;
let hitApple = false;
let direction = 'down';

for (let i = 0; i < GRID.length; i++) {
    for (let j = 0; j < GRID[0].length; j++) {
        GRID[i][j] = 0;
    }
}

function genApple() {
    let x = Math.floor(Math.random() * (GRID.length));
    let y = Math.floor(Math.random() * (GRID[0].length));
    while (GRID[x][y] == 1) {
        x = Math.floor(Math.random() * (GRID.length));
        y = Math.floor(Math.random() * (GRID[0].length));
    }
    GRID[x][y] = -1;
}

function drawNode(x, y, color) {
    ctx.beginPath();
    ctx.rect(x * (RECT_SIZE + SPACE), y * (RECT_SIZE + SPACE), RECT_SIZE, RECT_SIZE);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawGrid() {
    for (let i = 0; i < GRID.length; i++) {
        for (let j = 0; j < GRID[0].length; j++) {
            if (GRID[i][j] == 0) {
                continue;
            } else if (GRID[i][j] == 1) {
                drawNode(i, j, 'white');
            } else if (GRID[i][j] == -1) {
                drawNode(i, j, 'red');
            }
        }
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.next = null;
        GRID[x][y] = 1;
    }

    getLast() {
        let curr = this;
        while (curr.next != null) {
            curr = curr.next;
        }
        return curr;
    }

    getSecondLast() {
        let curr = this;
        while (curr.next != null && curr.next.next != null) {
            curr = curr.next;
        }
        return curr;
    }

    add() {
        if (score == 0) {
            let last = this.getLast();
            if (direction === 'left') {
                last.next = new Node(last.x + 1, last.y);
            } else if (direction === 'right') {
                last.next = new Node(last.x - 1, last.y);
            } else if (direction === 'up') {
                last.next = new Node(last.x, last.y + 1);
            } else if (direction === 'down') {
                last.next = new Node(last.x, last.y - 1);
            }
        } else {
            let last = this.getLast();
            let secondLast = this.getSecondLast();
            if (last.x - secondLast.x < 0) {
                last.next = new Node(last.x + 1, last.y);
            } else if (last.x - secondLast.x > 0) {
                last.next = new Node(last.x - 1, last.y);
            } else if (last.y - secondLast.y < 0) {
                last.next = new Node(last.x, last.y + 1);
            } else if (last.y - secondLast.y > 0) {
                last.next = new Node(last.x, last.y - 1);
            }
        }
    }

    move(direction) {
        GRID[this.x][this.y] = 0;
        if (direction === 'left') {
            this.x = this.x-1;
        } else if (direction === 'right') {
            this.x = this.x+1;
        } else if (direction === 'up') {
            this.y = this.y-1;
        } else if (direction === 'down') {
            this.y = this.y + 1;
        }
        if (this.x >= GRID.length || this.x < 0 || this.y >= GRID[0].length || this.y < 0 || GRID[this.x][this.y] == 1) {
            notLost = false;
        } else if (GRID[this.x][this.y] == -1) {
            hitApple = true;
            GRID[this.x][this.y] = 1;
        } else {
            GRID[this.x][this.y] = 1;
        }
    }
}
class Snake {
    constructor() {
        this.head = new Node(0, 0);
    }

    moveSnake(direction) {
        let curr = this.head;
        let x = curr.x;
        let y = curr.y;
        curr.move(direction);
        curr = curr.next;
        let d = direction;
        while (curr != null && notLost) {
            if (x-curr.x < 0) {
                d = 'left';
            } else if (x-curr.x > 0) {
                d = 'right';
            } else if (y-curr.y < 0) {
                d = 'up';
            } else if (y-curr.y > 0) {
                d = 'down';
            }
            x = curr.x;
            y = curr.y;
            curr.move(d);
            curr = curr.next;
        }
    }

}

let count = 1;
const snake = new Snake();
genApple();

function draw() {
    addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case "ArrowDown":
                direction = 'down';
                break;
            case "ArrowUp":
                // code for "up arrow" key press.
                direction = 'up';
                break;
            case "ArrowLeft":
                // code for "left arrow" key press.
                direction = 'left';
                break;
            case "ArrowRight":
                // code for "right arrow" key press.
                direction = 'right';
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
    snake.moveSnake(direction);
    if (hitApple) {
        snake.head.add();
        snake.head.add();
        snake.head.add();
        score++;
        genApple();
        hitApple = false;
    }
    drawGrid();
}




function update() {
    if (notLost) {
        if (count % 5 == 0) {
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.closePath();
            draw();
            count = 1;
        }
        count++;
        requestAnimationFrame(update);
    } else {
        alert('YOU LOST')
    }
}

requestAnimationFrame(update);