"use strict"

function EdgeThinner(){
    this.kernels = {
        'skeleton': 
        [
            [   [0, 0, 0],
                [null, 1, null],
                [1, 1, 1]
            ],
            [   [null, 0, 0],
                [1, 1, 0],
                [null, 1, null]
            ]
        ]
    }
}

EdgeThinner.prototype = {
    doThinning: function(canvas, edges){
        this.canvas = canvas;
        this.edges = edges;
        this.findSkeleton();
    },

    findSkeleton: function(){
        var edges = this.edges;
        var kernels = this.kernels['skeleton'];
        var iterations = 3;

        var width = this.canvas.dimensions.width;
        var height = this.canvas.dimensions.height;

        // for each kernel, apply them and rotations (TODO)
        for(var n = 0; n < kernels.length; n++){

            // get a kernel 
            var kernel = kernels[n];

            // for each pixel 
            for(var x = 0; x < width; x++){
                for(var y = 0; y < height; y++){
                    // pixel index
                    var edgeIdx = x * width + y;
                    // 3x3 window of neighbours
                    for(var k = -1; k <= 1; k++){
                        for(var l = -1; l  <= 1; l++){
                            // get kernel value for that pixel
                            var kx = k + 1;
                            var ky = l + 1;
                            var kxy = kernel[kx][ky];

                            // perform or
                            if(kxy != null){
                                trace(edges[edgeIdx] * kxy)
                                edges[edgeIdx] = edges[edgeIdx] * kxy;
                            }
                        }
                    }
                }
            }
        }
        trace('done thinning')
        this.drawLines(edges)
        trace('done drawing')
    },
    drawLines: function(edges){
        // draw the thinned edge
        var width = this.canvas.dimensions.width;
        var height = this.canvas.dimensions.height;
        this.canvas.context.fillStyle = 'rgb(255,255,0)';
        for(var x = 0; x < width; x++){
            for(var y = 0; y < height; y++){
                var e = edges[x * width + y];
                if(e != 0){
                    this.canvas.context.fillRect(x, y, 1, 1);
                }
            }
        }
    }
}