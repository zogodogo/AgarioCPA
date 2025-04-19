//  return true if the circle given is hitting the left border of the map. 
function collisionLeftBorder(circle){
    return circle.x-circle.radius<0;
}

//return true if the circle given is hitting the right border of the map.
function collisionRightBorder(circle){
    return circle.x+circle.radius>worldWidth;
}

//return true if the circle given is hitting the top border of the map.
function collisionTopBorder(circle){
    return circle.y-circle.radius<0;
}

//return true if the circle given is hitting the bottom border of the map.
function collisionBottomBorder(circle){
    return circle.y+circle.radius>worldHeight;
}

//return true if the bigger circle between c1 and c2 can eat, and eat the other one.
function collisionCirclesEatable(c1,c2){
    return Math.pow(c1.x-c2.x,2)+Math.pow(c1.y-c2.y,2)
            < Math.pow(c1.radius+c2.radius,2) - Math.pow(c1.radius+c2.radius,2)/3;
}

//return true if the two circles are hitting each other.
function collisionCircles(c1,c2){
    return Math.pow(c1.x-c2.x,2)+Math.pow(c1.y-c2.y,2)
            < Math.pow(c1.radius+c2.radius,2);
}

/** Gestion du son : exemple : 
 * 
 * var filepath='waterdrip.mp3'; //example
    var audio = new Audio();   
    audio.src = filepath;
    audio.controls = true;
    audio.autoplay = true;
    return;
 */
