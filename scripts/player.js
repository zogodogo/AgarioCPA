function keys(l,r,u,d,s){
  this.left={code:l,hold:false};
  this.right={code:r,hold:false};
  this.up={code:u,hold:false};
  this.down={code:d,hold:false};
  this.space={code:s,hold:false};
}

//representing a player. A player can be a human or a bot. 
function player(id, avatar1, keys,isBot){

  this.id=id;
  //representing a table of avatars.
  this.avatars=[avatar1];
  this.isBot = isBot;
  this.keys = isBot ? null : (keys);

  //this part will be for a kind of gravity center that has to bring closer all the avatars of a same player.
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
  //Updating friction for every avatars of the player.
  function updateFriction(){ 
    for(let i = 0; i < this.avatars.length; i++){
      this.avatars[i].vx *= friction;
      this.avatars[i].vy *= friction;
    }
  }


  if(isBot){
    //this.updateCommands=updateCommandsRandomBot;
    this.updateBotPosition=pathfinding;
    this.updateCommandsFoodBot=updateCommandsFoodBot;
  }else{
    this.updateCommands=updateCommands;
  }
  
  function updateCommands(){ 
    for(let i = 0; i < this.avatars.length; i++){

      if(this.keys.left.hold){this.avatars[i].vx -= 0.5;}//to handle the speed of the player (1-this.avatar.radius)
      if(this.keys.right.hold){this.avatars[i].vx+= 0.5;}
      if(this.keys.up.hold){this.avatars[i].vy-= 0.5;}
      if(this.keys.down.hold){this.avatars[i].vy+= 0.5;}
      if(this.keys.space.hold){this.split();}
    }
  }

  
  function updateCommandsRandomBot(){
    let randomInt = Math.floor(Math.random() * 5);
    for(let i = 0; i < this.avatars.length; i++){
      if(randomInt==0){this.avatars[i].vx -= 0.5;}//to handle the speed of the player (1-this.avatar.radius)
      if(randomInt==1){this.avatars[i].vx+= 0.5;}
      if(randomInt==2){this.avatars[i].vy-= 0.5;}
      if(randomInt==3){this.avatars[i].vy+= 0.5;}
      if(randomInt==4){this.split();}
    }
  }

  function pathfinding(targetX, targetY, listBushes) {
    //actually not really a pathfinding as we don't have cases 
    // so it's trying to reach the main player but the bushes have a repulsion force that is felt 
    // by bots with a radius bigger than the bush radius

    for(let i = 0; i< this.avatars.length; i++){
      let alreadyUpdated = false;

      let attraction = { x: targetX - this.avatars[i].x, y: targetY - this.avatars[i].y };
      let repulsion = { x: 0, y: 0 };

      let distToTarget = Math.sqrt(attraction.x ** 2 + attraction.y ** 2);
      if (distToTarget > 1e-2) {
        attraction.x /= distToTarget;
        attraction.y /= distToTarget;
      }

      let dx = targetX - this.avatars[i].x;
      let dy = targetY - this.avatars[i].y;
      //let dist = Math.sqrt(dx * dx + dy * dy);
      for(let j = 0; j < listBushes.length; j++){
        if(this.avatars[i].radius > listBushes[j].buisson.radius + 3){
          if(bushNear(this.avatars[i], listBushes[j].buisson)){ //need to define bushNear
            dx = this.avatars[i].x - listBushes[j].buisson.x;
            dy = this.avatars[i].y - listBushes[j].buisson.y;
            //let dist = Math.sqrt(dx * dx + dy * dy);

            repulsion.x += dx * 2;//0.5; // Adjust strength as needed
            repulsion.y += dy * 2;//0.5; // Adjust strength as needed

            let repLength = Math.sqrt(repulsion.x ** 2 + repulsion.y ** 2);
            if (repLength > 1e-2) {
              repulsion.x /= repLength;
              repulsion.y /= repLength;
            }
            // let result = avoidBush(this.avatars[i], listBushes[j].buisson, targetX, targetY);
            // dx = result.dx;
            // dy = result.dy;

            this.avatars[i].vx += attraction.x * 0.2 + repulsion.x * 0.5;// * 0.2; // Adjust speed as needed
            this.avatars[i].vy += attraction.y * 0.2 + repulsion.y * 0.5;// * 0.2;
            alreadyUpdated = true;
            break;
          }
        }
      }
      if(!alreadyUpdated){
        if (distToTarget > 1e-2) {
          dx /= distToTarget;
          dy /= distToTarget;
        }
        this.avatars[i].vx += dx * 0.2; // Adjust speed as needed
        this.avatars[i].vy += dy * 0.2; // Adjust speed as needed
      }
    }
  }

  function updateCommandsFoodBot(food){

    let avatars2= this.avatars;
    function nearestFood(){

      let rep = food[0];
      let minDist = Number.MAX_SAFE_INTEGER;
      for(let i=0;i<food.length;i++){
        for(let j=0;j<avatars2.length;j++){
          let dx = avatars2[j].x - food[i].avatar.x;
          let dy = avatars2[j].y - food[i].avatar.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if(minDist>dist){
            minDist = dist;
            rep = food[i];
          }
        }
      }
      return rep;
    }
    let nearestFood1 = nearestFood();

    for(let i = 0; i < this.avatars.length; i++){
      if(nearestFood1.avatar.x<this.avatars[i].x){this.avatars[i].vx -= 0.5;}
      if(nearestFood1.avatar.x>this.avatars[i].x){this.avatars[i].vx+= 0.5;}
      if(nearestFood1.avatar.y<this.avatars[i].y){this.avatars[i].vy-= 0.5;}
      if(nearestFood1.avatar.y>this.avatars[i].y){this.avatars[i].vy+= 0.5;}
      //if(randomInt==4){this.split();}
    }

  }
  

  this.updatePosition=updatePosition;
  //Updating position of every avatar of the player
  function updatePosition(){ 
    for (let i = 0; i < this.avatars.length; i++) {
        this.avatars[i].x += this.avatars[i].vx;
        this.avatars[i].y += this.avatars[i].vy;
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

  //function to remove the players getting eaten.
  function updateCollisionSameMass(otherPlayer){
    avartarToDelete = [];
    for(let i = 0; i < this.avatars.length; i++) {
      for(let j = 0; j < otherPlayer.avatars.length; j++) {
        if(collisionCirclesEatable(this.avatars[i], otherPlayer.avatars[j]) && this.avatars[i].radius >= (otherPlayer.avatars[j].radius+3)){
          this.avatars[i].radius += otherPlayer.avatars[j].radius /10;
          otherPlayer.avatars[j].radius = 0;
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
      if(collisionCirclesEatable(this.avatars[i], someFood.avatar)){
        this.avatars[i].radius += someFood.avatar.radius/5;
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
        return true;
      }
    }
    return false;
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


function createStaticPlayer() {
    console.log("Creating static player");
    let color = getRandomColor();
    let borderColor = getRandomColor();
    let radius = height / 10;
    let x = Math.random() * (worldWidth - 2 * radius) + radius;
    let y = Math.random() * (worldHeight - 2 * radius) + radius;
  
    return new player(
        Math.floor(Math.random() * 0xFFFFFF), // random ID
        new avatar(x, y, radius, color, borderColor),
        null, // no active keys
        true // isBot
    );
  }

  function initPlayers(nb){
    for (let i = 0; i < nb; i++) {
      var staticPlayer = createStaticPlayer();
      players.push(staticPlayer);
    }
  }