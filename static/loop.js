'use strict';

define(['game', 'screen'], function(game, screen) {
	
	var lastUpdate;
	var updateInterval = 100;

	function loop(now) {
		if (!lastUpdate)
		{
			lastUpdate = now;
		}
		var elapsed = now - lastUpdate;
	
		if (elapsed >= updateInterval) {
			lastUpdate = now;
			game.update(elapsed);
			game.draw(screen);
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
