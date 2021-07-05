var astimg;
var canvas;
var winimg;
var playerimg;
var backgroundimg;
var restartimg;
var covidimg;
var fuelimg;
var gasimg;
var corimg;
var player;

var score = 1000;


var lives = 3;

var fuelCount = 60;

var gameState = "play";

var gasmeter = 1;

var count = 0;
  

function preload(){
  
  astimg = loadImage("ast.png");
  winimg = loadImage("youwin.png");
  playerimg = loadImage("player.png");
  backgroundimg= loadImage("background.png");
  restartimg = loadImage("restart.png");
  covidimg = loadImage("planetCovid.png");
  fuelimg = loadImage("fuel.png");
  gasimg = loadImage("gas.png");
  corimg = loadImage("cor.png");
  
  
}

function setup()
{
  canvas = createCanvas(windowWidth,windowHeight);
  
 backgroundsprite  = createSprite(width/2,height/2, width, height);

  restartButton = createSprite(width/2,height/2);
restartButton.visible = false;

 gameState = "play"

planet = createSprite(width/2,height/2 - 250,50,50);
planet.visible = false;

player = createSprite(width/2,height/2 + 300 ,20,20);
player.addImage(playerimg);
player.scale = 0.2;

backgroundsprite.addImage(backgroundimg);
backgroundsprite.scale = 8;

restartButton.addImage(restartimg);
restartButton.scale = 0.5;

 asteriodsgroup = createGroup();
 gasgroup = createGroup();
 fuelgroup = createGroup();
 coraniansgroup = createGroup();



}

function draw(){
  
 
   background("darkblue");
 edges =  createEdgeSprites();
   player.bounceOff(edges);
   
   if( score < 0 || lives === 0 || lives <0){
     gameState = "end"
   }
  
  if(gameState === "play"){
    count = count+1;
    restartimg.visible = false;
    if(keyDown("w" || touches.length >0)){
   // player.y = player.y - 4
   backgroundsprite.y = backgroundsprite.y + 4;
  }
 console.log(backgroundsprite.y);
 if(backgroundsprite.y>250){
   backgroundsprite.y = backgroundsprite.height/2;
 }
  player.x = World.mouseX;

  touchObjs = {};
  touchList = [];

  document.addEventListener("touchmove", moveTouch);

  touchList.forEach(
    function(t){
      if (t.play){
        if( t.cursor == t.points.length ){
          t.cursor = 0;
        }
        var pt = t.points[t.cursor];
        
        t.cursor += 1;
      } else {
        var pt = t.points[t.points.length - 1];
        player.x = pt.x
      }
    }
  );
  
  spawnAsteriods();
  
  spawnFuel();
  
  spawnGas();
  
   spawnCoranians();
   
   spawnPlanet();
   
   
   
    if(asteriodsgroup.isTouching(player)){
    score = score - 100;
    asteriodsgroup.destroyEach();
  }
  
  if(coraniansgroup.isTouching(player)){
    lives = lives - 1;
    coraniansgroup.destroyEach();
  }
  
  if(fuelgroup.isTouching(player)){
    fuelCount = fuelCount + 30;
    score = score + 150;
    fuelgroup.destroyEach();
  }
  
  if(gasgroup.isTouching(player)){
   
    score = score + 150;
    gasgroup.destroyEach();
  }
  
  var delay = World.seconds;
  
  if(delay %5 === 0)
  
  fuelCount = fuelCount -1;
  
  if(fuelCount < 0 || fuelCount === 0 ){
    gameState = "end";
  }
  }
  

  
  
  

  
  drawSprites();
  
  
  
  fill("white");
  textSize(20);
  text("score: " +score, width-900, 25);
  
  fill("white");
  textSize(20);
  text("lives: " +lives,width - 700, 25);
  
  fill("white");
  textSize(20);
  text("Fuel: " +fuelCount,width -500, 25);
  
  
 
  if(gameState === "end"){
 
  text("THE END", width/2 , height/2-200);
   
    
  }
  

if(gameState === "win"){
  
  backgroundsprite.y = 250;
  backgroundsprite.addImage("youwin");
  backgroundsprite.scale = 100;

 


  
  
}
  
}


function spawnPlanet (){
   if(count > 100){
  planet.visible = true;
   planet.addImage(covidimg);
   planet.scale = 0.3
   if(score > 1200){
    planet.velocityY = + 2
  } 
  if(player.isTouching(planet)){
   planet.addImage(winimg);
    planet.velocityY = 0;
    gameState = "win";
    planet.scale = 2;

  }
 
 }
  
  
}

function spawnAsteriods(){
  if (World.frameCount % 60 ===0) {
  var rand1 = Math.round(random(1, width));
   var asteriods = createSprite(rand1,1,20,20);
     asteriods.velocityY = + 8
     asteriods.addImage(astimg);
     asteriods.scale = 0.3
     asteriods.lifetime = 1000;
   asteriodsgroup.add(asteriods);
       
  }
}

function spawnFuel(){
   if (World.frameCount % 87 ===0) {
 var rand1 = Math.round(random(1, width));
   var fuel = createSprite(rand1,1,20,20);
     fuel.velocityY = +8
     fuel.addImage(fuelimg);
     fuel.scale = 0.3
     fuel.lifetime = 1000;
     fuelgroup.add(fuel);
  }
}

function spawnGas(){
  if (World.frameCount % 100 ===0){
    var rand1 = Math.round(random(1, width));
    var gas = createSprite(rand1, 1,20,20);
    gas.velocityY = + 8
    gas.addImage(gasimg);
    gas.scale = 0.3
    gas.lifetime = 1000;
    gasgroup.add(gas)
  }
}

function spawnCoranians(){
    if (World.frameCount % 75 ===0) {
 var rand1 = Math.round(random(1, width));
   var coranians = createSprite(rand1,1,20,20);
     coranians.velocityY = + 8
     coranians.addImage(corimg);
     coranians.scale = 0.15
     coranians.lifetime = 1000;
     coraniansgroup.add(coranians)
  }
}

function moveTouch(e){
  e.preventDefault();
  each( e.changedTouches,
    function(t){
      var id = t.identifier;
      var tch = touchObjs[id];
      if( tch ){
        tch.points.push({
          x: t.pageX,
          y: t.pageY
        });
      }
    }
  );
}