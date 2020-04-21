//create a new scene
let gameScene = new Phaser.Scene('Game');

//initiate scene parameters
gameScene.init = function() {
  //player stats
  this.playerSpeed = 2.5;
  this.playerLife = 5;

  //enemy speed
  this.enemyMinSpeed = 1.5;
  this.enemyMaxSpeed = 2.3;


  //boundaries
  this.enemyMinY = 80;
  this.enemyMaxY = 280;
}

//load assets
gameScene.preload = function() {
  //load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('enemy', 'assets/dragon.png');
  this.load.image('goal', 'assets/treasure.png');
  this.load.image('life', 'assets/life.png');
  this.load.spritesheet('items', 'assets/items.png', {frameWidth:32, frameHeight:32});

};

//called once after the game preload
gameScene.create = function() {

  //create bg sprite
  let bg = this.add.sprite(0, 0, 'background');
  bg.depth = 0;
  bg.setOrigin(0, 0); // change the origin to the top-left corner

  // create the player
  this.player = this.add.sprite(50, 180, 'player')
  this.player.depth = 2;
  this.player.setScale(0.5);

    //goal
    this.goal =[(this.add.sprite(randomXLocation(),randomYLocation(), 'items', 0)),(this.add.sprite(randomXLocation(),randomYLocation(), 'items', 0))];
    this.goal[0].setScale(1.2);
    this.goal[1].setScale(1.2);
    this.coins=0;
    this.coinsTaken=false;


  // enemy group
  this.enemies = this.add.group({
    key: 'enemy',
    repeat: 4,
    setXY: {
      x: 150,
      y: 100,
      stepX: 95,
      stepY: 20
    }
  });

  //setting Scale for all enemy group
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4)

  //set flipX, and enemySpeed
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
    //flip enemy
    enemy.flipX = true;
    let dir = Math.random() < 0.5 ? 1 : -1;
    let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
    enemy.speed = dir * speed;

  }, this);

  // life icons
  this.life = this.add.group({
    key: 'life',
    repeat: this.playerLife-1,
    setXY: {
      x: 50,
      y: 30,
      stepX: 20,
      stepY: 0
    }
  });
  //setting Scale for life tokens
  Phaser.Actions.ScaleXY(this.life.getChildren(), -0.985, -0.985)

  //printing Coins
  this.scoreText = this.add.text(35, 8, 'Coins: 0', {fontSize: '16px', fill: '#fff'}); // NEW


};

gameScene.update = function() {
let playerRect = this.player.getBounds();

  //check for active input
  let keyObjw = gameScene.input.keyboard.addKey(38);
  let keyObja = gameScene.input.keyboard.addKey(37);
  let keyObjs = gameScene.input.keyboard.addKey(40);
  let keyObjd = gameScene.input.keyboard.addKey(39);

  if (keyObjw.isDown) {
    this.player.y += -this.playerSpeed;
  }
  if (keyObja.isDown) {
    this.player.x += -this.playerSpeed;
  }
  if (keyObjs.isDown) {
    this.player.y += this.playerSpeed;
  }
  if (keyObjd.isDown) {
    this.player.x += this.playerSpeed;
  }

  //////check treasure overlap
  for (var i = 0; i < this.goal.length; i++) {
    let treasureRect = this.goal[i].getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    if (this.coinsTaken==false){
      this.coins +=10;
      this.coinsTaken=true;
}
this.goal[i].x=randomXLocation();
this.goal[i].y=randomYLocation();
      console.log(this.coinsTaken);
    let treasureRect0 = this.goal[0].getBounds();
    let treasureRect1 = this.goal[1].getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(treasureRect0, treasureRect1||treasureRect1, treasureRect0)) {
      this.goal[0].x=randomXLocation();
      this.goal[0].y=randomYLocation();
      }
this.coinsTaken=false;
  }

          this.scoreText.setText(`Coins: ${this.coins}`);

      }

  //////check enemy overlap
  // get enemies
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  //get life
  let life = this.life.getChildren();

  for (let i = 0; i < numEnemies; i++) {

    // enemy movement
    enemies[i].y += enemies[i].speed;

    // check we haven't passed min or max Y
    let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
    let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

    // if we passed the upper or lower limit, reverse and check if dragon needs to turn
    if (conditionUp || conditionDown) {
      enemies[i].speed *= -1;
      if(enemies[i].x<this.player.x)
      {
        enemies[i].flipX = false;
        } else {
        enemies[i].flipX = true;
      }

    }
    //check enemy overlap

    let enemyRect = enemies[i].getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
      //restart the scene
      life[this.playerLife-1].destroy();
      this.playerLife--;
      this.player.x=50;
      this.player.y=180;

      if (this.playerLife<1){
        this.scene.restart();
      }
      return;
    }
  }
}

//set a configuration of the game
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene
};

function randomYLocation(){

  goalY=Math.random() * 280;
      if (goalY<60){
        goalY=60;
      }
      return(goalY);
}

function randomXLocation(){
  goalX=Math.random() * 550;

      if (goalX<350){
        goalX=500;
      }
      return(goalX);
}

function randomYLocation(){

  goalY=Math.random() * 280;
      if (goalY<60){
        goalY=60;
      }
      return(goalY);
}



// create a new game, pass the configuration
let game = new Phaser.Game(config);
