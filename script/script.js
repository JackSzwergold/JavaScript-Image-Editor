
jQuery.noConflict();

(function($) {

    fileInput = document.querySelector('#file_input');

    filterValueBrightness = document.querySelector('#slider_brightness label span');
    filterValueContrast = document.querySelector('#slider_contrast label span');
    filterValueSaturation = document.querySelector('#slider_saturation label span');
    // filterValueGrayscale = document.querySelector('#slider_grayscale label span');
    filterValueBlur = document.querySelector('#slider_blur label span');

    filterSliderBrightness = document.querySelector('#slider_brightness input');
    filterSliderContrast = document.querySelector('#slider_contrast input');
    filterSliderSaturation = document.querySelector('#slider_saturation input');
    // filterSliderGrayscale = document.querySelector('#slider_grayscale input');
    filterSliderBlur = document.querySelector("#slider_blur input");

    rotateOptions = document.querySelectorAll('#rotate button');

    previewImage = document.querySelector('.preview_image img');
    resetFilterButton = document.querySelector('#reset_filter');

    // chooseImageButton = document.querySelector('#choose_image');
    saveImageButton = document.querySelector('#save_image');


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
        fileName = file.name
        previewImage.addEventListener('click', () => {
            resetFilterButton.click();
        });
    }

    const initImage = () => {
        fileName = previewImage.getAttribute('alt');
        previewImage.addEventListener('click', () => {
            resetFilterButton.click();
        });
    }


    const applyFilter = () => {
        previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
        // previewImage.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blur}px)`;
        previewImage.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    }

    const updateFilter = () => {

        filterValueBrightness.innerText = `${filterSliderBrightness.value}%`;
        filterValueContrast.innerText = `${filterSliderContrast.value}%`;
        filterValueSaturation.innerText = `${filterSliderSaturation.value}%`;
        // filterValueGrayscale.innerText = `${filterSliderGrayscale.value}%`;
        filterValueBlur.innerText = `${filterSliderBlur.value}px`;

        brightness = Math.floor(filterSliderBrightness.value);
        contrast = Math.floor(filterSliderContrast.value);
        saturation = Math.floor(filterSliderSaturation.value);
        // grayscale = Math.floor(filterSliderGrayscale.value);
        blur = Math.floor(filterSliderBlur.value);

        applyFilter();

    }

    rotateOptions.forEach(option => {


        option.addEventListener('click', () => {
            if (option.id === 'left') {
                if (rotate == -270) {
                    rotate = 0;
                }
                else {
                    rotate -= 90;
                }
            }
            else if (option.id === 'right') {
                if (rotate == 270) {
                    rotate = 0;
                }
                else {
                    rotate += 90;
                }
            }
            else if (option.id === 'horizontal') {
                flipHorizontal = flipHorizontal === 1 ? -1 : 1;
            }
            else if (option.id === 'vertical') {
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

        // filterValueGrayscale.innerText = `0%`;
        // grayscale = filterSliderGrayscale.value = 0;

        filterValueBlur.innerText = `0px`;
        blur = filterSliderBlur.value = 0;

        rotate = 0;

        flipHorizontal = 1;
        flipVertical = 1;

        applyFilter();

    }

    const saveImage = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        resize_height = 900
        resize_factor = (resize_height / previewImage.naturalHeight);

        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            canvas.height = previewImage.naturalWidth * resize_factor;
            canvas.width = previewImage.naturalHeight * resize_factor;   
        }
        else {
            canvas.width = previewImage.naturalWidth * resize_factor;
            canvas.height = previewImage.naturalHeight * resize_factor;  
        }

        // ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blur}px)`;
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotate !== 0) {
            ctx.rotate(rotate * Math.PI / 180);
        }
        ctx.scale(flipHorizontal, flipVertical);
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            ctx.drawImage(previewImage, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
        }
        else {
            ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        }

        mimeType = 'image/jpeg';
        fileExtension = 'jpg';
        quality = 0.95;

        base64_data = canvas.toDataURL(mimeType, 0.95);
        // const link = document.createElement('a');
        // link.href = base64_data;
        // link.download = fileName;
        // link.click();
        // This sends the image to the receiver.
        $.ajax({
            url: 'receiver.php', 
            type: 'POST', 
            data:{
                filename: fileName,
                extension: fileExtension,
                mime_type: mimeType,
                data: base64_data
            }
        });

    }

    filterSliderBrightness.addEventListener('input', updateFilter);
    filterSliderContrast.addEventListener('input', updateFilter);
    filterSliderSaturation.addEventListener('input', updateFilter);
    // filterSliderGrayscale.addEventListener('input', updateFilter);
    filterSliderBlur.addEventListener('input', updateFilter);

    resetFilterButton.addEventListener('click', resetFilter);
    saveImageButton.addEventListener('click', saveImage);

    // fileInput.addEventListener("change", loadImage);
    window.addEventListener('click', initImage);
    // chooseImageButton.addEventListener('click', () => fileInput.click());

})(jQuery);