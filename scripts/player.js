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
        new keys(0x00, 0x00, 0x00, 0x00), // no active keys
        true // isBot
    );
  }

  function initPlayers(nb){
    for (let i = 0; i < nb; i++) {
      var staticPlayer = createStaticPlayer();
      players.push(staticPlayer);
    }
  }