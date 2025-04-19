var callback = function() {setInterval(main,30);}
script = document.getElementById("main_script");
script.onreadystatechange = callback;
script.onload = callback;

var red = new player(0x51E77E,
                    new avatar(3*worldWidth/4,worldHeight/2,height/8,"#FF0000","#FF2400"),
                    new keys(0x25,0x27,0x26,0x28, 0x20), // left, right, up, down, space
                    false // isBot
                    );  
                
var bush1 = new bush(
                new buisson(Math.random() * worldWidth, Math.random() * worldHeight,height/5),
                );                

let ressources = [];
var bushes = new Array(bush1);


initFood(100);

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


var players = [];
players.push(red);

initPlayers(10);

function main(){

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

