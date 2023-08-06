
fileInput = document.querySelector("#file_input");

filterValueBrightness = document.querySelector("#slider_brightness label span");
filterValueSaturation = document.querySelector("#slider_saturation label span");
filterValueGrayscale = document.querySelector("#slider_grayscale label span");

filterSliderBrightness = document.querySelector("#slider_brightness input");
filterSliderSaturation = document.querySelector("#slider_saturation input");
filterSliderGrayscale = document.querySelector("#slider_grayscale input");

rotateOptions = document.querySelectorAll("#rotate button");

previewImage = document.querySelector("#preview_image img");
resetFilterButton = document.querySelector("#reset_filter");

chooseImageButton = document.querySelector("#choose_image");
saveImageButton = document.querySelector("#save_image");


let brightness = 100,
    saturation = 100, 
    grayscale = 0
    ;

let rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1
    ;

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImage.src = URL.createObjectURL(file);
    fileName = file.name
    previewImage.addEventListener("load", () => {
        resetFilterButton.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

const applyFilter = () => {
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) grayscale(${grayscale}%)`;
}

const updateFilter = () => {
    filterValueBrightness.innerText = `${filterSliderBrightness.value}%`;
    filterValueSaturation.innerText = `${filterSliderSaturation.value}%`;
    filterValueGrayscale.innerText = `${filterSliderGrayscale.value}%`;

    brightness = filterSliderBrightness.value;
    saturation = filterSliderSaturation.value;
    grayscale = filterSliderGrayscale.value;

    applyFilter();
}

rotateOptions.forEach(option => {

    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        }
        else if (option.id === "right") {
            rotate += 90;
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

    filterValueSaturation.innerText = `100%`;
    saturation = filterSliderSaturation.value = 100;

    filterValueGrayscale.innerText = `0%`;
    grayscale = filterSliderGrayscale.value = 0;

    rotate = 0;

    flipHorizontal = 1;
    flipVertical = 1;

    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    resize_height = 900
    resize_factor = (resize_height / previewImage.naturalHeight)
    canvas.width = previewImage.naturalWidth * resize_factor;
    canvas.height = previewImage.naturalHeight * resize_factor;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL('image/jpeg', 0.75);
    link.click();
}

filterSliderBrightness.addEventListener("input", updateFilter);
filterSliderSaturation.addEventListener("input", updateFilter);
filterSliderGrayscale.addEventListener("input", updateFilter);

resetFilterButton.addEventListener("click", resetFilter);
saveImageButton.addEventListener("click", saveImage);

fileInput.addEventListener("change", loadImage);
chooseImageButton.addEventListener("click", () => fileInput.click());