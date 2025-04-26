var callback = function() {setInterval(main,40);}
script = document.getElementById("main_script");
script.onreadystatechange = callback;
script.onload = callback;

//the player
var red = new player(0x51E77E,
                    new avatar(3*worldWidth/4,worldHeight/2,height/20,"#FF0000","#FF2400"),
                    new keys(0x25,0x27,0x26,0x28, 0x20), // left, right, up, down, space
                    false // isBot
                    );  
                               
let ressources = [];
let bushes = [];
var players = [];

players.push(red);

initPlayers(19);
initFood(300);
initBush(30,bushes);

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



function main(){

    camera.update();

    let mainPlayer = players.find(p => p.id === red.id);

    //When the only player remaining is you.
    if(mainPlayer&&players.length==1){
      context.textAlign="center";
      context.font="200px Arial";
      context.fillText("Gagné!",width/2, height/2);
    }else{

    if(!mainPlayer){
      context.textAlign="center";
      context.font="200px Arial";
      context.fillText("Perdu!",width/2, height/2);
    }else{
      let targetX = mainPlayer.avatars[0].x
      let targetY = mainPlayer.avatars[0].y;
    

    // loop to update players' position
      for (var i = 0; i < players.length; i++) {
          players[i].updateFriction();
          if (players[i].isBot) {
            if (players[i].avatars[0].radius >= mainPlayer.biggestAvatar().radius + 3){
              players[i].updateBotPosition(targetX, targetY, bushes);
            }else{
              players[i].updateCommandsFoodBot(ressources);
            }
          }
          else {
            players[i].updateCommands();
          }
          
          
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
              tmpPlayers.push(j);
          }

          for (var k=0;k<ressources.length;k++){
              foodCollisionCheck = players[j].updateCollisionFood(ressources[k]);
              if(foodCollisionCheck){
                  tmpFood.push(k);
              }
          }
          for (var l=0;l<bushes.length;l++){
            bushCollisionCheck |= players[j].updateBushCollision(bushes[l]);
          }
      }
      
      //If there's no avatar remaining for a player, remove the player.
      for (let i = players.length - 1; i >= 0; i--) {
        if (players[i].avatars.length === 0) {
          players.splice(i, 1);
        }
      }

      let tailleFoodDisparu = tmpFood.length;
      tmpFood.sort(function(a, b) { return b - a; });  // Tri décroissant
      for( var k=0; k<tmpFood.length; k++){
          ressources.splice(tmpFood[k],1);
      }
      initFood(tailleFoodDisparu);

      tmpBush.sort(function(a, b) { return b - a; });  // Tri décroissant
      for( var k=0; k<tmpBush.length; k++){
          bushes.splice(tmpBush[k],1);
      }
      
      context.clearRect(0,0,width,height);
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
    }
}

