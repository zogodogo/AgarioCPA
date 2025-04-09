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
var width=main_window.width;
var height=main_window.height;
var friction=0.98;
var red = new player(0x51E77E,
                    new avatar(3*width/4,height/2,height/6,"#FF0000","#FF2400"),
                    new keys(0x25,0x27,0x26,0x28)
                    );
var blue = new player(0xED1C7E,
                    new avatar(width/4,height/2,height/8,"#0000FF","#0066FF"),
                    new keys(0x51,0x44,0x5A,0x53)
                    );
/*var black = new player(0xBADDAD,
                    new avatar(width/2,height/2,height/4.5,"#000000","#505050"),
                    new keys(0x00,0x00,0x00,0x00)
                    );*/
var goal = {x:width-blue.avatar.radius,y:height/3,
            width:width-blue.avatar.radius/2,height:height/3};

  
var p1 = new food(
                new avatar(Math.random() * width, Math.random() * height,height/20,"#0002AA","#0066FF"),
                );
var p2 = new food(
                new avatar(Math.random() * width, Math.random() * height,height/20,"#0002AA","#505050"),
                );

var players = new Array(red, blue);
var ressources = new Array(p1, p2);

//--------------------------//
// END OF CONFIGURATIONS    //
//--------------------------//

function food(avatar){
    this.avatar = avatar;

    this.draw=draw;
    function draw(){
        context.beginPath();
        var g=context.createRadialGradient(this.avatar.x,this.avatar.y,this.avatar.radius*0.98,this.avatar.x,this.avatar.y,this.avatar.radius);
        g.addColorStop(0,this.avatar.color);
        g.addColorStop(1,this.avatar.bordercolor);
        context.fillStyle=g;
        context.arc(this.avatar.x,this.avatar.y,
                    this.avatar.radius,0,Math.PI*2,true);
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
    if (collisionLeftBorder(avatar)){ this.vx*=-1; this.avatar.x=this.avatar.radius; return true; }
    if (collisionRightBorder(avatar)){ this.vx*=-1; this.avatar.x=width-this.avatar.radius; return true; }
    if (collisionTopBorder(avatar)){ this.vy*=-1; this.avatar.y=this.avatar.radius; return true; }
    if (collisionBottomBorder(avatar)){ this.vy*=-1; this.avatar.y=height-this.avatar.radius; return true; }
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

  this.updatePosition=updatePosition;
  function updatePosition(){ this.avatar.x+=this.vx; this.avatar.y+=this.vy; }
 
  this.draw=draw;
  function draw(){
    context.beginPath();
    var g=context.createRadialGradient(this.avatar.x,this.avatar.y,this.avatar.radius*0.98,this.avatar.x,this.avatar.y,this.avatar.radius);
    g.addColorStop(0,this.avatar.color);
    g.addColorStop(1,this.avatar.bordercolor);
    context.fillStyle=g;
    context.arc(this.avatar.x,this.avatar.y,
                this.avatar.radius,0,Math.PI*2,true);
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



function on_enter_frame(){

  
    var tmp = []
    for(var j=0;j<players.length;j++){
        var collisionCheck=false;
        for (var i=0;i<players.length;i++) {
            players[j].updateCollisionBorder();
            if(i!=j){
                players[i].updateFriction();
                players[i].updateCommands(); 
                
                collisionCheck=players[i].updateCollisionSameMass(players[j]);
            }
        }
        
        if(collisionCheck){
            console.log("azertgyhujkl");
            console.log(tmp);
            tmp.push(j);
        }
    }

    tmp.sort(function(a, b) { return b - a; });  // Tri décroissant
    for( var k=0; k<tmp.length; k++){
        players.splice(tmp[k],1);
    }
    console.log(players);
    
    
    context.clearRect(0,0,width,height);
    context.fillStyle=blue.avatar.color;
    context.fillRect(goal.x,goal.y,goal.width,goal.height);
 
    for (var i=players.length-1;i>-1;i--) {
      players[i].updatePosition();
      players[i].draw();
    }
    for (var i=ressources.length-1;i>-1;i--) {
        ressources[i].draw();
      }

}

