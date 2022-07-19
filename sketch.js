const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button;
var button2;
var button3;
var bunny;
var blink,eat,sad;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  backgroundSound = loadSound("sound1.mp3")
  eatingSound = loadSound("eating_sound.mp3")
  ropecuttingSound = loadSound("rope_cut.mp3")
  airwaveSound = loadSound("air.wav")
  sadSound = loadSound("sad.wav")

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  //createCanvas(500,700);
  var isMobile=/iPhone|Android|iPad/i.test(navigator.userAgent)
  if(isMobile){
    w=displayWidth
    h=displayHeight
    createCanvas(w+50,h+50)
  }else{
    w=windowWidth;
    h=windowHeight;
    createCanvas(w,h)
  }
  frameRate(80);

  backgroundSound.play()
  backgroundSound.setVolume(0.01)

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(70,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg("cut_btn.png");
  button2.position(280,70)
  button2.size(50,50)
  button2.mouseClicked(drop2)

  button3 = createImg("cut_btn.png");
  button3.position(380,50)
  button3.size(50,50)
  button3.mouseClicked(drop3)

  balloon = createImg("balloon.png");
  balloon.position(50,250);
  balloon.size(100,80);
  balloon.mouseClicked(blowAir)
  
  muteButton = createImg("mute.png");
  muteButton.position(25,25);
  muteButton.size(25,25);
  muteButton.mouseClicked(mute)

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  bunny = createSprite(300,620,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  rope = new Rope(7,{x:100,y:30});
  rope2 = new Rope(8,{x:300,y:70})
  rope3 = new Rope(8,{x:400,y:50})
  ground = new Ground(w/2,h-20,w,20);
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit)
  fruit_con3 = new Link(rope3,fruit)
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function blowAir(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0})
  airwaveSound.play()
}

function mute(){
  if(backgroundSound.isPlaying()){
    backgroundSound.stop()
  }else{backgroundSound.play()}
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,w,h);
if(fruit!=null){
  image(food,fruit.position.x,fruit.position.y,70,70);
}
  

  rope.show();
  rope2.show()
  rope3.show();
  Engine.update(engine);
  //ground.show();
  if(collision(fruit,bunny)==true){
    eatingSound.play()
    bunny.changeAnimation("eating")
    World.remove(world,fruit)
    fruit=null
  }
  if(collision(fruit,ground.body)==true){
    sadSound.play()
    backgroundSound.stop()
    bunny.changeAnimation("crying")
    Matter.Body.setStatic(fruit,true)
    sadSound.stop()
    gameOver()
  }
   drawSprites();
}

function drop()
{
  ropecuttingSound.play()
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function drop2()
{
  ropecuttingSound.play()
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
}

function drop3()
{
  ropecuttingSound.play()
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null;
}

function collision(body,sprite)
{
  if(body!=null){
    var d=dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y)
    console.log(d)
    if(d<=50){
      return true
    }else{
     return false
    }

  }
}

function gameOver(){
  textSize(30)
  text("Game Over!",200,350)
  
}