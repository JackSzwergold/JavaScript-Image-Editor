var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var imageObj = new Image();

imageObj.onload = function() {
    // crop from 0,0, to 250,150
    var cropX = 0;
    var cropY = 0;
    var cropWidth = 250;
    var cropHeight = 150;

    //resize our canvas to match the size of the cropped area
    canvas.style.width = cropWidth;
    canvas.style.height = cropHeight;

    //fill canvas with cropped image
    context.drawImage(imageObj, cropX, cropY, cropWidth, cropHeight, cropX, cropY, canvas.width, canvas.height);

    var link = document.createElement('a');
    link.download = 'test.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();

};
imageObj.src = 'images/test.jpg';
