"use strict";

define(function() {
	
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

	var ShapeMaker = function(minx, miny, maxx, maxy) {
		var insertionX = randomInt(minx, maxx);
		var insertionY = randomInt(miny, maxy);
		var color = "Red"; // TODO: Make random, or pre-determined based on shape geometry.
	
		function getShapeGeometry(type) {
			// TODO: Validate input.
			switch (type) {
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
		return new Shape(insertionX, insertionY, getShapeGeometry(randomInt(1, 7)), color);
	};
	
	return {
		make: ShapeMaker
	}
});

