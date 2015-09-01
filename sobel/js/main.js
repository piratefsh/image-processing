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
        // filter and edge detector factories
        var filters = new Filter();
        var edgeDetectors = new EdgeDetect();

        // simplify image by making it greyscale
        canvas.applyFilter(filters.get('greyscale'));

        // apply sobel 
        canvas.doEdgeDetect(edgeDetectors.get('sobel'));
    });
}


init();