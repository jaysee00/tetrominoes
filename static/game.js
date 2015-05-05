/// <reference path="../typings/jquery/jquery.d.ts"/>
var Game = {};

var CONFIG_DEFAULTS = {
	gridWidth: 10,
	gridHeight: 20,
	blockSize: 32,
	blockCurveRadius: 32 / 4,
};

Game.config = CONFIG_DEFAULTS;

// TODO: Hacky! FIXME
var blockSize = CONFIG_DEFAULTS.blockSize;
var blockRadius = CONFIG_DEFAULTS.blockCurveRadius;

Game.init = function(settings) {
	this.config = $.extend(this.config, settings);
	
	this.grid = [];
	for (var w = 0; w < this.config.gridWidth; w++)
	{
		var row = [];
		for (var h = 0; h < this.config.gridHeight; h++)
		{
			row.push({x: w, y: h, empty: true, color: "DarkGray"});
		}
		this.grid.push(row);
	}
	
	console.log("Game initialized");
};

Game.draw = function(canvas, ctx) {
	$.each(this.grid, function(index, row) {
		$.each(row, function(index, box) {
			drawBlock(box.x, box.y, box.color);
		});
	});
	
	// Draw the current shape.
	if (this.currentShape) {
		var x = this.currentShape.x;
		var y = this.currentShape.y;
		
		for (var i = 0; i < this.currentShape.geometry.length; i++)
		{
			var row = this.currentShape.geometry[i];
			for (var j = 0; j < row.length; j++)
			{
				if (row[j] === true) {
					drawBlock(x+j, y+i, this.currentShape.color);
				}
			}
		}
	}
};

function drawBlock(x, y, color) {
	
	x = x * blockSize;
	y = y * blockSize;
	
	//ctx.createLinearGradient(x0, y0, x1, y1);
	var gradient = ctx.createLinearGradient(x, y+blockSize, x+blockSize, y); // TODO: What do these values do?
	gradient.addColorStop(0, color);
	gradient.addColorStop(.66,"white");
	ctx.fillStyle=gradient;

	ctx.beginPath()
	// top left (x+y)
	ctx.moveTo(x+blockRadius,y);
	
	// top right (x+blockSize, y)
	ctx.lineTo(x+blockSize-blockRadius, y);
	ctx.quadraticCurveTo(x+blockSize, y, x+blockSize, y+blockRadius);
	
	// bottom right (x+blockSize, y+blockSize)
	ctx.lineTo(x+blockSize, y+blockSize - blockRadius);
	ctx.quadraticCurveTo(x+blockSize, y+blockSize, x+blockSize-blockRadius, y+blockSize);
	
	// bottom left (x, y+blockSize)
	ctx.lineTo(x+blockRadius, y+blockSize);
	ctx.quadraticCurveTo(x, y+blockSize, x, y+blockSize-blockRadius);
	
	// top left (x+y)
	ctx.lineTo(x, y+blockRadius);
	ctx.quadraticCurveTo(x, y, x+blockRadius, y);
	
	ctx.fill();
	ctx.stroke();
}


Game.update = function(delta) {
	// Bring in a new shape if needed
	if (this.currentShape == null) {
		console.log("new shape!");
		// TODO:insertion point needs to avoid clipping the edge of the shape
		this.currentShape = ShapeMaker(0, 0, 0, 0) // TODO: Make this actually random.	
	}

	// Collision check
	

	this.currentShape.y += 1;
}