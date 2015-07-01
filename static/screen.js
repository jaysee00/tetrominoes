"use strict";

define(['jquery'], function($) {
	
	var canvas = $("#canvas"); // TODO: Use a better selector, or even make it configurable?
	if (canvas.length === 0) {
		console.error("Failed to load game canvas");
	}
	else if (canvas.length > 1) {
		console.error("Too many canvases (canvii?)");
	}
	
	return {
		getCanvas: function() {
			return canvas.get()[0];
		},
		getContext: function() {
			return this.getCanvas().getContext("2d");
		}
	}
});