const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
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

// filterOptions.forEach(option => {
//     option.addEventListener("click", () => {
//         document.querySelector(".active").classList.remove("active");
//         option.classList.add("active");

//         if(option.id === "brightness") {
//             filterSliderBrightness.max = "200";
//             filterSliderBrightness.value = brightness;
//             filterValue.innerText = `${brightness}%`;
//         } else if(option.id === "saturation") {
//             filterSliderSaturation.max = "200";
//             filterSliderSaturation.value = saturation;
//             filterValue.innerText = `${saturation}%`
//         } else if(option.id === "inversion") {
//             filterSliderBrightness.max = "100";
//             filterSliderBrightness.value = inversion;
//             filterValue.innerText = `${inversion}%`;
//         } else {
//             filterSliderBrightness.max = "100";
//             filterSliderBrightness.value = grayscale;
//             filterValue.innerText = `${grayscale}%`;
//         }
//     });
// });

const updateFilter = () => {
    filterValue.innerText = `${filterSliderBrightness.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "brightness") {
        brightness = filterSliderBrightness.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSliderSaturation.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSliderBrightness.value;
    } else {
        grayscale = filterSliderBrightness.value;
    }
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
    filterOptions[0].click();
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
    // setDPI(canvas, 72)
    link.href = canvas.toDataURL('image/jpeg', 0.75);
    link.click();
}

const setDPI = (canvas, dpi) => {
    // Set up CSS size.
    canvas.style.width = canvas.style.width || canvas.width + 'px';
    canvas.style.height = canvas.style.height || canvas.height + 'px';

    // Get size information.
    var scaleFactor = dpi / 96;
    var width = parseFloat(canvas.style.width);
    var height = parseFloat(canvas.style.height);

    // Backup the canvas contents.
    var oldScale = canvas.width / width;
    var backupScale = scaleFactor / oldScale;
    var backup = canvas.cloneNode(false);
    backup.getContext('2d').drawImage(canvas, 0, 0);

    // Resize the canvas.
    var ctx = canvas.getContext('2d');
    canvas.width = Math.ceil(width * scaleFactor);
    canvas.height = Math.ceil(height * scaleFactor);

    // Redraw the canvas image and scale future draws.
    ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
    ctx.drawImage(backup, 0, 0);
    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
}

filterSliderBrightness.addEventListener("input", updateFilter);
filterSliderSaturation.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());