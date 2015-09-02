"use strict"

function EdgeDetect(opt){
    this.options = opt;
    this.kernels = {
        'sobel':{
            x:  [[-1, 0, 1], 
                [-2, 0, 2],
                [-1, 0, 1]],
            y:  [[-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1]]
        }
    }
}

EdgeDetect.prototype = {
    doDetect: function(){
        switch(this.options.kernel){
            case 'sobel': 
                this.sobel.apply(this, arguments);
                return;
            default:
                error('No such edge detector exists!')
                return;
        }
    },

    sobel: function(c, onConvoluted, onDoneConvoluting){
        var context = c.context;
        var canvas = c.canvas;

        // array of pixel data
        var data = c.getDataArr();

        // convolution kernels
        var kernelX = this.kernels['sobel'].y;
        var kernelY = this.kernels['sobel'].x;

        var kernelSize = kernelX.length;

        // offset value to get window of pixels
        var rowOffset = canvas.width;

        // math to get 3x3 window of pixels because image data given is just a 1D array of pixels
        var maxPixelOffset = canvas.width * 2 + kernelSize - 1;


        for(var i = 0; i + maxPixelOffset < data.length; i++){
            // sum of each pixel * kernel value
            var sumX = 0, sumY = 0;
            for(var x = 0; x < kernelSize; x++){
                for(var y = 0; y < kernelSize; y++){
                    var px = data[i + (rowOffset * x) + y];

                    // use px[0] (i.e. R value) because grayscale anyway)
                    sumX += px[0] * kernelX[x][y];
                    sumY += px[0] * kernelY[x][y];
                }
            }
            var magnitude = Math.sqrt(Math.ceil(Math.pow(sumX, 2) + Math.pow(sumY, 2)));
            var exceedsThreshold = magnitude > this.options.threshold;
            onConvoluted(i, exceedsThreshold, magnitude);
        }
        onDoneConvoluting();
    }
}

