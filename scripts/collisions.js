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

const gravityStrength = 0.1;

var width=main_window.width;
var height=main_window.height;
var friction=0.98;


var red = new player(0x51E77E,
                    new avatar(3*worldWidth/4,worldHeight/2,height/8,"#FF0000","#FF2400"),
                    new keys(0x25,0x27,0x26,0x28, 0x20) // left, right, up, down, space
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
  follow: red,
  update: function () {
    const avatars = this.follow.avatars;
  
    if (avatars.length === 0) return;
  
    let sumX = 0;
    let sumY = 0;
  
    for (let i = 0; i < avatars.length; i++) {
      sumX += avatars[i].x;
      sumY += avatars[i].y;
    }
  
    let centerX = sumX / avatars.length;
    let centerY = sumY / avatars.length;
  
    this.x = centerX - width / 2;
    this.y = centerY - height / 2;
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

function getRandomPositionInCircle(centerX, centerY, radius) {
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.sqrt(Math.random()) * radius; // sqrt for uniform distribution
  const x = centerX + r * Math.cos(angle);
  const y = centerY + r * Math.sin(angle);
  return { x, y };
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
  this.vx = 0; // new!
  this.vy = 0; // new!

  this.updateCollisionSamePlayer=updateCollisionSamePlayer;
  function updateCollisionSamePlayer(otherAvatar){
    if(collisionCircles(this, otherAvatar)){
      var x1=this.x;
      var y1=this.y;
      var r1=this.radius;
      var x2=otherAvatar.x;
      var y2=otherAvatar.y;
      var r2=otherAvatar.radius;

      var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));

      
      var nx = (x2 - x1)/d;//(r1+r2);
      var ny = (y2 - y1)/d;//(r1+r2);
      var gx = -ny;
      var gy = nx;

      
      var v1n = nx*this.vx + ny*this.vy;
      var v1g = gx*this.vx + gy*this.vy;
      var v2n = nx*otherAvatar.vx + ny*otherAvatar.vy;
      var v2g = gx*otherAvatar.vx + gy*otherAvatar.vy;

      this.vx = nx*v2n +  gx*v1g;
      this.vy = ny*v2n +  gy*v1g;
      otherAvatar.vx = nx*v1n +  gx*v2g;
      otherAvatar.vy = ny*v1n +  gy*v2g;

      otherAvatar.x = x1 + (r1+r2)*(x2-x1)/d;
      otherAvatar.y = y1 + (r1+r2)*(y2-y1)/d;
      return true;
      
    }
    return false;
  }
}

function buisson(x,y,r){
  this.name="BUISSON"; 
  this.x=x;
  this.y=y; 
  this.radius=r;

}

function keys(l,r,u,d,s){
  this.left={code:l,hold:false};
  this.right={code:r,hold:false};
  this.up={code:u,hold:false};
  this.down={code:d,hold:false};
  this.space={code:s,hold:false};
}

function player(id, avatar1, keys){
  this.id=id;
  this.avatars=[avatar1];
  this.keys=keys;

  //this part will be for a kind of gravity center that has to bring closer all the avatars
  this.centerX=this.avatars[0].x;
  this.centerY=this.avatars[0].y; 

  this.applyInternalGravity=applyInternalGravity;
  function applyInternalGravity(){
      if(this.avatars.length <=1) return;

      let totx = 0;
      let toty = 0;
      for(let i = 0; i < this.avatars.length; i++){
        totx += this.avatars[i].x;
        toty += this.avatars[i].y;
      }
      this.centerX = totx / this.avatars.length;
      this.centerY = toty / this.avatars.length;
      
      for (let i = 0; i < this.avatars.length; i++) {
        let av = this.avatars[i];

        let dx = this.centerX - av.x;
        let dy = this.centerY - av.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
      
        // Normalize direction
        if (dist > 1e-2) {
          dx /= dist;
          dy /= dist;
        }
        av.vx += dx * gravityStrength;
        av.vy += dy * gravityStrength; 
        for (let j = 0; j < this.avatars.length; j++) { 
          if(i == j) continue;    
          //to handle the collision between the avatars of the same player  
          av.updateCollisionSamePlayer(this.avatars[j]);
        }
        
      }

  }

  

  this.updateFriction=updateFriction;
  function updateFriction(){ 
    for(let i = 0; i < this.avatars.length; i++){
      this.avatars[i].vx *= friction;
      this.avatars[i].vy *= friction;
    }
    //this.vx*=friction; this.vy*=friction; 
  }

  this.updateCommands=updateCommands;
  function updateCommands(){ 
    for(let i = 0; i < this.avatars.length; i++){

      if(this.keys.left.hold){this.avatars[i].vx -= 0.5;}//to handle the speed of the player (1-this.avatar.radius)
      if(this.keys.right.hold){this.avatars[i].vx+= 0.5;}
      if(this.keys.up.hold){this.avatars[i].vy-= 0.5;}
      if(this.keys.down.hold){this.avatars[i].vy+= 0.5;}
      if(this.keys.space.hold){console.log("space split"); this.split();}
    }
  }

  this.updateCollisionBorder=updateCollisionBorder;
  function updateCollisionBorder(){
    for(let i = 0; i < this.avatars.length; i++){
      if(collisionLeftBorder(this.avatars[i])){ this.avatars[i].vx*=-0.5; this.avatars[i].x=this.avatars[i].radius; }
      if(collisionRightBorder(this.avatars[i])){ this.avatars[i].vx*=-0.5; this.avatars[i].x=worldWidth-this.avatars[i].radius; }
      if(collisionTopBorder(this.avatars[i])){ this.avatars[i].vy*=-0.5; this.avatars[i].y=this.avatars[i].radius; }
      if(collisionBottomBorder(this.avatars[i])){ this.avatars[i].vy*=-0.5; this.avatars[i].y=worldHeight-this.avatars[i].radius; }
    }
    return false;
  }
  
  this.updateCollisionSameMass=updateCollisionSameMass;
  function updateCollisionSameMass(otherPlayer){
    avartarToDelete = [];
    for(let i = 0; i < this.avatars.length; i++) {
      for(let j = 0; j < otherPlayer.avatars.length; j++) {
        if(collisionCircles(this.avatars[i], otherPlayer.avatars[j]) && this.avatars[i].radius >= (otherPlayer.avatars[j].radius +3)){
          this.avatars[i].radius += otherPlayer.avatars[j].radius /10;
          otherPlayer.avatars[j].radius = 0;
          console.log("collision between "+this.id+" and "+otherPlayer.id);
          avartarToDelete.push(j);
        }
      }
      avartarToDelete.sort(function(a, b) { return b - a; });  // Tri décroissant
      for( var k=0; k<avartarToDelete.length; k++){
          otherPlayer.avatars.splice(avartarToDelete[k],1);
      }
    }
    return avartarToDelete.length > 0; // return true if any avatar was deleted
  }

  this.updateCollisionFood=updateCollisionFood;
  function updateCollisionFood(someFood){
    for (let i = 0; i < this.avatars.length; i++) {
      if(collisionCircles(this.avatars[i], someFood.avatar)){
        this.avatars[i].radius += someFood.avatar.radius /5;
        someFood.avatar.radius = 0;
        return true;
      }
    }
    return false;
  }

  this.updateBushCollision=updateBushCollision;
  function updateBushCollision(aBush){
    for (let i = 0; i < this.avatars.length; i++) {
      if(collisionCircles(this.avatars[i], aBush.buisson)&& this.avatars[i].radius >= (aBush.buisson.radius +3)){
        this.split();
        // this.avatars[i].radius += aBush.buisson.radius /5;
        // aBush.avatar.radius = 0;
        return true;
      }
    }
    return false;
  }

  this.updatePosition=updatePosition;
  function updatePosition(){ 
    for (let i = 0; i < this.avatars.length; i++) {
        this.avatars[i].x += this.avatars[i].vx;
        this.avatars[i].y += this.avatars[i].vy;
    }
  }
 
  this.draw=draw;
  function draw() {
    for (let i = 0; i < this.avatars.length; i++) {
        context.beginPath();
        var g = context.createRadialGradient(
            this.avatars[i].x - camera.x, this.avatars[i].y - camera.y,
            this.avatars[i].radius * 0.98,
            this.avatars[i].x - camera.x, this.avatars[i].y - camera.y,
            this.avatars[i].radius
        );
        g.addColorStop(0, this.avatars[i].color);
        g.addColorStop(1, this.avatars[i].bordercolor);
        context.fillStyle = g;
        context.arc(this.avatars[i].x - camera.x, this.avatars[i].y - camera.y,
                    this.avatars[i].radius, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
    }
  }

  this.split = split;
  function split() {

    if (this.avatars.length >= 16) return; // limit split to prevent abuse
    for(let i = 0; i < this.avatars.length; i++) {
      if (this.avatars[i].radius > 100){ // if not too small to split
        let newRadius = this.avatars[i].radius / Math.sqrt(2); // keeps area same (πr²)
        this.avatars[i].radius = newRadius;
        let angle = Math.atan2(this.avatars[i].vy, this.avatars[i].vx); // movement angle
        let distance = newRadius * 2;
        let speed = 8;
        let newX = this.avatars[i].x + Math.cos(angle) * distance;
        let newY = this.avatars[i].y + Math.sin(angle) * distance;

        let newAvatar = new avatar(newX, newY, newRadius, this.avatars[i].color, this.avatars[i].bordercolor);
        
        newAvatar.vx = Math.cos(angle) * speed;
        newAvatar.vy = Math.sin(angle) * speed;
        this.avatars.push(newAvatar);
      } 
    }
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
        players[i].applyInternalGravity();
        players[i].updateCollisionBorder();
    }
  
    // loop to handle collision between players
    // has to be done in different loop otherwise not every players are checked
    var tmpPlayers = []
    var tmpFood = []
    var tmpBush = []
    for(var j=0;j<players.length;j++){
        var collisionCheck=false;
        var foodCollisionCheck=false;
        var bushCollisionCheck=false;
        for (var i=0;i<players.length;i++) {
            if(i!=j){      
                collisionCheck|=players[i].updateCollisionSameMass(players[j]);          
            }
        }
        
        if(collisionCheck){
            console.log("azertgyhujkl");
            console.log(tmpPlayers);
            tmpPlayers.push(j);
        }
        for (var k=0;k<ressources.length;k++){
            foodCollisionCheck |= players[j].updateCollisionFood(ressources[k]);
            if(foodCollisionCheck){
                tmpFood.push(k);
            }
        }
        for (var l=0;l<bushes.length;l++){
          bushCollisionCheck |= players[j].updateBushCollision(bushes[l]);
        }
    }
    
    for (let i = players.length - 1; i >= 0; i--) {
      if (players[i].avatars.length === 0) {
        players.splice(i, 1);
      }
    }
    // tmpPlayers.sort(function(a, b) { return b - a; });  // Tri décroissant
    // for( var k=0; k<tmpPlayers.length; k++){
    //     players.splice(tmpPlayers[k],1);
    // }
    //console.log(players);

    tmpFood.sort(function(a, b) { return b - a; });  // Tri décroissant
    for( var k=0; k<tmpFood.length; k++){
        ressources.splice(tmpFood[k],1);
    }

    tmpBush.sort(function(a, b) { return b - a; });  // Tri décroissant
    for( var k=0; k<tmpBush.length; k++){
        bushes.splice(tmpBush[k],1);
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

