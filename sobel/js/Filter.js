function Filter(options){
}


Filter.prototype = {

    get: function(type){
        switch(type){
            case 'greyscale': 
                return this.greyscale
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
    }
}