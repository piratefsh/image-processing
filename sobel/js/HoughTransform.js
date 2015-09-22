"use strict"

function HoughTransform(options){
    // given an array edges, use hough transform to detect lines/etc
    this.accumulators = {
        'lines': {},
        'circles': {}
    };

    this.threshold = 100;
    this.type = options.type;

    // optional, for circle detection
    this.radius = options.radius/2; 

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
                this.lines(c, edges);
                this.drawLines(c, edges);
                break;
            case 'circles':
                this.circles(c, edges, this.radius);
                this.drawCircles(c, edges, this.radius);

        }
    },

    lines: function(c, edges){
        var width = c.canvas.width;
        var height = c.canvas.height;
        var centerX = Math.ceil(width/2);
        var centerY = Math.ceil(height/2);

        var acc = this.accumulators['lines'];

        //use precalculated values
        var sin = this.tables.sin;
        var cos = this.tables.cos;
        var radians = this.tables.radians;

        //detects lines and returns array with line locations
        for(var x = 0; x < width; x++){
            for(var y = 0; y < width; y++){
                var i = x * width + y;
                
                // don't calculate for non-edges
                var e = edges[i];
                if(e == undefined || e == 0){
                    continue;
                }

                // calculate r for thetas
                for(var j = 0; j < radians.length; j++){
                    //normalize x and y values with center as origin
                    var xnorm = x - centerX;
                    var ynorm = y - centerY;
                    var rad = radians[j];
                    var r = Math.floor(xnorm * cos[rad] + ynorm * sin[rad]);

                    // increment accumulator by 1 for every r found
                    if([r, rad] in acc){
                        acc[[r, rad]].x.push(xnorm);
                        acc[[r, rad]].y.push(ynorm);
                    }
                    else{
                        acc[[r, rad]] = {
                            x: [xnorm],
                            y: [ynorm]
                        }
                    }
                }
            }
        }

        return acc;
    },

    circles: function(c, edges, radius){
        var acc = this.accumulators['circles'];
        var width = c.canvas.width;
        // for each edge pixel
        for(var x = 0; x < width; x++){
            for(var y = 0; y < c.canvas.height; y++){
                var e = edges[x*width + y];
                
                // ignore non-edges
                if(e == undefined || e == 0){
                    continue;
                }

                // find circle points (a, b) where e = (x,y) can be center of circle
                // formula: x = a + r * cos (theta), a = x - r * cos (theta)
                //          y = b + r * sin (theta), b = y - r * sin (theta)

                var sin = this.tables.sin;
                var cos = this.tables.cos;
                var radians = this.tables.radians;
                var R = radius;
                
                // for each possible angle, find these points
                for(var r = 0; r < radians.length; r++){
                    var rad = radians[r];

                    var a = Math.floor(x - R * cos[rad]);
                    var b = Math.floor(y - R * sin[rad]);

                    // add votes to this points in accumulator
                    if([a,b] in acc){
                        acc[[a,b]]++;
                    }
                    else{
                        acc[[a,b]] = 1;
                    }
                }
            }
        }
    },

    drawCircles: function(c, edges, radius){
        var acc = this.accumulators['circles'];
        var context = c.context;

        var threshold = this.threshold;
        var points = Object.keys(acc);
        for(var i = 0; i < points.length; i++){
            var point = points[i];

            // enough intersections, is probably circle
            if(acc[point] > threshold){
                trace(acc[point])
                // draw circle
                point = point.split(',')
                var x = point[0]; 
                var y = point[1];
                context.beginPath();
                context.strokeStyle = 'rgba(255,0,0,0.5)'
                context.arc(y, x, radius, 0, 2*Math.PI);
                context.stroke();
            }
        }
    },

    drawLines: function(c, edges){
        // clear canvas
        // c.context.clearRect(0,0,c.canvas.width,c.canvas.height);

        // list of all r, deg pairs in accumulator
        var acc = this.accumulators['lines'];
        var rhoRads = Object.keys(acc);
        var width = c.canvas.width;
        var height = c.canvas.height;
        var centerX = Math.floor(width/2);
        var centerY = Math.floor(height/2);

        //use precalculated values
        var sin = this.tables.sin;
        var cos = this.tables.cos;
        var radians = this.tables.radians;

        //parameters
        var threshold = this.threshold; //min num of points on line
        var colorG = 0

        // draw lines detected from accumulator data. takes in original image data
        for(var i = rhoRads.length-1; i >=0 ; i--){
            // get xCoords associated with rho and radian pair
            var rd = rhoRads[i];
            var xCoords = acc[rd].x;
            var yCoords = acc[rd].y;

            //##TODO: check for local maxima
            rd      = rd.split(',');
            var r   = rd[0];    //rho val
            var rad = rd[1];    //radian val

            if(xCoords.length > threshold)
            {
                // all possible xs
                for(var j = 0; j < xCoords.length; j++){
                    var x1 = xCoords[j];
                    var y1 = Math.floor((r - x1 * cos[rad]) / sin[rad]);
                    c.context.fillStyle = 'rgb(255,' + colorG + ',255)';
                    c.context.fillRect(y1+centerY, x1+centerX, 1, 1);
                    
                    var x2 = yCoords[j];
                    var y2 = Math.floor((r - x2 * sin[rad]) / cos[rad]);
                    c.context.fillStyle = 'rgb(0,' + colorG + ',255)';
                    c.context.fillRect(x2+centerY, y2+centerX, 1, 1);
                }
            }
        }
    }  
}