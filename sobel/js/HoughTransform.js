"use strict"

function HoughTransform(options){
    // given an array edges, use hough transform to detect lines/etc
    this.accumulator = {};
    this.threshold = 50;
    this.type = options.type;

    // precalculate tables for sin, cos and radian values
    this.tables = {
        sin: {},
        cos: {}
    }

    for(var deg = 0; deg < 180; deg++){
        var rad = (deg * Math.PI / 180);
        this.tables.sin[rad] = Math.sin(rad);
        this.tables.cos[rad] = Math.cos(rad);
    }

    // get radians from keys
    this.tables.radians = Object.keys(this.tables.sin);
}

HoughTransform.prototype = {
    doTransform: function(c, edges){
        switch(this.type){
            case 'lines': 
                timer('start');
                var acc = this.lines(c, edges);
                this.drawLines(c, edges);
                timer('end');
                break;
            case 'circles':
        }
    },

    lines: function(c, edges){
        var width = c.canvas.width;
        var centerX = Math.floor(width/2);
        var centerY = Math.floor(edges.length/width);
        var acc = this.accumulator;

        //use precalculated values
        var sin = this.tables.sin;
        var cos = this.tables.cos;
        var radians = this.tables.radians;

        //detects lines and returns array with line locations
        for(var i = 0; i < edges.length; i++){
            var x = (i / width) - centerX;
            var y = (i % width) - centerY;

            // calculate r for theta = 1deg to 180deg
            for(var j = 0; j < radians.length; j++){
                var rad = radians[j];
                var r = parseInt(x * cos[rad] + y * sin[rad]);

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
        var height = c.canvas.height;

        //use precalculated values
        var sin = this.tables.sin;
        var cos = this.tables.cos;
        var radians = this.tables.radians;

        // draw lines detected from accumulator data. takes in original image data
        for(var i = 0; i < rDegs.length; i++){
            // check if local maxima
            var rd = rDegs[i];
            if(acc[rd] > 100){
                rd = rd.split(',');
                var r = rd[0];
                var rad = rd[1];

                // all possible xs
                for(var x = 0; x < width; x++){
                    var y =  parseInt((r - x * cos[rad]) / sin[rad]);
                    var idx = x * width + y;
                    if(edges[idx]){
                        data[idx] = [255, 0, 0, 255];
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

        c.draw(flatData);

    }  
}