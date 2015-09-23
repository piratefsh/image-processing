"use strict"

function EdgeThinner(){
    this.type = 'skeleton';
    this.iterations = 1;
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
        ],
        '8-connected':[
            [   [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]
            ],
            [
                [0, 0, 0],
                [0, 1, 0],
                [0, null, null],
            ],
            [
                [0, 0, 0],
                [0, 1, 0],
                [null, null, 0],
            ],
        ],
        '4-connected': [
            [   [null, 1, null],
                [1, 1, 1],
                [null, 1, null]
            ],
            [
                [0, 0, 0],
                [0, 1, 0],
                [0, null, null],
            ],
            [
                [0, 0, 0],
                [0, 1, 0],
                [null, null, 0],
            ],
        ],
    }
}

EdgeThinner.prototype = {
    doThinning: function(canvas, edges, directions){
        this.c = canvas;
        this.edges = edges;
        this.directions = directions;
        this.createRotations();
        // return this.nonMaxSupression()
        return this.thin();
    },

    createRotations: function(){
        var kernels = this.kernels[this.type];
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

    thin: function(){
        var edges = this.edges;
        var kernels = this.kernels[this.type];
        var iterations = 3;

        var width = this.c.canvas.width;
        var height = this.c.canvas.height;
        var newEdges = new Array(edges.length);
        // for each kernel, apply them and rotations (TODO)
        for(var times = 0; times < this.iterations; times++){
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
        this.drawLines(newEdges, width, height);
        return newEdges;
    },

    drawLines: function(edges, width, height){
        // draw the thinned edge
        var context = this.c.context;
        context.clearRect(0,0,width,height);
        var count = 0;
        context.fillStyle = 'rgb(100,100,100)';
        for(var x = 0; x < width; x++){
            for(var y = 0; y < height; y++){
                var edgeIdx = (y * width) + x;
                var e = edges[edgeIdx];
                if(e){
                    context.fillRect(x, y, 1, 1);
                }
            }
        }
    },

    forEachEdge: function(edges, width, height, func){
        for(var x = 0; x < height; x++){
            for(var y = 0; y < width; y++){
                var i = x*width + y;
                func(x, y, edges[i], i)
            }
        }
    },

    nonMaxSupression: function(){
        var width = this.c.canvas.width;
        var height = this.c.canvas.height;
        var edges = this.edges;
        var directions = this.directions;

        var newEdges = new Array(edges.length);
        this.forEachEdge(edges, width, height, function(x, y, mag, i){
            if(x == 0 || y == 0 || x == edges.length - 1 || y == edges.length -1){
                return;
            }

            // simplify directions of tangent
            var dir = directions[i];
            var tangent; 
            
            // get rounded down angle
            var which = Math.abs(Math.floor(dir / (1/4*Math.PI)));

            var nidx = [];
            switch(which){
                case 0: //north-south, check east and west
                case 4:
                    nidx.push([x+1, y], [x-1, y]);
                    break;
                case 1: //northwest-southeast, check northest-southwest
                    nidx.push([x-1, y-1], [x+1, y+1]);
                    break;
                case 2: //east west, check north-south
                    nidx.push([x, y+1], [x, y-1]);
                    break;
                case 3: //northest-southwest, check northwest-souteast
                    nidx.push([x+1, y+1], [x-1, y-1]);
                    break;
                default:
                    // invalid
            }

            // if neighbours are less, is center of edge
            var isMax = true;
            for(var n of nidx){ 
                var idx = n[0] * width + n[1];
                if(dir <= directions[idx]){
                    isMax = false;
                }
            }
            if(isMax){ 
                newEdges[i] = mag;
            }
            else { 
                newEdges[i] = 0;
            }
        });
        this.drawLines(newEdges, width, height);
        return newEdges;
    }
}