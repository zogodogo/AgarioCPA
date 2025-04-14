var callback = function() {setInterval(on_enter_frame,30);}
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.src = "./scripts/collisions.js";
script.onreadystatechange = callback;
script.onload = callback;
head.appendChild(script);

var worldWidth = 2000;
var worldHeight = 2000;

var mapCenter = { x: 2000, y: 2000 }; // adjust as needed
var mapRadius = 1800; // the playable area


/****************************************************
 * Exercise 1: Collision entre cercle et bordure.   *
 *                                                  *
 * Les dimensions de la fenêtre courrante sont      *
 * accessibles via les attributs suivantes.         *
 *   - main_window.width                            *
 *   - main_window.height                           *
 *                                                  *
 * Les attributs d'un objet circle:Cercle sont:     *
 *   - circle.x                                     *
 *   - circle.y                                     *
 *   - circle.radius                                *
 ****************************************************/

//collisionLeftBorder: Cercle --> boolean
//  revoie true ssi le cercle intersecte la bordure
//  gauche de la fenêtre courrante
function collisionLeftBorder(circle){
/*******************
 * PARTIE A ECRIRE */
    return circle.x-circle.radius<0;
    //return false;
/*******************/
}

//collisionRightBorder: Cercle --> boolean
function collisionRightBorder(circle){
/*******************
 * PARTIE A ECRIRE */
    return circle.x+circle.radius>worldWidth;
    //return false;
/*******************/
}

//collisionTopBorder: Cercle --> boolean
function collisionTopBorder(circle){
/*******************
 * PARTIE A ECRIRE */
    return circle.y-circle.radius<0;
    //return false;
/*******************/
}

//collisionBottomBorder: Cercle --> boolean
function collisionBottomBorder(circle){
/*******************
 * PARTIE A ECRIRE */
    return circle.y+circle.radius>worldHeight;
    //return false;
/*******************/
}

/****************************************************
 * Exercise 2: Collision entre cercles              *
 *                                                  *
 * Les attributs d'un objet circle:Cercle sont:     *
 *   - circle.x                                     *
 *   - circle.y                                     *
 *   - circle.radius                                *
 *                                                  *
 * On peut utiliser les fonctions suivantes.        *
 *   - Math.pow(x,y) renvoie x à la puissance y.    *
 *   - Math.sqrt(x) renvoie la racine carrée de x.  *
 ****************************************************/

//collisionCircles: Cercle * Cercle --> boolean
//  revoie true ssi les deux cercles s'intersectent
function collisionCircles(c1,c2){
/*******************
 * PARTIE A ECRIRE */
    return Math.pow(c1.x-c2.x,2)+Math.pow(c1.y-c2.y,2)
            < Math.pow(c1.radius+c2.radius,2)
    //return false;
/*******************/
}

/****************************************************
 * Exercise 3: Collision cercle - rectangle         *
 *                                                  *
 * Les attributs d'un objet circle:Cercle sont:     *
 *   - circle.x                                     *
 *   - circle.y                                     *
 *   - circle.radius                                *
 *                                                  *
 * Les attributs d'un objet box:Rectangle sont      *
 *   - box.x                                        *
 *   - box.y                                        *
 *   - box.width                                    *
 *   - box.height                                   *
 * Le quatres coins du rectangle sont définis par   *
 *   - (box.x, box.y)                               *
 *   - (box.x+box.width, box.y)                     *
 *   - (box.x, box.y+box.height)                    *
 *   - (box.x+box.width, box.y+box.height)          *
 ****************************************************/

//collisionCircleBox: Cercle * Rectangle --> boolean
//  revoie true ssi les deux objets s'intersectent
function collisionCircleBox(circle,box){
/*******************
 * PARTIE A ECRIRE */
    if(circle.x+circle.radius>box.x && circle.x<box.x){
    if(circle.y<box.y){
        return Math.pow(box.x-circle.x,2)+Math.pow(box.y-circle.y,2)
                < Math.pow(circle.radius,2);
    }
    if(box.y<circle.y && circle.y<box.y+box.height){return true;}
    return Math.pow(box.x-circle.x,2)+Math.pow(box.y+box.height-circle.y,2)
                < Math.pow(circle.radius,2);
    }
    if(circle.x-circle.radius<box.x+box.width && circle.x>box.x+box.width){
    if(circle.y<box.y){
        return Math.pow(box.x+box.width-circle.x,2)+Math.pow(box.y-circle.y,2)
                < Math.pow(circle.radius,2);
    }
    if(box.y<circle.y && circle.y<box.y+box.height){return true;}
    return Math.pow(box.x+box.width-circle.x,2)+Math.pow(box.y+box.height-circle.y,2)
                < Math.pow(circle.radius,2);
    }
    if (circle.x<=box.x && box.x+box.width<=circle.x){
    return circle.y+circle.radius>box.y &&
            circle.y-circle.radius<box.y+box.height;
    }
    return false;
/*******************/
}

/****************************************************
 * The mysterious exercise: Sound effects.          *
 *                                                  *
 ****************************************************/
//onCollision: void --> void
//  cette fonction est appelée lorsqu'une collision est détectectée
function onCollision(){
/*******************
 * PARTIE A ECRIRE */
    //log("bing!");
    var filepath='waterdrip.mp3'; //example
    var audio = new Audio();   
    audio.src = filepath;
    audio.controls = true;
    audio.autoplay = true;
    return;
/*******************/
}

var victory=false;
//onWin: void --> void
//  cette fonction est appelée lorsque la partie est gngnée
function onWin(){
/*******************
 * PARTIE A ECRIRE */
    if(!victory){
    var filepath='fieldofflowers.mp3'; //example
    var audio = new Audio();   
    audio.src = filepath;
    audio.controls = true;
    audio.autoplay = true;
    //log("victory!");
    victory=true;
    }
    return;
/*******************/
}

function log(msg) {
    setTimeout(function() {
    throw new Error(msg);
    }, 0);
}