//initialize a bush given his avatar.
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