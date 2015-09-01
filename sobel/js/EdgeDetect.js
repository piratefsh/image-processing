"use strict"

function EdgeDetect(opt){
    this.options = opt;
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

    isSobelEdge: function(w){
        // convolutes 3x3 pixel window through Sobel kernel 
        // and returns if exceeds threshold
        var threshold = this.options.threshold;
        var kernelY = [
                    [-1, 0, 1], 
                    [-2, 0, 2],
                    [-1, 0, 1]];
        var kernelX = [
                    [-1, -2, -1],
                    [0, 0, 0],
                    [1, 2, 1]];

        var sumX = 0, sumY = 0;

        for(var i = 0; i < w.length; i++){
            for(var j = 0; j < w[i].length; j++){
                sumX += w[i][j][0] * kernelX[i][j];
                sumY += w[i][j][0] * kernelY[i][j];
            }
        }

        var magnitude = Math.sqrt(Math.ceil(Math.pow(sumX, 2) + Math.pow(sumY, 2)));
        
        // mark as 1 if it exceeds threshold
        return magnitude > threshold;
    },

    sobel: function(c, onConvoluted, onDoneConvoluting){
        var context = c.context;
        var canvas = c.canvas;

        var data = c.getDataArr();

        // math to get 3x3 window of pixels because image data given is just a 1D array of pixels
        var maxPixelOffset = canvas.width*2+2;
        var row2Offset = canvas.width
        var row3Offset =  canvas.width*2

        for(var i = 0; i + maxPixelOffset < data.length; i+=1){
            var r2 = i + row2Offset;
            var r3 = i + row3Offset;

            // get window to convolute through kernel
            var pxWindow = [
                [data[i], data[i+1], data[i+2]],
                [data[r2], data[r2+1], data[r2+2]],
                [data[r3], data[r3+1], data[r3+2]],
                ]

            onConvoluted(i, this.isSobelEdge(pxWindow));
        }
        onDoneConvoluting();
    }
}

