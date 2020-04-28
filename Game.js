var myGamePiece;

function startGame() {
    //Makes obsticals and player
    myGamePiece = new component(30, 30, "red", 10, 120);
    myFirstObstacle = new component(10, 100, "blue", 300, 200)
    //Starts game
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    //Start function
    start : function() {
        //Sets up canvas
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        //listens for keyboard inputs
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
    }, 
    //clears entire canvas
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    //kills program
    stop : function() {
        clearInterval(this.interval);
    }
}

//Create component
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    //draws the component
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //moves object
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
    //function for detecting collisions    
    this.crashWith = function(otherObj) {
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);
        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + (otherObj.width);
        var otherTop = otherObj.y;
        var otherBottom = otherObj.u + (otherObj.height);
        var crash = true;
        if ((myBottom < otherTop) ||
            (myTop > otherBottom) ||
            (myRight < otherLeft) ||
            (myLeft > otherRight)) {
                crash = false;
            }
            return crash;
    }
    this.hitSide = function(myGameArea) {
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);
        var hitWall = false;
        if ((myLeft < 0) ||
            (myRight > myGameArea.canvas.width) ||
            (myTop < 0) ||
            (myBottom > myGameArea.canvas.height)) {
                hitWall = true;
            }
            return hitWall
    }
}
//update function called every frame
function updateGameArea() {
    //collisions
    if(myGamePiece.hitSide(myGameArea)) {
        myGameArea.stop();
    }
    if (myGamePiece.crashWith(myFirstObstacle)) {
        myGameArea.stop();
    } else {
    // wipes entire screen
    myGameArea.clear();
    //stops pieces from moving
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    //when key pressed tells it to move
    if (myGameArea.keys && myGameArea.keys[68]) {myGamePiece.speedX = 1; }
    if (myGameArea.keys && myGameArea.keys[65]) {myGamePiece.speedX = -1; }
    if (myGameArea.keys && myGameArea.keys[83]) {myGamePiece.speedY = 1; }
    if (myGameArea.keys && myGameArea.keys[87]) {myGamePiece.speedY = -1; }
    //redraws objects after they have been cleared
    myFirstObstacle.update()
    //finds the new position of the player and then draws it b
    myGamePiece.newPos();    
    myGamePiece.update();
    }
}