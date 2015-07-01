'use strict';

define(['game', 'screen'], function(game, screen) {
	
	var lastUpdate;
	var updateInterval = 1000;

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
			game.draw(screen.getCanvas(), screen.getContext());
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
