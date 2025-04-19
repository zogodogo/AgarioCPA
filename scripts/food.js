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

function initFood(nb){
    for(let i=0;i<nb;i++){
      const abs = Math.random() * worldWidth;
      const ord = Math.random() * worldHeight;
      const taille = height/(20+Math.random()*5);
      const color = getRandomColor();
      const borderColor = getRandomColor();
  
      let food1 = new food(new avatar(abs,ord,taille,color,borderColor));
      ressources.push(food1);
    }
  }