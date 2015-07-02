"use strict";

define(['jquery', 'block'], function($, Block) {
	
	// TODO: Extract to a lower-level dependency
	function randomInt(min, max) {
		return Math.floor(Math.random() * (max-min) + min);
	}

	var Shape = function(x, y, geometry, color) {
		this.x = x;
		this.y = y;
		this.geometry = geometry;
		this.color = color;
	};
	Shape.prototype.constructor = Shape;
 
	Shape.prototype.copy = function(newX, newY) {
		return new Shape(newX, newY, this.geometry, this.color);
	};
	
	Shape.prototype.asShadow = function() {
		return new Shape(this.x, this.y, this.geometry, Block.ShadowColor);
	}
	
	Shape.prototype.draw = function(canvas, ctx, blockSize) {
		$.each(this.getBlocks(), function(index, block) {
			block.draw(canvas, ctx, blockSize);
		});
	}
	
	function transpose(m) {
		var result = new Array(m[0].length);
        	for (var i = 0; i < m[0].length; i++) {
            	result[i] = new Array(m.length - 1);
            	for (var j = m.length - 1; j > -1; j--) {
                	result[i][j] = m[j][i];
            	}
        	}
        return result;
	}
	
	function reverseRows(m) {
		return m.reverse();
	}

	Shape.prototype.rotate = function() {
		// Each time rotate is called we rotate by 90 degrees
		this.geometry = transpose(reverseRows(this.geometry));
	}

	Shape.prototype.getBlocks = function() {
		var blocks = [];
		
		var height = this.geometry.length;
		var width = this.geometry[0].length;
		
		for (var w = 0; w < width; w++) {
			for (var h = 0; h < height; h++) {
				var worldX = this.x + w;
				var worldY = this.y + h;
				
				if (this.geometry[h][w] === true) {
					blocks.push(new Block(worldX, worldY, false, this.color));
				}
			}
		}
		return blocks;
	};

	var ShapeMaker = function(minx, miny, maxx, maxy) {
		var insertionX = randomInt(minx, maxx);
		var insertionY = randomInt(miny, maxy);
		
		function getColor(val) {
			switch (val) {
				case 1: return "Cyan";
				case 2: return "Yellow";
				case 3: return "HotPink";
				case 4: return "DarkBlue";
				case 5: return "Orange";
				case 6: return "Green";
				case 7: return "Red";
			}
		}
	
		function getShapeGeometry(val) {
			// TODO: Validate input.
			switch (val) {
				case 1:
					// XXXX
					return [[true, true, true, true]];
			
				case 2:
					// XX
					// XX
					return [[true, true], [true, true]];
			
				case 3:
					// XXX
					//  X
					return [
						[true, true, true], 
						[false, true, false]
					];
	
				case 4:
					// XX
					//  XX
					return [[true, true, false], [false, true, true]];
	
				case 5:
					//  XX
					// XX
					return [[false, true, true], [true, true, false]];
			
				case 6:
					// X
					// X
					// XX
					return [[true, false], [true, false], [true, true]];
			
				case 7:
					//  X
					//  X
					// XX
					return [[false, true], [false, true], [true, true]];
			}
		}
		var shapeChooser = randomInt(1, 7);
		return new Shape(insertionX, insertionY, getShapeGeometry(shapeChooser), getColor(shapeChooser));
	};
	
	return {
		make: ShapeMaker
	}
});

