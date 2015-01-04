(function() {

  //////////////////// CONSTANTS ////////////////////

  // canvas
  var WIDTH = 800;
  var HEIGHT = 460;

  // ball
  var BALL_RADIUS = 7.5;
  var BALL_SPEED = 5;
  var BALL_COLOR = "#ffffff";

  // paddle
  var PADDLE_WIDTH = 11;
  var PADDLE_HEIGHT = 62;
  var PADDLE_SPEED = 6;
  var PADDLE_COLOR = "#f6eb16";

  /////////////// GLOBAL VARIABLES ///////////////////

  var user;       // the user's paddle
  var comp;       // the computer's paddle
  var ball;       // the ball object

  var canvas;     // canvas element
  var ctx;        // canvas context
  var RAF;        // a handle for the current requestAnimationFrame

  ////////// PADDLE CONSTRUCTOR / FUNCTIONS //////////

  function Paddle() {
    this.dx = 0;
    this.dy = 0;
    this.speed = PADDLE_SPEED;
  }

  Paddle.prototype.reset = function(x, y) {
    this.x = x;
    this.y = y;
  }

  Paddle.prototype.move  = function() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  Paddle.prototype.draw = function() {
    ctx.fillStyle = PADDLE_COLOR;
    ctx.fillRect(this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);   
  }

  /////////// USER PADDLE FUNCTIONS ///////////

  user = new Paddle();

  user.update = function() {
    if (this.y > HEIGHT - PADDLE_HEIGHT) {
      this.dy = 0;
      this.y = HEIGHT - PADDLE_HEIGHT;
    } else if (this.y < 0) {
      this.dy = 0;
      this.y = 0;
    }  
  }

  ////////// COMPUTER PADDLE FUNCTIONS ////////

  comp = new Paddle();

  comp.predict = function() {
    if (ball.y > this.y + (PADDLE_HEIGHT / 2) && ball.dx < 0) {
      this.dy = 1;
    } else if (ball.y < this.y + (PADDLE_HEIGHT / 2) && ball.dx < 0) {
      this.dy = -1;
    } else {
      this.dy = 0;
    }
  }

  //////////// BALL CONTRUCTOR / FUNCTIONS ///////////

  function Ball() {
    this.x;
    this.y;
    this.dx;
    this.dy;
    this.speed = BALL_SPEED;
  }

  Ball.prototype.move = function() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, BALL_RADIUS, 0, 2 * Math.PI, false);
    ctx.fillStyle = BALL_COLOR;
    ctx.fill();
    ctx.stroke();
  }

  Ball.prototype.reset = function(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 1;
    this.dy = 1;
  }

  ball = new Ball();

  //////////////// FUNCTIONS //////////////////

  function createCanvas() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.getElementById("pong").appendChild(canvas);
  }

  var requestAnimationFrame = 
    window.requestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.msRequestAnimationFrame;

  function startGame() {
    RAF = requestAnimationFrame(loop);    
  }

  function stopGame() {
    ball.reset(WIDTH / 2, HEIGHT / 2);
  }

  function clearCanvas() {
    ctx.clearRect(0, 0 , WIDTH, HEIGHT);

    // draw midline
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.strokeStyle = "#2AAAE2";
    ctx.stroke();   
  }

  function resetElements() {
    ball.reset(WIDTH / 2, HEIGHT / 2);
    user.reset(WIDTH - 10 - PADDLE_WIDTH, (HEIGHT / 2) - (PADDLE_HEIGHT / 2));
    comp.reset(10, (HEIGHT / 2) - (PADDLE_HEIGHT / 2));   
  }

  function loop() {

    clearCanvas();

    user.draw();
    user.move();
    user.update();

    comp.draw();
    comp.predict();
    comp.move();

    ball.draw();
    ball.move();

    // detect ball collision with top or bottom
    if (ball.y > HEIGHT - BALL_RADIUS) {
      ball.dy *= -1;
    } else if (ball.y < BALL_RADIUS) {
      ball.dy *= -1;
    }

    // detect ball/user collision
    if (ball.y > user.y && ball.y < user.y + PADDLE_HEIGHT && ball.x + BALL_RADIUS > user.x) {
      if (user.dy == 0) {
        ball.dx = -1;
      } else {
        ball.dx = -1;
        ball.dy *= 1.2;
      }
    }

    // detect ball/comp collision
    if (ball.y > comp.y && ball.y < comp.y + PADDLE_HEIGHT && ball.x - BALL_RADIUS < comp.x + PADDLE_WIDTH)
      ball.dx = 1;

    // detect points
    if (ball.x > WIDTH + BALL_RADIUS * 2) {
      //detect point for computer
      stopGame();
    } else if (ball.x < -2 * BALL_RADIUS) {
      //detect point for user
      stopGame();
    } else {
      RAF = requestAnimationFrame(loop);
    }

  };

  //////////////// EVENT HANDLERS ////////////////

  var key_detector = (function() {
    var map = []; 

    onkeydown = onkeyup = function(e) {
      e = e || event; // to deal with IE
      map[e.keyCode] = (e.type == 'keydown');
      updateDirection();
    }

    function updateDirection() {
      if (map[37]) {
        user.dx = -1;
      } else if (map[39]) {
        user.dx = 1;
      } else {
        user.dx = 0;
      }

      if (map[38]) {
        user.dy = -1;
      } else if (map[40]) {
        user.dy = 1;
      } else {
        user.dy = 0;
      }
    }

  })();

  //////////////// MAIN ///////////////////

  createCanvas();
  resetElements();

  canvas.onclick = function() { startGame(); };

  startGame();

})();