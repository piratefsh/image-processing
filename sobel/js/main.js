
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
    }
}

init();