'use strict';

define(['game'], function(game) {
	
	var lastUpdate;
	var updateInterval = 1000;

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	console.log("Canvas: " + canvas);
	console.log("ctx: " + ctx);

	function loop(now) {
		if (!lastUpdate)
		{
			lastUpdate = now;
		}
		var elapsed = now - lastUpdate;
	
		if (elapsed >= updateInterval) {
			lastUpdate = now;
			// TODO: De-couple the logic delta from the render delta
			game.update(elapsed);
			game.draw(canvas, ctx);
		}	
		requestAnimationFrame(loop); 
	}

	return {
		start: function() {
			game.init({});
			window.requestAnimationFrame(loop);
		}
	}
});
