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

    for(var deg = 0; deg < 360; deg++){
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
        var height = c.canvas.height;
        // var centerX = Math.floor(width/2);
        // var centerY = Math.floor(height/2);

        var acc = this.accumulator;

        //use precalculated values
        var sin = this.tables.sin;
        var cos = this.tables.cos;
        var radians = this.tables.radians;

        //detects lines and returns array with line locations
        for(var i = 0; i < edges.length; i++){
            // don't calculate for non-edges
            if(edges[i] == 0){
                continue;
            }

            // get x, y relative to center of image
            var x = (i / width) 
            var y = (i % width)


            // calculate r for thetas
            for(var j = 0; j < radians.length; j++){
                var rad = radians[j];
                var r = Math.floor(x * cos[rad] + y * sin[rad]);

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
        var rhoDegs = Object.keys(acc);
        var data = c.getDataArr();
        var width = c.canvas.width;
        var height = c.canvas.height;

        //use precalculated values
        var sin = this.tables.sin;
        var cos = this.tables.cos;
        var radians = this.tables.radians;

        //parameters
        var threshold = 40; //min num of points on line

        // draw lines detected from accumulator data. takes in original image data
        for(var i = 0; i < edges.length; i++){
            // check if local maxima
            var rd = rhoDegs[i];
            var numPoints = acc[rd];
            if(numPoints > threshold)
            {
                rd = rd.split(',');
                var r = rd[0];      //rho val
                var rad = rd[1];    //radian val

                // all possible xs
                for(var x = 0; x < width; x++){
                    var y =  parseInt((r - x * cos[rad]) / sin[rad]);
                    var idx = x * width + y;
                    // if(edges[idx])
                    {
                        c.context.fillStyle = 'blue';
                        c.context.fillRect(y, x, 1, 1);
                    }
                }
            }
        }
    }  
}