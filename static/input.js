"use strict";

define(['game', 'screen'], function(game, screen) {

	function keypress(e) {		
		switch (e.keyCode) {			
			case 38:
				console.log("Up arrow pressed");
				if (game.gameInProgress) {
					game.command(game.Commands.ROTATE);
					e.preventDefault();
				}
				break;
			
			case 37:
				console.log("Left arrow pressed");
				if (game.gameInProgress) {
					game.command(game.Commands.LEFT);
					e.preventDefault();
				}
				break;
			
			case 39:
				console.log("Right arrow pressed");
				if (game.gameInProgress) {
					game.command(game.Commands.RIGHT);
					e.preventDefault();
				}
				break;
			
			case 40:
				console.log("Down arrow pressed");
				if (game.gameInProgress) {
					game.command(game.Commands.DROP);
					e.preventDefault();
				}
				break;
			
			default:
				console.log("Unknown key was pressed: " + e.keyCode);
		}		
	};

	window.addEventListener("keydown", keypress, false);	
});