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
    doDetect: function(a, b, c){
        switch(this.options.kernel){
            case 'sobel': 
                this.sobel(a, b, c);
                return;
            default:
                error('No such edge detector exists!')
                return;
        }
    },

    sobel: function(c, onDoneConvoluting){
        var context = c.context;
        var canvas = c.canvas;

        // array of pixel data
        var data = c.getDataArr();

        // convolution kernels
        var kernelX = this.kernels['sobel'].x;
        var kernelY = this.kernels['sobel'].y;

        var kernelSize = kernelX.length;

        // offset value to get window of pixels
        var rowOffset = canvas.width;

        // math to get 3x3 window of pixels because image data given is just a 1D array of pixels
        var maxPixelOffset = canvas.width * 2 + kernelSize - 1;

        var magnitudes = [];

        var s = new Date();

        // optimizations
        var SQRT = Math.sqrt;

        for(var i = 0; i + maxPixelOffset < data.length; i++){
            // sum of each pixel * kernel value
            var sumX = 0, sumY = 0;
            for(var x = 0; x < kernelSize; x++){
                for(var y = 0; y < kernelSize; y++){
                    var px = data[i + (rowOffset * y) + x];
                    var r = px[0];

                    // use px[0] (i.e. R value) because grayscale anyway)
                    sumX += r * kernelX[y][x];
                    sumY += r * kernelY[y][x];
                }
            }

            var magnitude = SQRT(sumX*sumX + sumY*sumY);
            magnitudes.push(magnitude);
        }

        var e = new Date();
        trace("time taken for block", e - s)
        onDoneConvoluting(magnitudes, this.options.threshold);
    }
}

