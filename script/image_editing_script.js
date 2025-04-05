jQuery.noConflict();

(function($) {

  /****************************************************************************/
  // The core 'document ready' logic.
  $(document).ready(function() {

    /**************************************************************************/
    // Set the data URL and data URI values.
    data_url = typeof($('#BASE_URL').val()) != 'undefined' ? $('#BASE_URL').val() : '';
    data_uri = typeof($('#BASE_URI').val()) != 'undefined' ? $('#BASE_URI').val() : '';

    /**************************************************************************/
    // Set the N Number.
    file_name = typeof($('#N_NUMBER').val()) != 'undefined' ? $('#N_NUMBER').val() : '';
    resize_height = typeof($('#RESIZE_HEIGHT').val()) != 'undefined' ? $('#RESIZE_HEIGHT').val() : '';

    /**************************************************************************/
    // Select different elements.
    // fileInput = document.querySelector('#file_input');

    /**************************************************************************/
    // The slider text values.
    brightness_text = document.querySelector('#brightness_slider label span');
    contrast_text = document.querySelector('#contrast_slider label span');
    saturation_text = document.querySelector('#saturation_slider label span');
    blur_text = document.querySelector('#blur_slider label span');

    /**************************************************************************/
    // The slider input items.
    brightness_slider = document.querySelector('#brightness_slider input');
    contrast_slider = document.querySelector('#contrast_slider input');
    saturation_slider = document.querySelector('#saturation_slider input');
    blur_slider = document.querySelector('#blur_slider input');

    /**************************************************************************/
    // The rotate buttons.
    rotate_buttons = document.querySelectorAll('#rotate button');

    /**************************************************************************/
    // The image preview itself.
    preview_image = document.querySelector('.preview_image img');

    /**************************************************************************/
    // The rotation buttons.
    rotate_left_button = $('#rotate_left');
    rotate_right_button = $('#rotate_right');
    flip_horizontal_button = $('#flip_horizontal');
    flip_vertical_button = $('#flip_vertical');

    /**************************************************************************/
    // The main buttions.
    reset_filter_button = $('#reset_filter');
    download_image_button = $('#download_image');
    save_image_button = $('#save_image');
    modal_close_button = $('#modal_close');

    /**************************************************************************/
    // Initial control values.
    brightness = 100;
    contrast = 100;
    saturation = 100;
    rotate = 0;
    flip_horizontal = 1;
    flip_vertical = 1;

    /**************************************************************************/
    // Set the debounce value in milliseconds.
    general_debounce = 50;

    // const loadImage = () => {
    //     let file = fileInput.files[0];
    //     if (!file) return;
    //     preview_image.src = URL.createObjectURL(file);
    //     file_name = file.name
    //     preview_image.addEventListener('click', () => {
    //         reset_filter_button.click();
    //     });
    // }

    /****************************************************************************/
    // Handler to init the image.
    function init_image_handler() {
        preview_image.addEventListener('click', () => {
            reset_filter_button.click();
        });
    } // init_image_handler

    /****************************************************************************/
    // Handler to apply the filters.
    function apply_filter_handler() {
        preview_image.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
        preview_image.style.transform = `rotate(${rotate}deg) scale(${flip_horizontal}, ${flip_vertical})`;
    } // apply_filter_handler

    /****************************************************************************/
    // Handler to update the filters.
    function update_filter_values_handler() {

        brightness_text.innerText = `${brightness_slider.value}%`;
        contrast_text.innerText = `${contrast_slider.value}%`;
        saturation_text.innerText = `${saturation_slider.value}%`;
        blur_text.innerText = `${blur_slider.value}px`;

        brightness = Math.floor(brightness_slider.value);
        contrast = Math.floor(contrast_slider.value);
        saturation = Math.floor(saturation_slider.value);
        blur = Math.floor(blur_slider.value);

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // update_filter_values_handler

    /****************************************************************************/
    // Handler to rotate left.
    function rotate_left_handler() {

        /************************************************************************/
        // Do it.
        if (rotate == -270) {
            rotate = 0;
        }
        else {
            rotate -= 90;
        }

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // rotate_left_handler

    /****************************************************************************/
    // Handler to rotate right.
    function rotate_right_handler() {

        /************************************************************************/
        // Do it.
        if (rotate == 270) {
            rotate = 0;
        }
        else {
            rotate += 90;
        }

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // rotate_left_handler

    /****************************************************************************/
    // Handler to flip horizontal.
    function flip_horizontal_handler() {

        /************************************************************************/
        // Do it.
        flip_horizontal = flip_horizontal === 1 ? -1 : 1;

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // flip_horizontal_handler

    /****************************************************************************/
    // Handler to flip vertical.
    function flip_vertical_handler() {

        /************************************************************************/
        // Do it.
        flip_vertical = flip_vertical === 1 ? -1 : 1;

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // flip_vertical_handler

    /****************************************************************************/
    // Handler to render the image.
    function render_image_handler() {

        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');

        resize_height = resize_height <= 900 ? resize_height : 900;
        resize_factor = (resize_height / preview_image.naturalHeight);

        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            canvas.height = preview_image.naturalWidth * resize_factor;
            canvas.width = preview_image.naturalHeight * resize_factor;   
        }
        else {
            canvas.height = preview_image.naturalHeight * resize_factor;
            canvas.width = preview_image.naturalWidth * resize_factor;  
        }

        context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
 
        context.translate(canvas.width / 2, canvas.height / 2);
 
        if (rotate !== 0) {
            context.rotate(rotate * Math.PI / 180);
        }
 
        context.scale(flip_horizontal, flip_vertical);

        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            context.drawImage(preview_image, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
        }
        else {
            context.drawImage(preview_image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        }

    } // render_image_handler

    /****************************************************************************/
    // Handler to save the image.
    function save_image_handler() {

        /************************************************************************/
        // Render the image.
        render_image_handler();

        /************************************************************************/
        // Set the variables for the Ajax POST.
        mime_type = 'image/jpeg';
        file_extension = 'jpg';
        quality = 0.95;
        destination_url = data_url + data_uri;
        base64_data = canvas.toDataURL(mime_type, quality);

        /************************************************************************/
        // Set the Ajax options.
        var ajax_options = {
            url: destination_url,
            data:{
                persons: 'profiles',
                personid: file_name,
                base64_filename: file_name,
                base64_extension: file_extension,
                base64_mime_type: mime_type,
                base64_data: base64_data
            },
            type: 'POST', 
            cache: false,
            success: function(response_data, textStatus, jqXHR) {
                reset_filter_button.prop('disabled', true);
                save_image_button.html('Working…').prop('disabled', true);
                modal_close_button.click();
                reset_filter_handler();
            },
            error: function(jqXHR, textStatus) {
                console.log('error: ' + jqXHR.status + ' ' + textStatus + ' | ' + jqXHR.getResponseHeader('content-type'));
            },
            complete: function(jqXHR, textStatus) {
                reset_filter_button.prop('disabled', false);
                save_image_button.html('Save').prop('disabled', false);
            }
        };

        /************************************************************************/
        // Run the Ajax call.
        $.ajax(ajax_options);

    } // save_image_handler

    /****************************************************************************/
    // Handler to download the image.
    function download_image_handler() {

        /************************************************************************/
        // Render the image.
        render_image_handler();

        /************************************************************************/
        // Set the variables for the image download.
        mime_type = 'image/jpeg';
        file_extension = 'jpg';
        quality = 0.95;
        destination_url = data_url + data_uri;
        base64_data = canvas.toDataURL(mime_type, quality);

        /************************************************************************/
        // Do the actual image download.
        const link = document.createElement('a');
        link.download = file_name;
        link.href = base64_data;
        link.click();

    } // download_image_handler

    /****************************************************************************/
    // Handler to reset the filters.
    function reset_filter_handler() {

        /************************************************************************/
        // Reset various values.
        brightness_text.innerText = '100%';
        brightness = brightness_slider.value = 100;

        contrast_text.innerText = '100%';
        contrast = contrast_slider.value = 100;

        saturation_text.innerText = '100%';
        saturation = saturation_slider.value = 100;

        blur_text.innerText = '0px';
        blur = blur_slider.value = 0;

        rotate = 0;

        flip_horizontal = 1;
        flip_vertical = 1;

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // reset_filter_handler

 
    /****************************************************************************/
    // Set the listeners for the sliders.
    brightness_slider.addEventListener('input', update_filter_values_handler);
    contrast_slider.addEventListener('input', update_filter_values_handler);
    saturation_slider.addEventListener('input', update_filter_values_handler);
    blur_slider.addEventListener('input', update_filter_values_handler);

    /****************************************************************************/
    // Set the listeners for the rotation buttons.
    rotate_left_button.on('click', _.debounce(rotate_left_handler, general_debounce));
    rotate_right_button.on('click', _.debounce(rotate_right_handler, general_debounce));
    flip_horizontal_button.on('click', _.debounce(flip_horizontal_handler, general_debounce));
    flip_vertical_button.on('click', _.debounce(flip_vertical_handler, general_debounce));

    /****************************************************************************/
    // Set the listeners for the buttons.
    save_image_button.on('click', _.debounce(save_image_handler, general_debounce));
    download_image_button.on('click', _.debounce(download_image_handler, general_debounce));
    reset_filter_button.on('click', _.debounce(reset_filter_handler, general_debounce));

    window.addEventListener('load', init_image_handler);

  }); // $(document).ready

})(jQuery);