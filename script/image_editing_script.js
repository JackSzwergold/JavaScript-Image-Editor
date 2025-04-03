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
    filter_value_brightness_text = document.querySelector('#slider_brightness label span');
    filter_value_contrast_text = document.querySelector('#slider_contrast label span');
    filter_value_saturation_text = document.querySelector('#slider_saturation label span');
    filter_value_blur_text = document.querySelector('#slider_blur label span');

    /**************************************************************************/
    // The slider input items.
    slider_brightness = document.querySelector('#slider_brightness input');
    slider_contrast = document.querySelector('#slider_contrast input');
    slider_saturation = document.querySelector('#slider_saturation input');
    slider_blur = document.querySelector("#slider_blur input");

    preview_image = document.querySelector('.preview_image img');

    /**************************************************************************/
    // The main buttions.
    reset_filter_button = $('#reset_filter');
    save_image_button = $('#save_image');

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
        preview_image.style.transform = `rotate(${rotate}deg) scale(${flip_horizontal}, ${flip_vertical})`;
        preview_image.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    } // apply_filter_handler

    /****************************************************************************/
    // Handler to update the filters.
    function update_filter_values_handler() {

        filter_value_brightness_text.innerText = `${slider_brightness.value}%`;
        filter_value_contrast_text.innerText = `${slider_contrast.value}%`;
        filter_value_saturation_text.innerText = `${slider_saturation.value}%`;
        filter_value_blur_text.innerText = `${slider_blur.value}px`;

        brightness = Math.floor(slider_brightness.value);
        contrast = Math.floor(slider_contrast.value);
        saturation = Math.floor(slider_saturation.value);
        blur = Math.floor(slider_blur.value);

        apply_filter_handler();

    } // reset_filter_handler

    /****************************************************************************/
    // Handler to reset the filters.
    function reset_filter_handler() {

        filter_value_brightness_text.innerText = `100%`;
        brightness = slider_brightness.value = 100;

        filter_value_contrast_text.innerText = `100%`;
        contrast = slider_contrast.value = 100;

        filter_value_saturation_text.innerText = `100%`;
        saturation = slider_saturation.value = 100;

        filter_value_blur_text.innerText = `0px`;
        blur = slider_blur.value = 0;

        rotate = 0;

        flip_horizontal = 1;
        flip_vertical = 1;

        apply_filter_handler();

    } // reset_filter_handler

    /****************************************************************************/
    // Handler to save the image.
    function save_image_handler() {

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        resize_height = resize_height <= 900 ? resize_height : 900;
        resize_factor = (resize_height / preview_image.naturalHeight);

        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            canvas.height = preview_image.naturalWidth * resize_factor;
            canvas.width = preview_image.naturalHeight * resize_factor;   
        }
        else {
            canvas.width = preview_image.naturalWidth * resize_factor;
            canvas.height = preview_image.naturalHeight * resize_factor;  
        }

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotate !== 0) {
            ctx.rotate(rotate * Math.PI / 180);
        }
        ctx.scale(flip_horizontal, flip_vertical);
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            ctx.drawImage(preview_image, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
        }
        else {
            ctx.drawImage(preview_image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        }

        // Set the variables for the Ajax POST.
        mimeType = 'image/jpeg';
        fileExtension = 'jpg';
        quality = 0.95;
        destinationURL = data_url + data_uri;
        base64_data = canvas.toDataURL(mimeType, 0.95);

        /************************************************************************/
        // Set the Ajax options.
        var ajax_options = {
            url: destinationURL,
            data:{
                persons: 'profiles',
                personid: file_name,
                base64_filename: file_name,
                base64_extension: fileExtension,
                base64_mime_type: mimeType,
                base64_data: base64_data
            },
            type: 'POST', 
            cache: false,
            success: function(response_data, textStatus, jqXHR) {
                alert('Saved!');
            },
            error: function(jqXHR, textStatus) {
                console.log('error: ' + jqXHR.status + ' ' + textStatus + ' | ' + jqXHR.getResponseHeader('content-type'));
            },
            complete: function(jqXHR, textStatus) {
            }
        };

        /************************************************************************/
        // Run the Ajax call.
        $.ajax(ajax_options);

    } // save_image_handler

    document.querySelectorAll('#rotate button').forEach(option => {

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
                flip_horizontal = flip_horizontal === 1 ? -1 : 1;
            }
            else if (option.id === 'vertical') {
                flip_vertical = flip_vertical === 1 ? -1 : 1;
            }

            apply_filter_handler();

        });
    });

    slider_brightness.addEventListener('input', update_filter_values_handler);
    slider_contrast.addEventListener('input', update_filter_values_handler);
    slider_saturation.addEventListener('input', update_filter_values_handler);
    slider_blur.addEventListener('input', update_filter_values_handler);

    reset_filter_button.on('click', _.debounce(reset_filter_handler, general_debounce));
    save_image_button.on('click', _.debounce(save_image_handler, general_debounce));

    // reset_filter_button.addEventListener('click', reset_filter_handler);
    // save_image_button.addEventListener('click', save_image_handler);

    window.addEventListener('load', init_image_handler);

  }); // $(document).ready

})(jQuery);