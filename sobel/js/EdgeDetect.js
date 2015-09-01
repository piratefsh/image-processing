"use strict"

function EdgeDetect(opt){
    this.options = opt;
}

EdgeDetect.prototype = {
    doDetect: function(c){
        switch(this.options.kernel){
            case 'sobel': 
                this.sobel(c);
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
    sobel: function(c){
        var context = c.context;
        var canvas = c.canvas;

        // color to mark edge
        var edgeColor = [255, 255, 0, 255]

        // keep track which pixels are edges
        var edges = [];

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

            // if window is an edge, mark as such with color, 
            // else just print original pixel color
            if(this.isSobelEdge(pxWindow)){
                Array.prototype.push.apply(edges, edgeColor);
            }
            else{
                var transparentPix = data[i].slice();

                // make pix slightly transparent
                transparentPix[3] = 200;
                Array.prototype.push.apply(edges, transparentPix);
            }
        }

        // pad missing edges. edge detected image will be smaller than 
        // original because cannot determine edges at image edges
        var missing = data.length*data[0].length - edges.length
        for(var i = 0; i < missing/4; i++){
            Array.prototype.unshift.apply(edges, edgeColor);
        }

        // overwrite image with the edges
        context.putImageData(new ImageData(new Uint8ClampedArray(edges), canvas.width, canvas.height), 0, 0);

    }
}

