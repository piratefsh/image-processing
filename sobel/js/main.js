
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
    // img.src = 'img/coins.jpg';
    img.onload = function(){
        imgWidth = canvasDimensions.width;
        imgHeight = this.height * canvasDimensions.width/this.width;
        imgOffsetHeight = -(imgHeight - canvasDimensions.height)/2
        imgOffsetWidth = -(imgWidth - canvasDimensions.width)/2
        context.drawImage(img, imgOffsetWidth, imgOffsetHeight, imgWidth, imgHeight);
        filterToGrayscale();
        edgeDetectSobel();
    }
}

// return image data as 2D array, one 4 element array per pixel
// [[r,g,b,a],...[r,g,b,a]] for easier looping
function getImageData(context){
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    var data = imageData.data;

    var arr = [];
    for(var i = 0; i < data.length; i += 4){
        var pixel = [data[i], data[i+1], data[i+2], data[i+3]];
        arr.push(pixel);
    }
    return arr;
}

// converts 2d array of pixels [[r,g,b,a],...[r,g,b,a]] to ImageData object
function arrToImageData(arr){
    var flatArr = [];
    for(var i = 0; i < arr.length; i++){
        if(arr[i][4] == 1){
            flatArr.push(255)
        }
        else{
            flatArr.push(0)
        }
            flatArr.push(0)
            flatArr.push(0)
            flatArr.push(255)
        // for(var j = 0; j < arr[i].length; j++){
        //     // flatArr.push(arr[i][j]);
        // }
    }

    return new ImageData(new Uint8ClampedArray(flatArr), canvas.width);
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

// convolutes 3x3 pixel window through Sobel kernel and returns processed value
function convoluteSobel(w){
    var threshold = 180;
    var kernelX = [
                [-1, 0, 1], 
                [-2, 0, 2],
                [-1, 0, 1]];
    var kernelY = [
                [-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1]];

    for(var i = 0; i < w.length; i++){
        for(var j = 0; j < w[i].length; j++){
            
            var magX = w[i][j][0] * kernelX[i][j];
            var magY = w[i][j][0] * kernelY[i][j];
            var magnitude = Math.sqrt(Math.pow(magX, 2) + Math.pow(magY, 2));
            if (magnitude < threshold){
                // console.log(w)
                w[i][j].push(1);
                // console.log(w)
            }
            else{
                w[i][j].push(0);
            //     w[i][j][0] = 0;
            //     w[i][j][1] = 0;
            //     w[i][j][2] = 0;
            //     w[i][j][3] = 255;
            }
        }
    }

}

function edgeDetectSobel(){
    // for each pixel window, put it through Sobel kernel
    var data = getImageData(context);

    for(var i = 1; i+8 < data.length; i+=1){
        var pxWindow = [
            [data[i], data[i+1], data[i+2]],
            [data[i+3], data[i+4], data[i+5]],
            [data[i+6], data[i+7], data[i+8]],
            ]
        convoluteSobel(pxWindow);
    }

    // overwrite image
    context.putImageData(arrToImageData(data), 0, 0);

}

init();