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
        this.c = canvas;
        this.edges = edges;
        this.createRotations();
        return this.findSkeleton();
    },

    createRotations: function(){
        var kernels = this.kernels['skeleton'];
        for(var k in kernels){
            var kern = kernels[k];

            // do 3 times
            var curr = kern;

            for(var rot = 0; rot < 3; rot++){
                // make new grid
                var newKern = new Array(curr.length);
                for(var i = 0; i < newKern.length; i++){
                    newKern[i] = new Array(curr[i].length);
                }

                // put rotated
                for(var i = 0; i < curr.length; i++){
                    for(var j = 0; j < curr[i].length; j++){
                        newKern[i][j] = curr[j][i];
                    }
                }
                kernels.push(newKern);
                curr = newKern;
            }
        }
    },

    findSkeleton: function(){
        var edges = this.edges;
        var kernels = this.kernels['skeleton'];
        var iterations = 3;

        var width = this.c.canvas.width;
        var height = this.c.canvas.height;
        var newEdges = new Array(edges.length);
        // for each kernel, apply them and rotations (TODO)
        for(var times = 0; times < 1; times++){
            for(var n = 0; n < kernels.length; n++){
                // get a kernel 
                var kernel = kernels[n];
                var count = 0;

                // for each pixel 
                for(var x = 0; x < height; x++){
                    for(var y = 0; y < width; y++){
                        // 3x3 window of neighbours
                        var keepEdge = true;
                        for(var k = -1; k <= 1; k++){
                            for(var l = -1; l  <= 1; l++){
                                // get kernel value for that pixel
                                var kx = k + 1;
                                var ky = l + 1;
                                var kxy = kernel[kx][ky];
                                
                                // pixel index
                                var edgeIdx = ((x+k) * width-1) + (y+l) -1;
                                var centerIdx = ((x) * width-1) + (y) -1;

                                if(!(edgeIdx > -1 && edgeIdx < edges.length)){
                                    continue;
                                }

                                // check if pixels exist in accordance to kernel
                                var e = edges[edgeIdx];
                                if(kxy !== null){
                                    var isOne = (kxy == 1 && e)
                                    var isZero = (kxy == 0 && !e)
                                    if(!(isOne || isZero))
                                    {
                                        keepEdge = false;
                                    }
                                }
                            }
                        }
                        if(keepEdge){
                            newEdges[centerIdx] = e;
                        }
                    }
                }
            }
        }
        this.drawLines(newEdges, width, height)
        return newEdges;
    },
    drawLines: function(edges, width, height){
        // draw the thinned edge
        var context = this.c.context;
        context.clearRect(0,0,width,height);
        var count = 0;
        context.fillStyle = 'rgb(255,0,0)';
        for(var x = 0; x < width; x++){
            for(var y = 0; y < height; y++){
                var edgeIdx = (y * width) + x;
                var e = edges[edgeIdx];
                if(e){
                    context.fillRect(x, y, 1, 1);
                }
            }
        }
    }
}