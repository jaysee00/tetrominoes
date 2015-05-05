'use strict';

// Define baseUrl for loading other scripts, and special-case handling for jQuery
requirejs.config({
    baseUrl: 'static',
    paths: {
        jquery: '../lib/jquery-2.1.3.min'
    }
});

// Main entry point - kick off the game loop
requirejs(['loop'], function(loop) {
    loop.start();	
});