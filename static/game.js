/// <reference path="../typings/jquery/jquery.d.ts"/>

"use strict";

define(['shape', 'grid', 'jquery'], function(shape, Grid, $) {
	var Game = {};
	
	Game.Commands = {
		ROTATE: {value: "0", name: "rotate"},
		LEFT: {value: "1", name:"left"},
		RIGHT: {value: "2", name: "right"},
		DROP: {value: "3", name: "drop"},
	};

	var CONFIG_DEFAULTS = {
		gridWidth: 10,
		gridHeight: 20,
		blockSize: 24,
		blockCurveRadius: 24 / 4,
	};

	Game.config = CONFIG_DEFAULTS;
	Game.gameInProgress = false;

	// TODO: Hacky! FIXME
	var blockSize = CONFIG_DEFAULTS.blockSize;

	Game.init = function(settings) {
		this.config = $.extend(this.config, settings);	
		this.grid = new Grid(this.config.gridWidth, this.config.gridHeight);
	
		console.log("Game initialized");
		Game.gameInProgress = true;
	};

	Game.draw = function(canvas, ctx) {
		this.grid.forEach(function(block) {
			block.draw(canvas, ctx, blockSize);
		});
		
		if (this.currentShape) {		
			this.currentShape.draw(canvas, ctx, blockSize);
		}
	};

	function checkForCollisionsTwo(shape, grid) {
		// Check each block for collissions
		var collided = false;
		$.each(shape.getBlocks(), function(index, block) {
			if (block.isSolid()) {
				// Escaped game bounds?
				if (block.x >= grid.width) {
					console.log("Shape block @ {" + block.x + ", " + block.y + "} exceeds the right boundary");
					collided = true;
				} else if (block.x < 0) {
					console.log("Shape block @ {" + block.x + ", " + block.y + "} exceeds the left boundary");
					collided = true;
				} else if (block.y >= grid.height) {
					console.log("Shape block @ {" + block.x + ", " + block.y + "} exceeds the bottom boundary");
					collided = true;
				} else if (block.y < 0) {
					console.log("Shape block @ {" + block.x + ", " + block.y + "} exceeds the top boundary");
					collided = true;
				}
				// Collides with another solid block?
				else if (grid.get(block.x, block.y).isSolid()) {
					console.log("Shape block @ {" + block.x + ", " + block.y + "} collides with another block");
					collided = true;
				}
			}
		});
		return collided;
	}
	
	Game.command = function(command) {
		console.log("New Command: " + command);
		if (command === Game.Commands.LEFT) {				
			var newShape = this.currentShape.copy(this.currentShape.x - 1, this.currentShape.y);
			if (!checkForCollisionsTwo(newShape, this.grid)) {
				this.currentShape = newShape;
			}
			else 
			{
				console.log("Move LEFT would have caused a collision. Not allowing.");
			}
		}
		else if (command === Game.Commands.RIGHT) {
			var newShape = this.currentShape.copy(this.currentShape.x + 1, this.currentShape.y);
			if (!checkForCollisionsTwo(newShape, this.grid)) {
				this.currentShape = newShape	
			}
			else
			{
				console.log("Move RIGHT would have caused a collision. Not allowing.");						
			}
		}
		else if (command === Game.Commands.ROTATE) {
			console.log("ROTATE was issued");
		}
		else if (command === Game.Commands.DROP) {
			console.log("DROP was issued");
		}
	}

	var timeSinceLastMove = 0;
	var moveThreshold = 1000; // TODO: Configurable? Slowly increase?

	Game.update = function(delta) {
		if (!this.gameInProgress) {
			console.log("Game not in progress - not updating");
			return;
		}
		
		// Bring in a new shape if needed
		if (this.currentShape == null) {
			console.log("new shape!");
			timeSinceLastMove = 0;
			// TODO:insertion point needs to avoid clipping the edge of the shape
			this.currentShape = shape.make(0, 0, 0, 0); // TODO: Make the insertion point random
			if (checkForCollisionsTwo(this.currentShape, this.grid)) {
				alert("Game ober!");
				this.gameInProgress = false;
			}	
		}
		
		
		
		timeSinceLastMove += delta;
		
		console.log("Elapsed: " + delta);
		console.log("Time since last move: " + timeSinceLastMove);
		
		if (timeSinceLastMove >= moveThreshold) {
			timeSinceLastMove = 0;
			
			var newShape2 = this.currentShape.copy(this.currentShape.x, this.currentShape.y + 1);
			var gridzy = this.grid;
			if (checkForCollisionsTwo(newShape2, this.grid)) {
				// Turn the current shape into solid blocks!
				$.each(this.currentShape.getBlocks(), function(index, block) {
					gridzy.update(block);		
				});
			
				this.currentShape = shape.make(0, 0, 0, 0); // TODO: Make the insertion point random
				if (checkForCollisionsTwo(this.currentShape, this.grid)) {
					alert("Game ober!");
					this.gameInProgress = false;
				}					
			}
			else {
				// No collision - continue with update.
				this.currentShape = newShape2;
			}
		}
	}	
	
	return Game;
});
