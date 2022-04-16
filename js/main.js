'use strict';

// globals
var canvas;

// various configurations
var options = {
    canvas: {
        id: 'playground',
        width: 500,
        height: 350,
        imageUrl: 'img/lines.png',
    },
};
var timer = {
    start: new Date(),
    end: null,
};

var pauseVideo = false;

var filters = {
    greyscale: new Filter({type: 'greyscale'}),
    gaussian: new Filter({type: 'gaussian'}),
    sobel: new EdgeDetect({kernel: 'sobel', threshold: 100}),
    houghLines: new HoughTransform({type: 'lines', threshold: 120}),
    houghCircles: new HoughTransform({type: 'circles', radius: 6, threshold: 170}),
    edgeThinner: new EdgeThinner(),
};

var thresholdInput = document.getElementById('edge-detect-threshold');

function init() {

    var container = document.getElementById('canvas-container');
    options.canvas.width = (container.clientWidth - 30);
    options.canvas.height = options.canvas.width * 0.75;

    // create canvas and add image/video frames to it
    canvas = new Canvas(options.canvas);
    pipeVideo(canvas);

    // pipeImage(canvas);

    // set snapshot button
    var btnSnapshot = document.getElementById('btn-snapshot');
    btnSnapshot.onclick = function(e) {
        e.preventDefault();
        var filename = (new Date()).toString() + '-edge-detect.jpg';
        canvas.saveState(filename);
    };

    // set listener for all radio buttons for selecting filter
    var radioBtns = document.querySelector('.filter');
    for (var i in radioBtns) {
        radioBtns[i].onchange = function() {
            pauseVideo = false;
            filterIt(canvas);
        };
    }

    thresholdInput.onchange = function() {
        filterIt(canvas);
    };
}

function filterIt(canvas) {
    timer.start = new Date();

    // get filter
    var filter =  document.getElementById('controls').elements['filter'].value;

    switch (filter){
        case 'greyscale': {
            canvas.applyFilter(filters['greyscale']);
            break;
        }

        case 'gaussian-blur': {
            canvas.applyFilter(filters['gaussian']);
            break;
        }

        case 'edge-detect': {
            var threshold = thresholdInput.value > 0 ? thresholdInput.value : 100;
            filters['sobel'].options.threshold = threshold;
            canvas.applyFilter(filters['greyscale']);
            canvas.doEdgeDetect(filters['sobel']);
            break;
        }

        case 'edge-thin' : {
            canvas.applyFilter(filters['greyscale']);
            canvas.doEdgeDetect(filters['sobel']);
            canvas.doEdgeThinning(filters['edgeThinner']);
            break;
        }

        case 'line-detect' : {
            pauseVideo = true;
            canvas.applyFilter(filters['greyscale']);
            canvas.doEdgeDetect(filters['sobel']);
            canvas.doEdgeThinning(filters['edgeThinner']);
            canvas.doHoughTransform(filters['houghLines']);
            break;
        }

        case 'circle-detect' : {
            pauseVideo = true;
            canvas.applyFilter(filters['greyscale']);
            canvas.doEdgeDetect(filters['sobel']);
            canvas.doEdgeThinning(filters['edgeThinner']);
            canvas.doHoughTransform(filters['houghCircles']);
            break;
        }

        default : {
            trace('Filter does not exist: ' + filter);
        }
    }

    showTimeTaken();
}

function showTimeTaken() {
    timer.end = new Date();
    document.getElementById('filter-time').innerHTML = timer.end - timer.start + ' ms';
}

function pipeImage(c) {
    // pipe an image to canvas
    c.drawImage(options.canvas.imageUrl, function() {
        filterIt(c);
    });
}

function pipeVideo(c) {
    // pipe an a video stream to canvas
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({
        video: true,
    }, function(stream) {
        var video = document.getElementById('user-video');
        if(video.srcObject !== undefined){
            video.srcObject = stream
        } else {
            try {
                video.src = compatibility.URL.createObjectURL(stream);
            } catch (error) {
                video.src = stream;
            }
        }
        video.addEventListener('play', function() {
            setInterval(function() {
                if (video.paused || video.ended) {
                    return;
                }

                if (!pauseVideo) {
                    c.context.drawImage(video, 0, 0, c.dimensions.width, c.dimensions.height);
                    filterIt(c);
                }

            }, 10);
        }, false);
    }, function(e) {error(e);});
}

init();
