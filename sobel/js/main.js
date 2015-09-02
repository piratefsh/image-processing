"use strict"

// globals
var canvas;

// various configurations
var options = {
    canvas: {
        id: 'playground',
        width: '600',
        height: '440',
        imageUrl: 'img/phillylove.jpg'
    }
}

var filters = {
    'greyscale': new Filter({type: 'greyscale'}),
    'gaussian': new Filter({type: 'gaussian'}),
    'sobel': new EdgeDetect({kernel: 'sobel', threshold: 40})
} 

function init(){
    // create canvas and add image to it 
    canvas = new Canvas(options.canvas);
    // pipeImage(canvas);
    pipeVideo(canvas);
}

function filterIt(canvas){
    var timer = {
        start: new Date(), 
        end: null
    }

    // simplify image by making it greyscale
    canvas.applyFilter(filters['greyscale']);
    // canvas.applyFilter(gaussian);
    canvas.doEdgeDetect(filters['sobel'], function(){
        // on edge detection done, display time taken
        timer.end = new Date();
        document.getElementById('filter-time').innerHTML = timer.end - timer.start + ' ms';
    });
}

function pipeImage(c){
    // pipe an image to canvas
    c.drawImage(options.canvas.imageUrl, function(){
        filterIt(c);
    });
}

function pipeVideo(c){
    // pipe an a video stream to canvas
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({
        video: true,
    }, function(stream) {
        var video = document.getElementById('user-video');
        video.src = window.URL.createObjectURL(stream);
        video.addEventListener('play', function() {
           // Every 33 milliseconds copy the video image to the canvas
            setInterval(function() {
                if (video.paused || video.ended){
                    return;
                } 

                c.context.drawImage(video, 0, 0, c.dimensions.width, c.dimensions.height);
                filterIt(c);

            }, 33);
        }, false);
    }, function(e){error(e)})
}

init();