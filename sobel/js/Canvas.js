function Canvas(options){

    // initialize canvas
    this.canvas = document.getElementById(options.id);
    this.context = this.canvas.getContext('2d');

    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvas.width = options.width;
    this.canvas.height = options.height;

    this.dimensions = this.canvas.getBoundingClientRect();
}

Canvas.prototype = {

    drawImage: function(url, onready){
        var _dimensions = this.dimensions;
        var _context = this.context;

        // create image 
        var img = new Image();
        img.src = url;
        img.onload = function(){
            // set image to fill and center in canvas
            imgWidth = _dimensions.width;
            imgHeight = this.height * _dimensions.width/this.width;

            // offsets to center image
            imgOffsetHeight = -(imgHeight - _dimensions.height)/2
            imgOffsetWidth = -(imgWidth - _dimensions.width)/2
            
            _context.drawImage(img, imgOffsetWidth, imgOffsetHeight, imgWidth, imgHeight);

            // do callback on image load
            onready();
        }

    },

    applyFilter: function(filter){
        filter(this);
    },

    doEdgeDetect: function(detect){
        detect(this);
    }

}