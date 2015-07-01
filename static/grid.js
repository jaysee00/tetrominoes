"use strict";

define(['jquery', 'block'], function($, Block) {

	var buildGrid = function(maxWidth, maxHeight) {	
		var grid = [];
		for (var w = 0; w < maxWidth; w++)
		{
			var row = [];
			for (var h = 0; h < maxHeight; h++)
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
	
	Grid.prototype.forEach = function(callback) {
		$.each(this.grid, function(index, row) {
			$.each(row, function(index, block) {
				callback(block);
			});
		});
	};
	
	Grid.prototype.get = function(x, y) {
		return this.grid[x][y];
	};
	
	Grid.prototype.update = function(block) {
		this.grid[block.x][block.y] = block;	
	};
	
	return Grid;
});
