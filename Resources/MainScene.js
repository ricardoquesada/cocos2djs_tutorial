//
// MainScene class
//
var MainScene = function(){};

// Create callback for button
MainScene.prototype.onPressButton = function()
{	
	var scale = cc.ScaleBy.create( 1, 4 );
	var move = cc.MoveBy.create( 2, cc.p(200,200));
	
	var seq = cc.Sequence.create( scale, move );
	var back_seq = seq.reverse();
	
	var new_seq = cc.Sequence.create( seq, back_seq );
	
	this.helloLabel.runAction( cc.RepeatForever.create(new_seq) );
	
	
    // Rotate the label when the button is pressed
//    this.helloLabel.runAction( 
//    cc.RotateBy.create(3, 10360) );

//	var action3 = cc.SkewBy.create(2,0,90);
//	this.label2.runAction( action3 );
//	
//	cc.log("hello");
//
//	this.rootNode.animationManager.runAnimationsForSequenceNamed("Outro");
};


MainScene.prototype.onPressStart = function()
{	
	var scene = cc.BuilderReader.loadAsScene("GameScene.ccbi");
	cc.Director.getInstance().replaceScene(scene);
};