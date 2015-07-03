"use strict";

define(['jquery', 'block'], function($, Block) {

	var buildGrid = function(maxWidth, maxHeight) {	
		var grid = [];
		for (var h = 0; h < maxHeight; h++)
		{
			var row = [];
			for (var w = 0; w < maxWidth; w++)
			{
				row.push(new Block(w, h, true, Block.EmptyColor));
			}
			grid.push(row);
		}
		return grid;
	}

	var Grid = function(width, height) {
			this.grid = buildGrid(width, height);
			this.width = width;
			this.height = height;
	};
	
	Grid.prototype.forEachRow = function(callback) {
		$.each(this.grid, function(index, row) {
			callback(index, row);
		});	
	};
	
	Grid.prototype.forEach = function(callback) {
		$.each(this.grid, function(index, row) {
			$.each(row, function(index, block) {
				callback(block);
			});
		});
	};
	
	Grid.prototype.get = function(x, y) {
		return this.grid[y][x];
	};
	
	Grid.prototype.update = function(block) {
		this.grid[block.y][block.x] = block;	
	};
	
	Grid.prototype.clearRow = function(row) {
		console.log("Clearing row " + row);		
		// Delete the row
		this.grid.splice(row, 1);
		
		// Everything 'above' the deleted row gets it's Y value incremented by 1
		for (var y = 0; y < row; y++) {
			var r = this.grid[y];
			for (var x = 0; x < this.width; x++) {
				var oldValue = r[x].y;
				var newValue = r[x].y + 1;
				console.log("Updating the block at (" + x + "," + y + ") to have a y value of " + newValue + " from " + oldValue);
				r[x].y += 1;	
			}
		}
		
		// Add a new empty row to the beginning of the array, essentially moving every other row down one element.
		var newRow = [];
		for (var w = 0; w < this.width; w++)
		{
			newRow.push(new Block(w, 0, true, Block.EmptyColor));
		}
		this.grid.unshift(newRow);
	};
	
	return Grid;
});
