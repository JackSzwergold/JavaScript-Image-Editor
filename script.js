const fileInput = document.querySelector(".file-input"),
// filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValueBrightness = document.querySelector(".filter-info-brightness .value"),
filterValueSaturation = document.querySelector(".filter-info-saturation .value"),
filterSliderBrightness = document.querySelector(".slider_brightness input"),
filterSliderSaturation = document.querySelector(".slider_saturation input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

let brightness = "100",
    saturation = "100", 
    inversion = "0",
    grayscale = "0"
    ;

let rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1
    ;

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    fileName = file.name
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const updateFilter = () => {
    filterValueBrightness.innerText = `${filterSliderBrightness.value}%`;
    filterValueSaturation.innerText = `${filterSliderSaturation.value}%`;

    brightness = filterSliderBrightness.value;
    saturation = filterSliderSaturation.value;

    applyFilter();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    brightness = "100";
    saturation = "100";
    inversion = "0";
    grayscale = "0";
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    resize_height = 1800
    resize_factor = (resize_height / previewImg.naturalHeight)
    canvas.width = previewImg.naturalWidth * resize_factor;
    canvas.height = previewImg.naturalHeight * resize_factor;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    // link.download = "image.jpg";
    link.download = fileName;
    link.href = canvas.toDataURL('image/jpeg', 0.75);
    link.click();
}

filterSliderBrightness.addEventListener("input", updateFilter);
filterSliderSaturation.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());