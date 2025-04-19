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
  
  function player(id, avatar1, keys,isBot){
    this.id=id;
    this.avatars=[avatar1];
    this.keys=keys;
    this.isBot = isBot;
  
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
  
    this.updatePosition=updatePosition;
    function updatePosition(){ 
      for (let i = 0; i < this.avatars.length; i++) {
          this.avatars[i].x += this.avatars[i].vx;
          this.avatars[i].y += this.avatars[i].vy;
      }
    }
  
    this.pathfindingAlgo = pathfindingAlgo;
    function pathfindingAlgo() {
      // Implement your pathfinding algorithm here
      // For example, you can use A* or Dijkstra's algorithm to find the shortest path to a target
      // This is just a placeholder for demonstration purposes
      console.log("Pathfinding algorithm executed for player " + this.id);
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
          if(collisionCirclesEatable(this.avatars[i], otherPlayer.avatars[j]) && this.avatars[i].radius >= (otherPlayer.avatars[j].radius +3)){
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
        if(collisionCirclesEatable(this.avatars[i], someFood.avatar)){
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