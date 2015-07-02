"use strict";

define(function() {
	
	var Block = function(x, y, isEmpty, color) {
		this.x = x;
		this.y = y;
		this._empty = isEmpty;
		this._color = color;
	};
	Block.prototype.constructor = Block;
	Block.EmptyColor = "DarkGray";
	Block.ShadowColor = "Black";
	
	Block.prototype.getColor = function() {
		return this._color;
	};
	
	Block.prototype.clear = function() {
		this._empty = true;
		this._color = Block.EmptyColor;
	};
	
	Block.prototype.fill = function(color) {
		this._empty = false;
		this._color = color;
	};
	
	Block.prototype.isEmpty = function() {
		return this._empty === true;
	};
	
	Block.prototype.isSolid = function() {
		return this._empty === false;
	};
	
	Block.prototype.draw = function(canvas, ctx, blockSize) {
		var blockRadius = blockSize / 4; // HACK
		
		var canvasX = this.x * blockSize;
		var canvasY = this.y * blockSize;
	
		//ctx.createLinearGradient(x0, y0, x1, y1);
		var gradient = ctx.createLinearGradient(canvasX, canvasY+blockSize, canvasX+blockSize, canvasY);
		gradient.addColorStop(0, this.getColor());
		var endGradient = this.isSolid() ? .75 : .25;
		gradient.addColorStop(endGradient,"white");
		ctx.fillStyle=gradient;

		ctx.beginPath()
		// top left (x+y)
		ctx.moveTo(canvasX+blockRadius,canvasY);
	
		// top right (x+blockSize, y)
		ctx.lineTo(canvasX+blockSize-blockRadius, canvasY);
		ctx.quadraticCurveTo(canvasX+blockSize, canvasY, canvasX+blockSize, canvasY+blockRadius);
	
		// bottom right (x+blockSize, y+blockSize)
		ctx.lineTo(canvasX+blockSize, canvasY+blockSize - blockRadius);
		ctx.quadraticCurveTo(canvasX+blockSize, canvasY+blockSize, canvasX+blockSize-blockRadius, canvasY+blockSize);
	
		// bottom left (x, y+blockSize)
		ctx.lineTo(canvasX+blockRadius, canvasY+blockSize);
		ctx.quadraticCurveTo(canvasX, canvasY+blockSize, canvasX, canvasY+blockSize-blockRadius);
	
		// top left (x+y)
		ctx.lineTo(canvasX, canvasY+blockRadius);
		ctx.quadraticCurveTo(canvasX, canvasY, canvasX+blockRadius, canvasY);
	
		ctx.fill();
		ctx.stroke();
	};
	return Block;
});