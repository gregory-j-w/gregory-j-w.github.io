var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

//CANVAS_________
var canvasSize = {
  width: 600,
  height: 400
};
var drawCanvas = function() {
  canvas.setAttribute('height', canvasSize.height);
  canvas.setAttribute('width', canvasSize.width);
};
drawCanvas();

//PADDLE_________
var paddle = {
  loc:{},
  width: 100,
  height: 15,
  dir: "",
  speed: 4,
  init: function(){
    this.loc = {x: (canvasSize.width-paddle.width)/2, y: canvasSize.height - 40};
    this.dir = "";
  },
  draw: function(){
    ctx.beginPath();
    ctx.rect((paddle.loc.x), (paddle.loc.y), paddle.width, paddle.height)
    ctx.fillStyle = 'rgb(25,75,130)';
    ctx.fill();
  },
  //paddle controls left or right
  move: function(){
    if(paddle.dir === "right" && paddle.loc.x >= canvasSize.width - paddle.width) {
      paddle.loc.x = paddle.loc.x;
    } else if(paddle.dir === "right" && paddle.loc.x <= canvasSize.width) {
      paddle.loc.x = paddle.loc.x + paddle.speed;
    }else if(paddle.dir === "left" && paddle.loc.x <= 0) {
      paddle.loc.x = paddle.loc.x;
    }else if(paddle.dir === "left" && paddle.loc.x >= 0) {
      paddle.loc.x = paddle.loc.x - paddle.speed;
    }
  }
}
//padde event listener
document.addEventListener('keydown', function(event){
  var key = event.which;
  if(key === 39){
    paddle.dir = "right";
  } else if (key === 37){
    paddle.dir = "left";
  }
});

document.addEventListener('keyup', function(event){
  var key = event.which;
  if(key === 39){
    paddle.dir = "";
  } else if (key === 37){
    paddle.dir = "";
  }
});

//BALL___________
var ball = {
  loc: {},
  r: 10,
  dir: {},
  init: function() {
    ball.loc.x = paddle.loc.x + (paddle.width/2);
    ball.loc.y = paddle.loc.y - ball.r;
    ball.dir.x = 3;
    ball.dir.y = -3;
  },
  stop: function() {
    ball.dir.x = 0;
    ball.dir.y = 0;
  },
  stopped: true,
  draw: function() {
    ctx.beginPath();
    ctx.arc(ball.loc.x, ball.loc.y, ball.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'rgb(200,200,200)';
    ctx.fill();
  },
  move: function() {
    if(ball.stopped) {
      return
    }
    //check for collision with top
    if (ball.loc.y + ball.dir.y - ball.r <= 0){
      ball.dir.y = -ball.dir.y;
    }
    //check for collision with bottom/turn over
    if (ball.loc.y - ball.r >= canvasSize.height) {
      endTurn();
    }
    //check for collision with sides
    if (ball.loc.x + ball.dir.x - ball.r <= 0 ||
      ball.loc.x + ball.dir.x + ball.r >= canvasSize.width) {
      ball.dir.x = - ball.dir.x;
    }
    //check for collision with paddle
    //if ball location is at least paddle y loc
    if (ball.loc.y + ball.dir.y + ball.r >= paddle.loc.y) {
      //if ball loc is on top of the paddle
      if (ball.loc.x + ball.dir.x >= paddle.loc.x &&
        ball.loc.x + ball.dir.x <+paddle.loc.x + paddle.width) {
        //if the ball is between paddle.loc.x and paddle.loc.x +33
        if(ball.loc.x + ball.dir.x >= paddle.loc.x &&
          ball.loc.x + ball.dir.x < paddle.loc.x + 33) {
            console.log("paddle left");
            //if ball.dir.x >= 3, dir = 3
            if (ball.dir.x > 0) {
              ball.dir.x = 3;
            } //else if paddle.dir x < 0, dir = -3
            else if (ball.dir.x < 0) {
              ball.dir.x =-3;
            }
            console.log(ball.dir);
          }
      //if the ball is between paddle.loc.x + 33 and paddle.loc.x +63
      if(ball.loc.x + ball.dir.x >= paddle.loc.x + 33 &&
        ball.loc.x + ball.dir.x < paddle.loc.x + 63) {
          console.log("paddle middle");
          //if ball.dir.x >= 3, dir = 3
          if (ball.dir.x >= 3) {
            ball.dir.x = ball.dir.x - 2;
            console.log(-2);
          } //else if paddle.dir x < 0, dir = -3
          else if (ball.dir.x <= -3 ) {
            ball.dir.x = ball.dir.x + 2;
            console.log(+2);
          }
          console.log(ball.dir);
        }
      //if the ball is between paddle.loc.x + 63 and paddle.loc.x + paddle.width
      if(ball.loc.x + ball.dir.x >= paddle.loc.x + 63 &&
        ball.loc.x + ball.dir.x < paddle.loc.x + paddle.width) {
          console.log("paddle right");
          //if ball.dir.x >= 3, dir = 3
          if (ball.dir.x > 0) {
            ball.dir.x = 3;
          } //else if paddle.dir x < 0, dir = -3
          else if (ball.dir.x < 0) {
            ball.dir.x =-3;
          }
          console.log(ball.dir);
        }
        ball.dir.y = -ball.dir.y;
      }
    }
    //check for collision with bricks
    for (i = 0; i < brick.loc.length; i++) {
      //if ball.loc x is greater than brick x location
      if (ball.loc.x + ball.dir.x + ball.r >= brick.loc[i][0] &&
        //and ball.loc x is less than brick x location + brick.width
        ball.loc.x + ball.dir.x - ball.r <= brick.loc[i][0] + brick.width &&
        //and ball.loc y is less than brick y loc
        ball.loc.y + ball.dir.y + ball.r >= brick.loc[i][1] &&
        //and ball.loc y is greater than brick y loc + brick.height
        ball.loc.y + ball.dir.y - ball.r <= brick.loc[i][1] + brick.height) {
          //check if ball hit brick - dir.x
          if (ball.loc.x + ball.r <= brick.loc[i][0] ||
            ball.loc.x - ball.r >= brick.loc[i][0] + brick.width &&
            //and if ball loc was inside y sides
            ball.loc.y + ball.r >= brick.loc[i][1] &&
            ball.loc.y - ball.r <= brick.loc[i][1] + brick.height) {
              //flip dir.x
              ball.dir.x = - ball.dir.x;
              //return hit - delete brick, add to score
              brick.destroyed.push(brick.loc[i]);
              brick.hit();
          }
          else if (ball.loc.y + ball.r <= brick.loc[i][1] ||
            ball.loc.y - ball.r >= brick.loc[i][1] + brick.height &&
            ball.loc.x + ball.r >= brick.loc[i][0] &&
            ball.loc.x - ball.r <= brick.loc[i][0] + brick.width) {
              ball.dir.y = -ball.dir.y;
              brick.destroyed.push(brick.loc[i]);
              brick.hit();
              // brick.destroyed.push(brick.loc[i][1]);
            }
        }
    }
    ball.loc.x = ball.loc.x + ball.dir.x;
    ball.loc.y = ball.loc.y + ball.dir.y;
  } //end ball move
} //end ball object

//BRICKS_________
var brick = {
  width: 53,
  height: 25,
  loc: [],
  //array of bricks that have been hit
  destroyed: [],
  init: function() {
    this.loc = [
      [10, 10], [68, 10], [126, 10], [184, 10], [242, 10], [300, 10], [358, 10], [416, 10], [474, 10], [532, 10],
      [10, 50], [68, 50], [126, 50], [184, 50], [242, 50], [300, 50], [358, 50], [416, 50], [474, 50], [532, 50],
      [10, 90], [68, 90], [126, 90], [184, 90], [242, 90], [300, 90], [358, 90], [416, 90], [474, 90], [532, 90],
      [10, 130], [68, 130], [126, 130], [184, 130], [242, 130], [300, 130], [358, 130], [416, 130], [474, 130], [532, 130]
    ]
  },
  draw: function() {
      for (i = 0; i < brick.loc.length; i++) {
        ctx.beginPath();
        ctx.rect(brick.loc[i][0], brick.loc[i][1], brick.width, brick.height);
        ctx.closePath();
        ctx.fillStyle = 'rgb(132,31,39)';
        ctx.fill();
      };
  },
  hit: function() {
    game.score += 5;
    gameWin();
    for (i = 0; i < brick.destroyed.length; i++) {
      brick.loc = brick.loc.filter(function(event) {
        return event !== brick.destroyed[i];
      })
    }
  }
} //end brick

//SCOREBOARD_____
var game = {
  lives: 3,
  score: "0",
  pointsPerBrick: 5,
  init: function() {
    game.lives = 3;
  }
}

function scoreKeep() {
  if (brick.destroyed.length === 0) {
    game.score = "0";
  }
else {
    game.score = brick.destroyed.length * game.pointsPerBrick;
  }
}
//display scoreboard
function scoreboard() {
  if (game.lives === 2) {
    document.getElementById('life3').setAttribute("src", "img/death.jpg");
  } else if (game.lives === 1) {
    document.getElementById('life3').setAttribute("src", "img/death.jpg");
    document.getElementById('life2').setAttribute("src", "img/death.jpg");
  } else if (game.lives === 0) {
    document.getElementById('life1').setAttribute("src", "img/death.jpg");
    document.getElementById('life2').setAttribute("src", "img/death.jpg");
    document.getElementById('life3').setAttribute("src", "img/death.jpg");
  }
  scoreKeep();
  document.getElementById('points-count').textContent = game.score;
};
//____________________________________________________

//START BUTTON___
function init() {
  game.init();
  paddle.init();
  ball.init();
  brick.init();
};
init();

function draw() {
  paddle.draw();
  ball.draw();
  brick.draw();
  scoreboard();
};
draw();

function start() {
  document.getElementById('start').onclick = function() {
    ball.stopped = false;
  }
};
start();


function animateCanvas() {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  paddle.move();
  ball.move();
  brick.hit();
  ball.draw();
  paddle.draw();
  brick.draw();
  scoreboard();
  window.requestAnimationFrame(animateCanvas);
  if (ball.loc.y + ball.r == canvasSize.height) {
    endTurn();
  };
};
animateCanvas();

function endTurn() {
  if (game.lives > 0) {
    ball.stopped = true;
    game.lives = game.lives - 1;
    paddle.init();
    ball.init();
    start();
  }
  else {
    gameOver();
  }
};

function gameWin() {
  if (brick.loc.length < 1) {
    ball.stoped = true;
    ctx.font = "48px serif";
    ctx.fillStyle = "black";
    ctx.fillText("YOU WIN!!!!!!!!", 150, canvasSize.height/2);
  }
};

function gameOver() {
  ball.stopped = true;
  ctx.font = "48px serif";
  ctx.fillText("GAME OVER", 200, canvasSize.height/2);
};
