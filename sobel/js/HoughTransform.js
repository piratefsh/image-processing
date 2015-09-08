function HoughTransform(options){
    // given an array edges, use hough transform to detect lines/etc
    this.accumulator = {};
    this.threshold = 50;
    this.type = options.type;
}

HoughTransform.prototype = {
    doTransform: function(c, edges){
        switch(this.type){
            case 'lines': 
                var acc = this.lines(c, edges);
                this.drawLines(c, edges);
                break;
            case 'circles':
        }
    },

    lines: function(c, edges){
        var width = c.canvas.width;
        var centerX = Math.floor(width/2);
        var centerY = Math.floor(edges.length/width);
        var acc = this.accumulator;
        //detects lines and returns array with line locations
        for(var i = 0; i < edges.length; i++){
            var x = (i / width) - centerX;
            var y = (i % width) - centerY;

            // calculate r for theta = 1deg to 180deg
            for(var deg = 0; deg < 180; deg+=2){
                rad = deg * Math.PI / 180;
                var r = parseInt(x * Math.cos(rad) + y * Math.sin(rad));

                // increment accumulator by 1 for every r found
                if([r, rad] in acc){
                    acc[[r, rad]] += 1;
                }
                else{
                    acc[[r, rad]] = 1;
                }
            }

        }
        return acc;
    },

    drawLines: function(c, edges){
        // list of all r, deg pairs in accumulator
        var acc = this.accumulator;
        var rDegs = Object.keys(acc);
        var data = c.getDataArr();
        var width = c.canvas.width;
        trace(edges.length, data.length, acc.length)
        // draw lines detected from accumulator data. takes in original image data
        for(var i = 0; i < rDegs.length; i++){
            // check if local maxima
            var rd = rDegs[i];
            if(acc[rd] > 10){

                var r = rd[0];
                var rad = rd[1];

                // all possible ys
                for(var x = 0; x < width; x++){
                    //if y is on an edge

                    var y =  parseInt((r - x * Math.cos(rad)) / Math.sin(rad));
                    var onEdge = edges[x*width + y];
                    if(onEdge){
                        data[x*width+y] = [255, 0, 0, 255];
                    }
                
                }
            }
        }

        var flatData = new Array(data.length*4);
        for(var i = 0; i < data.length; i++){
            var px = data[i];
            flatData[i*4] = px[0];
            flatData[i*4+1] = px[1];
            flatData[i*4+2] = px[2];
            flatData[i*4+3] = px[3];
        }

        trace('draw')
        c.draw(flatData);

    }  
}