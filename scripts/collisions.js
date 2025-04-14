/* ******************************************************
 * CPA - Conception et pratique de l'algorithmique.
 * Copyright (C) 2014 <Binh-Minh.Bui-Xuan@ens-lyon.org>.
 * GPL version>=3 <http://www.gnu.org/licenses/>.
 * $Id: RBB_collision.js 2014-01-28 buixuan $
 * ******************************************************/

//--------------------------//
// INIT SOME CONFIGURATIONS //
//--------------------------//

var context=main_window.getContext('2d');

var worldWidth = 2000;
var worldHeight = 2000;


var width=main_window.width;
var height=main_window.height;
var friction=0.98;


var red = new player(0x51E77E,
                    new avatar(3*worldWidth/4,worldHeight/2,height/6,"#FF0000","#FF2400"),
                    new keys(0x25,0x27,0x26,0x28)
                    );
  
var p1 = new food(
                new avatar(Math.random() * worldWidth, Math.random() * worldHeight,height/20,"#0002AA","#0066FF"),
                );
var p2 = new food(
                new avatar(Math.random() * worldWidth, Math.random() * worldHeight,height/25,"#0002AA","#505050"),
                );

var bush1 = new bush(
                new buisson(Math.random() * worldWidth, Math.random() * worldHeight,height/5),
                );                

//var players = new Array(red, blue);
var ressources = new Array(p1, p2);
var bushes = new Array(bush1);

//--------------------------//
// END OF CONFIGURATIONS    //
//--------------------------//

//object camera to get the window following the main player
var camera = {
  x: 0,
  y: 0,
  follow: red.avatar, // main player
  update: function() {
      // Center the camera on the main player
      this.x = this.follow.x - width / 2;
      this.y = this.follow.y - height / 2;

      // Clamp camera within world boundaries
      this.x = Math.max(0, Math.min(this.x, worldWidth - width));
      this.y = Math.max(0, Math.min(this.y, worldHeight - height));
  }
};

function drawWorldBorder() {
  context.strokeStyle = '#222'; // Dark grey border, adjust as you like
  context.lineWidth = 4;        // Thickness of the border

  // Draw the rectangle adjusted to the camera's view
  context.strokeRect(
      -camera.x,
      -camera.y,
      worldWidth,
      worldHeight
  );
}


function bush(buisson){
  this.buisson = buisson;
  this.img = new Image();
  this.img.src = "./bush.png"; 

  this.draw = draw;
  function draw() {
      context.drawImage(
          this.img,
          this.buisson.x - this.buisson.radius - camera.x,
          this.buisson.y - this.buisson.radius - camera.y,
          this.buisson.radius * 2,
          this.buisson.radius * 2
      );
  }
}


function food(avatar){
    this.avatar = avatar;

    this.draw=draw;  
    function draw() {
      context.beginPath();
      var g = context.createRadialGradient(
          this.avatar.x - camera.x, this.avatar.y - camera.y,
          this.avatar.radius * 0.98,
          this.avatar.x - camera.x, this.avatar.y - camera.y,
          this.avatar.radius
      );
      g.addColorStop(0, this.avatar.color);
      g.addColorStop(1, this.avatar.bordercolor);
      context.fillStyle = g;
      context.arc(this.avatar.x - camera.x, this.avatar.y - camera.y,
                  this.avatar.radius, 0, Math.PI * 2, true);
      context.fill();
      context.closePath();
  }
}

function avatar(x,y,r,c,bc){
  this.name="CIRCLE";
  this.x=x;
  this.y=y;
  this.radius=r;
  this.color=c;
  this.bordercolor=bc;
}

function buisson(x,y,r){
  this.name="BUISSON"; 
  this.x=x;
  this.y=y; 
  this.radius=r;

}

function keys(l,r,u,d){
  this.left={code:l,hold:false};
  this.right={code:r,hold:false};
  this.up={code:u,hold:false};
  this.down={code:d,hold:false};
}

function player(id, avatar, keys){
  this.id=id;
  this.avatar=avatar;
  this.keys=keys;
  this.vx=0;
  this.vy=0;

  this.updateFriction=updateFriction;
  function updateFriction(){ this.vx*=friction; this.vy*=friction; }

  this.updateCommands=updateCommands;
  function updateCommands(){ 
    if(this.keys.left.hold){this.vx--;}
    if(this.keys.right.hold){this.vx++;}
    if(this.keys.up.hold){this.vy--;}
    if(this.keys.down.hold){this.vy++;}
  }

  this.updateCollisionBorder=updateCollisionBorder;
  function updateCollisionBorder(){ 
    if (collisionLeftBorder(avatar)){ this.vx*=-0.5; this.avatar.x=this.avatar.radius; return true; }
    if (collisionRightBorder(avatar)){ this.vx*=-0.5; this.avatar.x=worldWidth-this.avatar.radius; return true; }
    if (collisionTopBorder(avatar)){ this.vy*=-0.5; this.avatar.y=this.avatar.radius; return true; }
    if (collisionBottomBorder(avatar)){ this.vy*=-0.5; this.avatar.y=worldHeight-this.avatar.radius; return true; }
    return false;
  }
  
  this.updateCollisionSameMass=updateCollisionSameMass;
  function updateCollisionSameMass(otherPlayer){
    if(collisionCircles(this.avatar, otherPlayer.avatar )&& this.avatar.radius >= (otherPlayer.avatar.radius +3)){
      this.avatar.radius += otherPlayer.avatar.radius /10;
      otherPlayer.avatar.radius = 0;
      return true;
    }
    return false;
  }

  this.updateCollisionFood=updateCollisionFood;
  function updateCollisionFood(someFood){
    if(collisionCircles(this.avatar, someFood.avatar)){
      this.avatar.radius += someFood.avatar.radius /5;
      someFood.avatar.radius = 0;
      return true;
    }
    return false;
  }

  this.updatePosition=updatePosition;
  function updatePosition(){ this.avatar.x+=this.vx; this.avatar.y+=this.vy; }
 
  this.draw=draw;
  function draw() {
      context.beginPath();
      var g = context.createRadialGradient(
          this.avatar.x - camera.x, this.avatar.y - camera.y,
          this.avatar.radius * 0.98,
          this.avatar.x - camera.x, this.avatar.y - camera.y,
          this.avatar.radius
      );
      g.addColorStop(0, this.avatar.color);
      g.addColorStop(1, this.avatar.bordercolor);
      context.fillStyle = g;
      context.arc(this.avatar.x - camera.x, this.avatar.y - camera.y,
                  this.avatar.radius, 0, Math.PI * 2, true);
      context.fill();
      context.closePath();
  }
}

document.onkeydown = function(event) {
  var key_pressed;
  if(event == null){
    key_pressed = window.event.keyCode;
  } else {
    key_pressed = event.keyCode;
  }
  for (var i=0;i<players.length;i++) {
    for (key in players[i].keys) {
      if (key_pressed == players[i].keys[key].code){
        players[i].keys[key].hold=true;
      }
    }
  }
}
 
document.onkeyup = function(event) {
  var key_pressed;
  if(event == null){
    key_pressed = window.event.keyCode;
  } else {
    key_pressed = event.keyCode;
  }
  for (var i=0;i<players.length;i++) {
    for (key in players[i].keys) {
      if (key_pressed == players[i].keys[key].code){
        players[i].keys[key].hold=false;
      }
    }
  }
}

function createStaticPlayer(color, borderColor) {
  console.log("Creating static player");
  let radius = height / 10;
  let x = Math.random() * (worldWidth - 2 * radius) + radius;
  let y = Math.random() * (worldHeight - 2 * radius) + radius;

  return new player(
      Math.floor(Math.random() * 0xFFFFFF), // random ID
      new avatar(x, y, radius, color, borderColor),
      new keys(0x00, 0x00, 0x00, 0x00) // no active keys
  );
}
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var players = [];
players.push(red);

for (let i = 0; i < 9; i++) {
  console.log("initializing player " + i);
  let color = getRandomColor();
  let border = getRandomColor();
  let staticPlayer = createStaticPlayer(color, border);
  players.push(staticPlayer);
}


function on_enter_frame(){

    camera.update();

  // loop to update players' position
    for (var i = 0; i < players.length; i++) {
        players[i].updateFriction();
        players[i].updateCommands();
        players[i].updateCollisionBorder();
    }
  
    // loop to handle collision between players
    // has to be done in different loop otherwise not every players are checked
    var tmpPlayers = []
    var tmpFood = []
    for(var j=0;j<players.length;j++){
        var collisionCheck=false;
        var foodCollisionCheck=false;
        for (var i=0;i<players.length;i++) {
            if(i!=j){                
                collisionCheck=players[i].updateCollisionSameMass(players[j]);          
            }
        }
        
        if(collisionCheck){
            console.log("azertgyhujkl");
            console.log(tmpPlayers);
            tmpPlayers.push(j);
        }
        for (var k=0;k<ressources.length;k++){
            foodCollisionCheck = players[j].updateCollisionFood(ressources[k]);
            if(foodCollisionCheck){
                tmpFood.push(k);
            }
        }
    }

    tmpPlayers.sort(function(a, b) { return b - a; });  // Tri décroissant
    for( var k=0; k<tmpPlayers.length; k++){
        players.splice(tmpPlayers[k],1);
    }
    //console.log(players);

    tmpFood.sort(function(a, b) { return b - a; });  // Tri décroissant
    for( var k=0; k<tmpFood.length; k++){
        ressources.splice(tmpFood[k],1);
    }
    
    
    context.clearRect(0,0,width,height);
   // context.fillStyle=blue.avatar.color;
    drawWorldBorder();  
    for (var i=players.length-1;i>-1;i--) {
      players[i].updatePosition();
      players[i].draw();
    }
    for (var i=ressources.length-1;i>-1;i--) {
        ressources[i].draw();
    }
    for (var i=bushes.length-1;i>-1;i--) {
        bushes[i].draw();
    }
    context.restore();



}

