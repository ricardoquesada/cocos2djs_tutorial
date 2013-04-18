//
// GameScene class
//
var GameScene = function(){};


GameScene.prototype.onDidLoadFromCCB = function()
{
	// this.ship.setScale(2);
	
	// Forward relevant touch events to controller (this)
    this.rootNode.onTouchesBegan = function( touches, event) {
        this.controller.onTouchesBegan(touches, event);
        return true;
    };

    this.rootNode.onTouchesMoved = function( touches, event) {
        this.controller.onTouchesMoved(touches, event);
        return true;
    };

    this.rootNode.onMouseDown = function( event) {
        this.controller.onMouseDown(event);
        return true;
    };

    // Schedule callback
    this.rootNode.onUpdate = function(dt) {
        this.controller.onUpdate(dt);
    };
    this.rootNode.schedule(this.rootNode.onUpdate);

    this.arrayOfMines = [];
    this.arrayOfCoins = [];

    var size = cc.Director.getInstance().getWinSize();
    
    // Mines
    for( var i=0; i < 20 ; i++) {
        var mine = cc.Sprite.create("mine.png");
        mine.setRotation( Math.random() * 360 );
        mine.setScale( 0.25 + Math.random() );
        mine.setColor( cc.c3b( Math.random() * 255, Math.random() * 255, Math.random() * 255) );
        var x = Math.random() * size.width;
        var y = Math.random() * size.height;
        mine.setPosition( x, y );

        this.rootNode.addChild( mine );
        this.arrayOfMines.push( mine );


        var moveX = (Math.random() * 2 - 1) * 500;
        var moveY = (Math.random() * 2 - 1) * 500;
        var moveAction = cc.MoveBy.create( Math.random()*5, cc.p(moveX, moveY) );
        var back = moveAction.reverse();
        var seq = cc.Sequence.create(moveAction, back );
        var repeat = cc.RepeatForever.create(seq);
        mine.runAction(repeat);
    }

    // Coins
    for( var i=0; i < 20 ; i++) {
        var mine = cc.Sprite.create("coin.png");
        var x = Math.random() * size.width;
        var y = Math.random() * size.height;
        mine.setPosition( x, y );

        this.rootNode.addChild( mine );
        this.arrayOfCoins.push( mine );
    }


    this.lives = 5;
    this.score = 0;
};

GameScene.prototype.onUpdate = function(dt)
{   
    var shipBB = this.ship.getBoundingBox();

    var dirtyLives = false;
    var dirtyScore = false;

    // check collision with mines
    for( var i=0; i < this.arrayOfMines.length; i++ ) {
        var mine = this.arrayOfMines[i];
        var mineBB = mine.getBoundingBox();

        if( cc.rectIntersectsRect( shipBB, mineBB ) ) {

            this.lives--;

            cc.log(" COLLISION !!!!  Lives left: " + this.lives);

            cc.AudioEngine.getInstance().playEffect("explosion.wav");

            // remove the mine
            this.arrayOfMines.splice(i,1);

            var fadeout = cc.FadeOut.create(0.25);
            var rotate = cc.RotateBy.create(0.25, 720);
            var call = cc.CallFunc.create( mine.removeFromParent );
            var seq = cc.Sequence.create( 
                cc.Spawn.create(fadeout, rotate),
                call );

            mine.runAction(seq);

            dirtyLives = true;
        }
    }

    // check collision with coins
    for( var i=0; i < this.arrayOfCoins.length; i++ ) {
        var coin = this.arrayOfCoins[i];
        var coinBB = coin.getBoundingBox();

        if( cc.rectIntersectsRect( shipBB, coinBB ) ) {

            this.score += 100;

            cc.AudioEngine.getInstance().playEffect("coin.wav");

            // remove the coin
            this.arrayOfCoins.splice(i,1);

            var fadeout = cc.FadeOut.create(0.25);
            var rotate = cc.ScaleBy.create(0.25, 4);
            var call = cc.CallFunc.create( coin.removeFromParent );
            var seq = cc.Sequence.create( 
                cc.Spawn.create(fadeout, rotate),
                call );

            coin.runAction(seq);

            dirtyScore  = true;
        }
    }

    if( dirtyLives ) {
        var scaleup = cc.ScaleTo.create(0.1, 1.1);
        var scaledown = cc.ScaleTo.create(0.1, 1);
        var seq = cc.Sequence.create( scaleup, scaledown );

        this.lblLives.runAction( seq );
        this.lblLives.setString("Lives: " + this.lives);


        if( this.lives === 0 ) {
            var size = cc.Director.getInstance().getWinSize();
            var label = cc.LabelTTF.create("GAME OVER", "Marker Felt", 48);
            this.rootNode.addChild( label );
            label.setPosition( size.width/2, size.height/2);
        }
    }

    if( dirtyScore ) {
        var scaleup = cc.ScaleTo.create(0.1, 1.1);
        var scaledown = cc.ScaleTo.create(0.1, 1);
        var seq = cc.Sequence.create( scaleup, scaledown );

        this.lblScore.runAction( seq );
        this.lblScore.setString("Score: " + this.score);
    }

};

GameScene.prototype.onPressBack = function()
{	
	var scene = cc.BuilderReader.loadAsScene("MainScene.ccbi");
	cc.Director.getInstance().replaceScene(scene);
};

GameScene.prototype.onTouchesBegan = function( touches, event) {
    // cc.log(touches);
    // var touch = touches[0];
    // var pos = touch.getLocation();

    // this.ship.setPosition(pos);
	return true;
};

GameScene.prototype.onTouchesMoved = function (touches, event) {
    var touch = touches[0];
    var delta = touch.getDelta();

    var diff = cc.pAdd(delta, this.ship.getPosition());
    this.ship.setPosition(diff);
};


GameScene.prototype.onMouseDown = function( event) {
	return true;
};
