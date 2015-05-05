"use strict";

var lastUpdate;
var updateInterval = 1000;

var canvas = document.getElementById("canvas");
console.log("Width: " + canvas.getAttribute("width") + ", Height: " + canvas.getAttribute("height"));
var ctx = canvas.getContext("2d");



function loop(now) {
//	console.log("Entering main loop");
	if (!lastUpdate)
	{
//		console.log("Initializing lastUpdate to " + now);
		lastUpdate = now;
	}
	var elapsed = now - lastUpdate;
//	console.log(elapsed + " since last update; threshold is " + updateInterval);
	
	if (elapsed >= updateInterval) {
//		console.log("Threshold exceeded; triggering update");
		lastUpdate = now;
		// TODO: De-couple the logic delta from the render delta
		Game.update(elapsed);
		Game.draw(canvas, ctx);
	}
	
	requestAnimationFrame(loop); 
}

Game.init({});
window.requestAnimationFrame(loop);



//function update() {
//	console.log("this would do the update");
//}

//function render() {
//	console.log("This would do the rendering");
	
//	var gridWidth = 10;
//	var gridHeight = 20;

//var blockSize = 32;
//var blockRadius = blockSize / 4;

//

//
//function getRandomShape() {
//	// Generate a random number between 1 and 7
//	var shapeChooser = randomInt(1, 7);
//	
//	switch (shapeChooser) {

//	}
//	
//	console.error("Random number generator returned an unexpected value: " + shapeChooser);
//	return null;
//}
//
//var shapes = [	
//]
//
//
//var Point = function(x, y) {
//	this.x = x;
//	this.y = y;
//}
//Point.prototype.constructor = Point;
//
// 
//
//
//var Shape = function(insertionPoint, geometry) {
//	this.insertionPoint = insertionPoint;
//	this.geometry = geometry;
//}
//


//ctx.fillStyle = "rgb(200,0,0)";
//ctx.fillRect (10, 10, 55, 50);
//
//ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
//ctx.fillRect (30, 30, 55, 50);


//
//
//function drawGrid() {
//
//	for (var i = 0; i < gridWidth; i++)
//	{
//		for (var j=0; j < gridHeight; j++)
//		{
//			drawBlock(i*blockSize+1, j*blockSize+1);
//		}
//	}
//	
//}
//drawGrid();
//
//drawBlock(0, 0);
//drawBlock(0, blockSize);
//drawBlock(blockSize, 0);
//drawBlock(blockSize, blockSize);
//drawBlock(blockSize * 2, blockSize);

//}