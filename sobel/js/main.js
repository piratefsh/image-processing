"use strict"

// globals
var canvas;

// various configurations
var options = {
    canvas: {
        id: 'playground',
        width: 400,//600/2,
        height: 400,///2,
        imageUrl: 'img/circles-squares.jpg'
    }
}
var timer = {
    start: new Date(), 
    end: null
}

var filters = {
    'greyscale': new Filter({type: 'greyscale'}),
    'gaussian': new Filter({type: 'gaussian'}),
    'sobel': new EdgeDetect({kernel: 'sobel', threshold: 180}),
    'houghLines': new HoughTransform({type: 'lines'}),
    'houghCircles': new HoughTransform({type: 'circles', radius: 20, threshold: 20}),
    'edgeThinner': new EdgeThinner()
} 

function init(){
    // create canvas and add image to it 
    canvas = new Canvas(options.canvas);
    pipeImage(canvas);
    // pipeVideo(canvas);

    //set snapshot button
    var btnSnapshot = document.getElementById('btn-snapshot');
    btnSnapshot.onclick = function(){
        var filename = (new Date()).toString() + "-edge-detect.jpg";
        canvas.saveState(filename);
    }
}

function filterIt(canvas){
    // simplify image by making it greyscale
    canvas.applyFilter(filters['greyscale']);
    
    // canvas.applyFilter(gaussian);
    canvas.doEdgeDetect(filters['sobel']);

    // thin edges first
    canvas.doEdgeThinning(filters['edgeThinner']);

    // detect lines
    canvas.doHoughTransform(filters['houghLines']);
    // canvas.doHoughTransform(filters['houghCircles']);

    showTimeTaken();
}

function showTimeTaken(){
    timer.end = new Date();
    document.getElementById('filter-time').innerHTML = timer.end - timer.start + ' ms';
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
            setInterval(function() {
                if (video.paused || video.ended){
                    return;
                } 

                c.context.drawImage(video, 0, 0, c.dimensions.width, c.dimensions.height);
                filterIt(c);

            }, 10);
        }, false);
    }, function(e){error(e)})
}

init();