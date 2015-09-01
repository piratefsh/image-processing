// globals
var canvas;

// various configurations
var options = {
    canvas: {
        id: 'playground',
        width: '720',
        height: '500',
        imageUrl: 'img/noguchi01.jpg'
    }
}

function init(){
    // create canvas and add image to it 
    canvas = new Canvas(options.canvas);
    canvas.drawImage(options.canvas.imageUrl, function(){
        var filters = new Filter();
        canvas.applyFilter(filters.get('greyscale'));
    });

    // canvas.edgeDetect(new EdgeDetect({kernel: 'Sobel'}));
}


init();