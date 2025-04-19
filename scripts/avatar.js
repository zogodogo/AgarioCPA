//representing the circle
function avatar(x,y,r,c,bc){
    this.x=x;
    this.y=y;
    this.radius=r;
    this.color=c;
    this.bordercolor=bc;
    this.vx = 0; 
    this.vy = 0; 
  
    this.updateCollisionSamePlayer=updateCollisionSamePlayer;
    //function to manage the collision between two avatars of the same player.
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

//initialize the avatar of a bush
function buisson(x,y,r){
  this.x=x;
  this.y=y; 
  this.radius=r;
}

  