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
			
			// Draw a shadow of this shape where it would drop is the drop command was issued.
			// Draw it before the actual shape itself so that if there's overlap, the shape wins.
			var shadow = this.findDropLocation(this.currentShape).asShadow();
			shadow.draw(canvas, ctx, blockSize);
							
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
					collided = true;
				} else if (block.x < 0) {
					collided = true;
				} else if (block.y >= grid.height) {
					collided = true;
				} else if (block.y < 0) {
					collided = true;
				}
				// Collides with another solid block?
				else if (grid.get(block.x, block.y).isSolid()) {
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
			this.currentShape.rotate();
			console.log("ROTATE was issued");
		}
		else if (command === Game.Commands.DROP) {
			this.currentShape = this.findDropLocation(this.currentShape);
			console.log("Done dropping!");
		}
	}

	Game.findDropLocation = function(initialShape) {
		var shape = initialShape;
		while (!checkForCollisionsTwo(shape.copy(shape.x, shape.y+1), this.grid)) {
				shape = shape.copy(shape.x, shape.y + 1);
		}
		return shape;
	}

	var timeSinceLastMove = 0;
	var moveThreshold = 1000; // TODO: Configurable? Slowly increase?

	Game.insertNewShape = function() {
		console.log("new shape!");
		timeSinceLastMove = 0;
		// TODO:insertion point needs to avoid clipping the edge of the shape
		this.currentShape = shape.make(0, 0, 0, 0);
		if (checkForCollisionsTwo(this.currentShape, this.grid)) {
			alert("Game ober!");
			this.gameInProgress = false;
		}	
	}
	
	Game.freezeShape = function(shape) {
		console.log("Freezing shape!");
		// Turn the  shape into solid blocks!
		var gridzy = this.grid;
		$.each(this.currentShape.getBlocks(), function(index, block) {
			gridzy.update(block);		
		});
		
		// Check for any rows that can be removed
		var rowsToDelete = [];
		gridzy.forEachRow(function(index, row) {
			var removeThisRow = true;
			for (var i = 0; i < row.length; i++) {
				var block = row[i];
				if (block.isEmpty()) {
					removeThisRow = false;
				}
			}
			if (removeThisRow) {
				console.log("Row " + index + " is full!");
				rowsToDelete.push(index);
			}
			else
			{
				console.log("Row " + index + " is not full");
			}
		});
		
		$.each(rowsToDelete, function(index, row) {
			gridzy.clearRow(row);
		});
	}

	Game.update = function(delta) {
		if (!this.gameInProgress) {
			console.log("Game not in progress - not updating");
			return;
		}
		
		// Bring in a new shape if needed
		if (this.currentShape == null) {
			this.insertNewShape();
		}
		timeSinceLastMove += delta;
		
		if (timeSinceLastMove >= moveThreshold) {
			timeSinceLastMove = 0;
			
			var newShape2 = this.currentShape.copy(this.currentShape.x, this.currentShape.y + 1);
			var gridzy = this.grid;
			if (checkForCollisionsTwo(newShape2, this.grid)) {
				this.freezeShape(newShape2);
				this.insertNewShape();
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
