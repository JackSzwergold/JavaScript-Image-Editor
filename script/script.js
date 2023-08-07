
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

let event_state = {},
    constrain = false,
      min_width = 60,
      min_height = 60,
      max_width = 800,
      max_height = 900,
      resize_canvas = document.createElement('canvas');
    ;

const loadImage = () => {

    let file = fileInput.files[0];
    if (!file) return;
    previewImage.src = URL.createObjectURL(file);
    fileName = file.name
    previewImage.addEventListener("load", () => {
        resetFilterButton.click();
    });

    $(previewImage).wrap('<div class="resize-container"></div>')
    .before('<span class="resize-handle resize-handle-nw"></span>')
    .before('<span class="resize-handle resize-handle-ne"></span>')
    .after('<span class="resize-handle resize-handle-se"></span>')
    .after('<span class="resize-handle resize-handle-sw"></span>')
    ;

    $container =  $(previewImage).parent('.resize-container');

    $container.on('mousedown touchstart', '.resize-handle', startResize);
    $container.on('mousedown touchstart', 'img', startMoving);

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

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blur}px)`;
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
    
    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL('image/jpeg', 0.75);
    link.click();
}

const resizeImage = (width, height) => {
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext('2d').drawImage(previewImage, 0, 0, width, height);   
    $(previewImage).attr('src', resize_canvas.toDataURL("image/png"));  
}

const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', resizing);
    $(document).on('mouseup touchend', endResize);
};

const endResize = (e) => {
    e.preventDefault();
    $(document).off('mouseup touchend', endResize);
    $(document).off('mousemove touchmove', resizing);
};

const saveEventState = (e) => {

    event_state.container_width = $container.width();
    event_state.container_height = $container.height();
    event_state.container_left = $container.offset().left; 
    event_state.container_top = $container.offset().top;
    event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
    event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
    
    if(typeof e.originalEvent.touches !== 'undefined') {
        event_state.touches = [];
        $.each(e.originalEvent.touches, function(i, ob) {
          event_state.touches[i] = {};
          event_state.touches[i].clientX = 0+ob.clientX;
          event_state.touches[i].clientY = 0+ob.clientY;
        });
    }

    event_state.evnt = e;

};

const resizing = (e) => {
    var mouse={},width,height,left,top,offset=$container.offset();
    mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
    mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

    if( $(event_state.evnt.target).hasClass('resize-handle-se') ){
      width = mouse.x - event_state.container_left;
      height = mouse.y  - event_state.container_top;
      left = event_state.container_left;
      top = event_state.container_top;
    }
    else if ($(event_state.evnt.target).hasClass('resize-handle-sw') ){
      width = event_state.container_width - (mouse.x - event_state.container_left);
      height = mouse.y  - event_state.container_top;
      left = mouse.x;
      top = event_state.container_top;
    }
    else if ($(event_state.evnt.target).hasClass('resize-handle-nw') ){
      width = event_state.container_width - (mouse.x - event_state.container_left);
      height = event_state.container_height - (mouse.y - event_state.container_top);
      left = mouse.x;
      top = mouse.y;
      if(constrain || e.shiftKey){
        top = mouse.y - ((width / previewImage.width * previewImage.height) - height);
      }
    }
    else if ($(event_state.evnt.target).hasClass('resize-handle-ne') ){
      width = mouse.x - event_state.container_left;
      height = event_state.container_height - (mouse.y - event_state.container_top);
      left = event_state.container_left;
      top = mouse.y;
      if(constrain || e.shiftKey){
        top = mouse.y - ((width / previewImage.width * previewImage.height) - height);
      }
    }

    if (constrain || e.shiftKey){
      height = width / previewImage.width * previewImage.height;
    }

    if (width > min_width && height > min_height && width < max_width && height < max_height){
      resizeImage(width, height);  
      $container.offset({'left': left, 'top': top});
    }
}

const startMoving = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', moving);
    $(document).on('mouseup touchend', endMoving);
}

const endMoving = (e) => {
    e.preventDefault();
    $(document).off('mouseup touchend', endMoving);
    $(document).off('mousemove touchmove', moving);
}

const moving = (e) => {
    var mouse = {}, touches;
    e.preventDefault();
    e.stopPropagation();
    
    touches = e.originalEvent.touches;
    
    mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft(); 
    mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
    $container.offset({
      'left': mouse.x - ( event_state.mouse_x - event_state.container_left ),
      'top': mouse.y - ( event_state.mouse_y - event_state.container_top ) 
    });

    if (event_state.touches && event_state.touches.length > 1 && touches.length > 1) {
      var width = event_state.container_width, height = event_state.container_height;
      var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
      a = a * a; 
      var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
      b = b * b; 
      var dist1 = Math.sqrt( a + b );
      
      a = e.originalEvent.touches[0].clientX - touches[1].clientX;
      a = a * a; 
      b = e.originalEvent.touches[0].clientY - touches[1].clientY;
      b = b * b; 
      var dist2 = Math.sqrt( a + b );

      var ratio = dist2 /dist1;

      width = width * ratio;
      height = height * ratio;

      resizeImage(width, height);
    }
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
