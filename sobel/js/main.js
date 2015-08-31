
var canvas = document.getElementById('playground');
var context = canvas.getContext('2d');
context.scale(window.devicePixelRatio, window.devicePixelRatio);
context.imageSmoothingEnabled = false;
// size canvas
canvas.width = '720';
canvas.height = '500';

// add image to be processed
function init(){
    var canvasDimensions = canvas.getBoundingClientRect();
    var img = new Image();
    
    img.src = 'img/noguchi01.jpg';
    img.onload = function(){
        imgWidth = canvasDimensions.width;
        imgHeight = this.height * canvasDimensions.width/this.width;
        imgOffsetHeight = -(imgHeight - canvasDimensions.height)/2
        imgOffsetWidth = -(imgWidth - canvasDimensions.width)/2
        context.drawImage(img, imgOffsetWidth, imgOffsetHeight, imgWidth, imgHeight);
        filterToGrayscale();
    }
}

function filterToGrayscale(){
    // get image data (gives us pixels)
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

init();