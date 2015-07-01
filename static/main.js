'use strict';

// Define baseUrl for loading other scripts, and special-case handling for jQuery
requirejs.config({
    baseUrl: 'static',
    paths: {
        jquery: '../lib/jquery-2.1.3.min'
    }
});

// Main entry point - kick off the game loop
requirejs(['loop', 'input'], function(loop, input) {
    // `input` just needs to be required onto the page - it doesn't need any other initialization.
    // TODO: Is this a good way of doing it? Maybe it should have an explicit bind method where the 
    // window context is passed in.
    
    loop.start();	
});