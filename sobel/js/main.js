"use strict"

// globals
var canvas;

// various configurations
var options = {
    canvas: {
        id: 'playground',
        width: '600',
        height: '400',
        imageUrl: 'img/phillylove.jpg'
    }
}

function init(){
    // create canvas and add image to it 
    canvas = new Canvas(options.canvas);
    canvas.drawImage(options.canvas.imageUrl, function(){

        // simplify image by making it greyscale
        var greyscale = new Filter({type: 'greyscale'});
        canvas.applyFilter(greyscale);
        
        var gaussian = new Filter({type: 'gaussian'});
        canvas.applyFilter(gaussian);

        // // apply sobel 
        var sobel = new EdgeDetect({kernel: 'sobel', threshold: 100});
        canvas.doEdgeDetect(sobel);
    });
}


init();