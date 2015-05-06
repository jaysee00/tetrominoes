/// <reference path="../typings/jquery/jquery.d.ts"/>

"use strict";

define(['shape', 'jquery'], function(shape, $) {
	var Game = {};

	var CONFIG_DEFAULTS = {
		gridWidth: 10,
		gridHeight: 20,
		blockSize: 32,
		blockCurveRadius: 32 / 4,
	};

	Game.config = CONFIG_DEFAULTS;
	Game.gameInProgress = false;

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
		Game.gameInProgress = true;
	};

	Game.draw = function(canvas, ctx) {
		$.each(this.grid, function(index, row) {
			$.each(row, function(index, box) {
				drawBlock(box.x, box.y, box.color, canvas, ctx, !box.empty);
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
						drawBlock(x+j, y+i, this.currentShape.color, canvas, ctx, true);
					}
					else
					{
						// HACK
						drawBlock(x+j, y+i, "Black", canvas, ctx, false);
					}
				}
			}
		}
	};

	function drawBlock(x, y, color, canvas, ctx, solid) {
		x = x * blockSize;
		y = y * blockSize;
	
		//ctx.createLinearGradient(x0, y0, x1, y1);
		var gradient = ctx.createLinearGradient(x, y+blockSize, x+blockSize, y);
		gradient.addColorStop(0, color);
		var endGradient = solid ? .66 : .33
		gradient.addColorStop(endGradient,"white");
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

	function convertToBlocks(shape, grid) {
		var height = shape.geometry.length;
		var width = shape.geometry[0].length;
		
		for (var w = 0; w < width; w++) {
			for (var h = 0; h < height; h++) {
				var worldX = shape.x + w;
				var worldY = shape.y + h;
				
				if (shape.geometry[h][w] === true) {
					// Turn the grid box at this point into a solid guy with the same color
					grid[worldX][worldY].empty = false;
					grid[worldX][worldY].color = shape.color;
				}
			}
		}
	}

	function checkForCollisions(shape, grid) {
		console.log("Checking for collisions on shape @ {" + shape.x + ", " + shape.y + "}");
	
		// - for each column the shape inhabits, find the lowest point of the shape in that column.
		// - for each lowest point in each column, check the point immediately below it; if it's not empty, then trigger a collision.
		var height = shape.geometry.length;
		// NOTE: This code currently relies on the shape geometry array defining an equal number of blocks per row (ie. is rectangular).
		// This is not enforced, if the shape construction algorithm is changed so that this isn't invariant no longer holds, this code 
		// will break.
		var width = shape.geometry[0].length;
		console.log("The shape is " + width + " x " + height);
		
		for (var w = 0; w < width; w++)
		{
			// Check for a collision in each column of the shape.
			// Check the lowest row first
			for (var h = height-1; h >= 0; h--) {
					
				var worldX = shape.x + w;
				var worldY = shape.y + h;
				
				console.log("testing box at shape co-ord {" + w + "," + h + "}, world co-ord {" + worldX + "," + worldY + "}");
				
				if (shape.geometry[h][w] === true) {
					console.log("It's a solid part of the shape");
					// Found the lowest point of the shape in this column. Check the block below it to see if it's empty or not
					// or if the shape is already at the bottom row
					if (grid[0].length == shape.y + h + 1) {
						console.log("Reached the bottom of the grid");
						return true;
					}
						
					if (grid[worldX][worldY+1].empty === false) {
						// Found it.
						console.log("Found collision point @ {" + worldX + ", " + worldY + "}");
						return true;
					}
					console.log("But it's in the clear");						  
				}
				else {
					console.log("it's not a solid part of the shape");
				}
			}
		}
		console.log("No collisions");
		return false;		
	}

	Game.update = function(delta) {
		if (!this.gameInProgress) {
			console.log("Game not in progress - not updating");
			return;
		}
		
		// Bring in a new shape if needed
		if (this.currentShape == null) {
			console.log("new shape!");
			// TODO:insertion point needs to avoid clipping the edge of the shape
			this.currentShape = shape.make(0, 0, 0, 0); // TODO: Make the insertion point random
			if (checkForCollisions(this.currentShape, this.grid)) {
				alert("Game ober!");
				this.gameInProgress = false;
			}	
		}
		else
		{
			if (checkForCollisions(this.currentShape, this.grid)) {
				
				// Turn the current shape into solid blocks!
				convertToBlocks(this.currentShape, this.grid);
				
				this.currentShape = shape.make(0, 0, 0, 0); // TODO: Make the insertion point random
				if (checkForCollisions(this.currentShape, this.grid)) {
					alert("Game ober!");
					this.gameInProgress = false;
				}					
			}
			else {
				// No collision - continue with update.
				console.log("no collisions - updating");
				this.currentShape.y += 1;
			}
		}
	}	
	
	return Game;
});
