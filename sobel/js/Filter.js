"use strict"

function Filter(opt){
    this.options = opt;
}

Filter.prototype = {

    doFilter: function(c){
        switch(this.options.type){
            case 'greyscale': 
                this.greyscale(c);
                return;
            case 'gaussian': 
                this.gaussian(c);
                return;
            default:
                error('No such filter exists!')
                return;
        }
    },

    greyscale: function(c){
        // get image data (gives us pixels)
        var context = c.context;
        var canvas = c.canvas; 


        var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        var data = imageData.data;

        // loop through each pixel and set it to grey
        for(var i = 0; i < data.length; i += 4){
            // use luminosity formula to calculate brightness of grey
            var r = data[i], g = data[i+1], b = data[i+2]; 
            var luminosity = 0.21*r + 0.72*g + 0.07*b;
            data[i] = data[i+1] = data[i+2] = luminosity;
        }
        // overwrite image
        context.putImageData(imageData, 0, 0);
    },

    generateGaussianKernel: function(n){
        var k = (n - 1)/2;
        var kernel = [];
        var rho = 0.7;
        var rhoSq = Math.pow(rho, 2)
        // generate nxn kernel
        for(var i = 0; i < n; i++){
            var krow = [];
            for(var j = 0; j < n; j++){

                // Gaussian formula
                var H = 1 / (2 * Math.PI * rhoSq) *
                            Math.exp(
                                (-1 / (2 * rhoSq)) * 
                                (Math.pow(i - k - 1, 2) + Math.pow(j - k - 1, 2)));
                krow.push(H);
            }
            kernel.push(krow);
        }
        trace(kernel)
        return kernel;
    },

    gaussian: function(c){
        var kernel = this.generateGaussianKernel(5);
        c.convolve(kernel);
    }
}