
fileInput = document.querySelector("#file_input");

filterValueBrightness = document.querySelector("#slider_brightness label span");
filterValueContrast = document.querySelector("#slider_contrast label span");
filterValueSaturation = document.querySelector("#slider_saturation label span");
filterValueGrayscale = document.querySelector("#slider_grayscale label span");
filterValueBlur = document.querySelector("#slider_blur label span");

filterSliderBrightness = document.querySelector("#slider_brightness input");
filterSliderContrast = document.querySelector("#slider_contrast input");
filterSliderSaturation = document.querySelector("#slider_saturation input");
filterSliderGrayscale = document.querySelector("#slider_grayscale input");
filterSliderBlur = document.querySelector("#slider_blur input");

rotateOptions = document.querySelectorAll("#rotate button");

previewImage = document.querySelector(".preview_image img");
wrapperGrid = document.querySelector(".wrapper");
overlayGrid = document.querySelector(".overlay");
resetFilterButton = document.querySelector("#reset_filter");

chooseImageButton = document.querySelector("#choose_image");
saveImageButton = document.querySelector("#save_image");


let brightness = 100,
    contrast = 100, 
    saturation = 100, 
    grayscale = 0
    ;

let rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1
    ;

const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImage.src = URL.createObjectURL(file);
    fileName = file.name;
    previewImage.addEventListener("load", () => {
        resetFilterButton.click();
    });
}

const applyFilter = () => {
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImage.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blur}px)`;
}

const updateFilter = () => {

    filterValueBrightness.innerText = `${filterSliderBrightness.value}%`;
    filterValueContrast.innerText = `${filterSliderContrast.value}%`;
    filterValueSaturation.innerText = `${filterSliderSaturation.value}%`;
    filterValueGrayscale.innerText = `${filterSliderGrayscale.value}%`;
    filterValueBlur.innerText = `${filterSliderBlur.value}px`;

    brightness = filterSliderBrightness.value;
    contrast = filterSliderContrast.value;
    saturation = filterSliderSaturation.value;
    grayscale = filterSliderGrayscale.value;
    blur = filterSliderBlur.value;

    applyFilter();

}

rotateOptions.forEach(option => {

    option.addEventListener("click", () => {
        if (option.id === "left") {
            if (rotate == -270) {
                rotate = 0;
            }
            else {
                rotate -= 90;
            }
        }
        else if (option.id === "right") {
            if (rotate == 270) {
                rotate = 0;
            }
            else {
                rotate += 90;
            }
        }
        else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        else if (option.id === "vertical") {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }

        applyFilter();

    });
});

const resetFilter = () => {

    filterValueBrightness.innerText = `100%`;
    brightness = filterSliderBrightness.value = 100;

    filterValueContrast.innerText = `100%`;
    contrast = filterSliderContrast.value = 100;

    filterValueSaturation.innerText = `100%`;
    saturation = filterSliderSaturation.value = 100;

    filterValueGrayscale.innerText = `0%`;
    grayscale = filterSliderGrayscale.value = 0;

    filterValueBlur.innerText = `0px`;
    blur = filterSliderBlur.value = 0;

    rotate = 0;

    flipHorizontal = 1;
    flipVertical = 1;

    applyFilter();

}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    offset_test_x = (overlayGrid.offsetLeft - previewImage.offsetLeft - wrapperGrid.offsetLeft);
    offset_test_y = (overlayGrid.offsetTop - previewImage.offsetTop - wrapperGrid.offsetTop);
    // alert(offset_test_x);
    // alert(offset_test_y);
    // console.log(overlayGrid);
    // console.log(previewImage);

    resize_height = 900;
    resize_factor = (resize_height / previewImage.naturalHeight);
    if (Math.abs(rotate) == 90 || Math.abs(rotate) == 270) {
        canvas.width = previewImage.naturalHeight * resize_factor;   
        canvas.height = previewImage.naturalWidth * resize_factor;
    }
    else {
        canvas.width = previewImage.naturalWidth * resize_factor;
        canvas.height = previewImage.naturalHeight * resize_factor;  
    }

    offset_x = (canvas.width / 2);
    offset_y = (canvas.height / 2);

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blur}px)`;
    ctx.translate(offset_x, offset_y);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    if (Math.abs(rotate) == 90 || Math.abs(rotate) == 270) {
        ctx.drawImage(previewImage, -offset_y, -offset_x, canvas.height, canvas.width);
    }
    else {
        ctx.drawImage(previewImage, -offset_x, -offset_y, canvas.width, canvas.height);
    }
    
    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL('image/jpeg', 0.75);
    link.click();
}

filterSliderBrightness.addEventListener("input", updateFilter);
filterSliderContrast.addEventListener("input", updateFilter);
filterSliderSaturation.addEventListener("input", updateFilter);
filterSliderGrayscale.addEventListener("input", updateFilter);
filterSliderBlur.addEventListener("input", updateFilter);

resetFilterButton.addEventListener("click", resetFilter);
saveImageButton.addEventListener("click", saveImage);

fileInput.addEventListener("change", loadImage);
chooseImageButton.addEventListener("click", () => fileInput.click());