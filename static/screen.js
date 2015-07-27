"use strict";

define(['jquery'], function($) {
	
	var canvas = $("#canvas"); // TODO: Use a better selector, or even make it configurable?
	if (canvas.length === 0) {
		console.error("Failed to load game canvas");
	}
	else if (canvas.length > 1) {
		console.error("Too many canvases (canvii?)");
	}
	
    var score = $("#score");
    var lines = $("#lines");
    var level = $("#level");
    
	return {
		getCanvas: function() {
			return canvas.get()[0];
		},
		getContext: function() {
			return this.getCanvas().getContext("2d");
		},
        getScoreBox: function() {
            return score;
        },
        getLevelBox: function() {
            return level;
        },
        getLinesBox: function() {
            return lines;
        }
	}
});