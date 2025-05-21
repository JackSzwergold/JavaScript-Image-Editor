jQuery.noConflict();

(function($) {

  /****************************************************************************/
  // The core 'document ready' logic.
  $(document).ready(function() {

    /**************************************************************************/
    // Set the data URL and data URI values.
    var data_url = typeof($('#BASE_URL').val()) != 'undefined' ? $('#BASE_URL').val() : '';
    var data_uri = typeof($('#BASE_URI').val()) != 'undefined' ? $('#BASE_URI').val() : '';

    /**************************************************************************/
    // Set the N Number.
    var file_name = typeof($('#N_NUMBER').val()) != 'undefined' ? $('#N_NUMBER').val() : '';

    /**************************************************************************/
    // Set the resize height and width.
    var resize_height = typeof($('#RESIZE_HEIGHT').val()) != 'undefined' ? $('#RESIZE_HEIGHT').val() : '';
    var resize_width = typeof($('#RESIZE_WIDTH').val()) != 'undefined' ? $('#RESIZE_WIDTH').val() : '';

    /**************************************************************************/
    // Select different elements.
    // var fileInput = document.querySelector('#file_input');

    /**************************************************************************/
    // The slider text values.
    var brightness_text = document.querySelector('#brightness_slider label span');
    var contrast_text = document.querySelector('#contrast_slider label span');
    var saturation_text = document.querySelector('#saturation_slider label span');
    var tint_text = document.querySelector('#tint_slider label span');
    var blur_text = document.querySelector('#blur_slider label span');

    /**************************************************************************/
    // The slider input items.
    var brightness_slider = document.querySelector('#brightness_slider input');
    var contrast_slider = document.querySelector('#contrast_slider input');
    var saturation_slider = document.querySelector('#saturation_slider input');
    var tint_slider = document.querySelector('#tint_slider input');
    var blur_slider = document.querySelector('#blur_slider input');

    /**************************************************************************/
    // The image to edit itself.
    var image_to_edit = document.querySelector('#image_to_edit');
    var original_image = document.querySelector('#image_to_edit').src;

    /**************************************************************************/
    // The crop selection area.
    var crop_selection = $('#crop_selection');

    /**************************************************************************/
    // The crop selection button.
    var crop_selection_button = $('#crop_selection_button');

    /**************************************************************************/
    // The rotation buttons.
    var rotate_left_button = $('#rotate_left');
    var rotate_right_button = $('#rotate_right');
    var flip_horizontal_button = $('#flip_horizontal');
    var flip_vertical_button = $('#flip_vertical');

    /**************************************************************************/
    // The main buttons.
    var reset_filter_button = $('#reset_filter');
    var download_image_button = $('#download_image');
    var save_image_button = $('#save_image');
    var modal_close_button = $('#modal_close');

    /**************************************************************************/
    // The upload image related buttons.
    // var file_input_field = $("#file_input");
    var file_input_field = document.querySelector("#file_input");
    var upload_image_button = $("#upload_image");
    var restore_original_button = $("#restore_original");

    /**************************************************************************/
    // The save and reset button related stuff.
    var save_text = $('#save_text');
    var save_spinner = $('#save_spinner');
    var restore_original_text = $('#restore_original_text');
    var restore_original_spinner = $('#restore_original_spinner');
    var upload_image_text = $('#upload_image_text');
    var upload_image_spinner = $('#upload_image_spinner');
    var reset_text = $('#reset_text');
    var reset_spinner = $('#reset_spinner');

    /**************************************************************************/
    // Initial control values.
    var brightness = 100;
    var contrast = 100;
    var saturation = 100;
    var tint = 0;
    var blur = 0;
    var rotate = 0;
    var flip_horizontal = 1;
    var flip_vertical = 1;

    /**************************************************************************/
    // Set the debounce value in milliseconds.
    var general_debounce = 50;

    /**************************************************************************/
    // Handler for the upload image.
    function upload_image_handler() {
        file_input_field.click();
    } // upload_image_handler

    /**************************************************************************/
    // Handler to load the file.
    function load_file_handler() {
        var file = file_input_field.files[0];
        if (!file) {
            return;
        }
        image_to_edit.src = URL.createObjectURL(file);
        restore_original_button.prop('disabled', false);
    } // load_file_handler

    /**************************************************************************/
    // Handler to restore the original image.
    function restore_original_handler() {
        reset_filter_handler();
        image_to_edit.src = original_image;
        restore_original_button.prop('disabled', true);
    } // restore_original_handler

    /**************************************************************************/
    // Handler to apply the filters.
    function apply_filter_handler() {

        /**********************************************************************/
        // Set the filters.
        image_to_edit.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${tint}deg) blur(${blur}px)`;
        image_to_edit.style.transform = `rotate(${rotate}deg) scale(${flip_horizontal}, ${flip_vertical})`;

        /**********************************************************************/
        // Enabled or disable the crop selection stuff based on rotation.
        if (image_to_edit.width != image_to_edit.height) {
          if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            disable_crop_selection();
            crop_selection_button.prop('disabled', true);
          } // if
          else {
            crop_selection_button.prop('disabled', false);
          } // else
        } // if

    } // apply_filter_handler

    /**************************************************************************/
    // Handler to update the filters.
    function update_filter_values_handler() {

        brightness_text.innerText = `${brightness_slider.value}%`;
        contrast_text.innerText = `${contrast_slider.value}%`;
        saturation_text.innerText = `${saturation_slider.value}%`;
        tint_text.innerText = `${tint_slider.value}deg`;
        blur_text.innerText = `${blur_slider.value}px`;

        brightness = Math.floor(brightness_slider.value);
        contrast = Math.floor(contrast_slider.value);
        saturation = Math.floor(saturation_slider.value);
        tint = Math.floor(tint_slider.value);
        blur = Math.floor(blur_slider.value);

        /**********************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // update_filter_values_handler

    /**************************************************************************/
    // Handler to rotate left.
    function rotate_left_handler() {

        /**********************************************************************/
        // Do it.
        if (rotate == -270) {
            rotate = 0;
        } // if
        else {
            rotate -= 90;
        } // else

        /**********************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // rotate_left_handler

    /**************************************************************************/
    // Handler to rotate right.
    function rotate_right_handler() {

        /**********************************************************************/
        // Do it.
        if (rotate == 270) {
            rotate = 0;
        } // if
        else {
            rotate += 90;
        } // else

        /**********************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // rotate_left_handler

    /**************************************************************************/
    // Handler to flip horizontal.
    function flip_horizontal_handler() {

        /**********************************************************************/
        // Do it.
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            flip_vertical = flip_vertical === 1 ? -1 : 1;
        } // if
        else {
            flip_horizontal = flip_horizontal === 1 ? -1 : 1;    
        } // else

        /**********************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // flip_horizontal_handler

    /**************************************************************************/
    // Handler to flip vertical.
    function flip_vertical_handler() {

        /**********************************************************************/
        // Do it.
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            flip_horizontal = flip_horizontal === 1 ? -1 : 1;
        } // if
        else {
            flip_vertical = flip_vertical === 1 ? -1 : 1; 
        } // else

        /**********************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // flip_vertical_handler

    /**************************************************************************/
    // Handler to render the image.
    function render_image_handler() {

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        /**********************************************************************/
        // Set a top limit for the resize width and resize height.
        resize_width = resize_width > 900 ? 900 : resize_width;
        resize_height = resize_height > 900 ? 900 : resize_height;

        /**********************************************************************/
        // Calculate the resize and cropping ratios.
        var resize_ratio = 1;
        var cropping_ratio = 1;
        if (image_to_edit.naturalWidth > image_to_edit.naturalHeight) {
            resize_ratio = (resize_width / image_to_edit.naturalWidth);
            cropping_ratio = (resize_width / image_to_edit.width);
        } // if
        else {
            resize_ratio = (resize_height / image_to_edit.naturalHeight);
            cropping_ratio = (resize_height / image_to_edit.height);
        } // else

        /**********************************************************************/
        // Apply the resize ratios.
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            canvas.width = image_to_edit.naturalHeight * resize_ratio;
            canvas.height = image_to_edit.naturalWidth * resize_ratio;
        } // if
        else {
            canvas.width = image_to_edit.naturalWidth * resize_ratio;
            canvas.height = image_to_edit.naturalHeight * resize_ratio;
        } // else

        /**********************************************************************/
        // Save the context.
        context.save();

        /**********************************************************************/
        // Make color and tone adjustments to the image.
        context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${tint}deg) blur(${blur}px)`;

        /**********************************************************************/
        // Do this for the image rotation stuff.
        context.translate(canvas.width / 2, canvas.height / 2);
 
        /**********************************************************************/
        // Rotate the image.
        context.rotate(rotate * (Math.PI / 180));

        /**********************************************************************/
        // Flip the image.
        context.scale(flip_horizontal, flip_vertical);

        /**********************************************************************/
        // Rotate the image.
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            context.drawImage(image_to_edit, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
        } // if
        else {
            context.drawImage(image_to_edit, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        } // else

        /**********************************************************************/
        // Restore the context.
        context.restore();

        /**********************************************************************/
        // Pasting stuff into a new canvas for final saving,
        var canvas_save = document.createElement('canvas');
        var context_save = canvas_save.getContext('2d');

        /**********************************************************************/
        // Setting the crop selector defaults.
        var crop_x = 0;
        var crop_y = 0;
        var crop_w = canvas.width;
        var crop_h = canvas.height;
        var canvas_save_ratio = 1;

        /**********************************************************************/
        // If we have a cropping selector in place, use it.
        if (crop_selection.hasClass('show') == true) {

            /******************************************************************/
            // Set the X and Y values.
            if (typeof(crop_selection.position()) != 'undefined') {
                if (crop_selection.position().left >= 0) {
                    crop_x = Math.round(crop_selection.position().left * cropping_ratio);
                } // if
                if (crop_selection.position().top >= 0) {
                    crop_y = Math.round(crop_selection.position().top * cropping_ratio);
                } // if
            } // if

            /******************************************************************/
            // Set the width value.
            if (typeof(crop_selection.outerWidth()) != 'undefined' || crop_selection.outerWidth() > 0 ) {
                crop_w = Math.round(crop_selection.outerWidth() * cropping_ratio);
            } // if

            /******************************************************************/
            // Set the height value.
            if (typeof(crop_selection.outerHeight()) != 'undefined' || crop_selection.outerHeight() > 0 ) {
                crop_h = Math.round(crop_selection.outerHeight() * cropping_ratio);
            } // if

            /******************************************************************/
            // Calculate the canvas save ratio.
            if (crop_w > crop_h) {
                canvas_save_ratio = (resize_width / crop_w);
            } // if
            else {
                canvas_save_ratio = (resize_height / crop_h);
            } // else

        } // if

        /**********************************************************************/
        // Calculations to make sure the canvas is not larger than the content.
        crop_w = crop_w > (resize_width - crop_x) ? (resize_width - crop_x) : crop_w;
        crop_h = crop_h > (resize_height - crop_y) ? (resize_height - crop_y) : crop_h;
        if (crop_x < 0) {
            crop_w = crop_w - Math.abs(crop_x); 
            crop_x = 0;
        } // if
        if (crop_y < 0) {
            crop_h = crop_h - Math.abs(crop_y); 
            crop_y = 0;
        } // if

        /**********************************************************************/
        // Setting the target width and height.
        var source_target_x = crop_x;
        var source_target_y = crop_y;
        var source_target_w = crop_w;
        var source_target_h = crop_h;

        /**********************************************************************/
        // Setting the new canvas width and height.
        canvas_save.width = source_target_w * canvas_save_ratio;
        canvas_save.height = source_target_h * canvas_save_ratio;

        /**********************************************************************/
        // Setting source and destination coordinates.
        var source_x = source_target_x;
        var source_y = source_target_y;
        var source_w = source_target_w;
        var source_h = source_target_h;
        var dest_x = 0;
        var dest_y = 0;
        var dest_w = canvas_save.width;
        var dest_h = canvas_save.height; 

        /**********************************************************************/
        // Draw the image onto the new destination canvas.
        context_save.drawImage(canvas, source_x, source_y, source_w, source_h, dest_x, dest_y, dest_w, dest_h);

        /**********************************************************************/
        // Set the variables for the Ajax POST and download.
        mime_type = 'image/jpeg';
        file_extension = 'jpg';
        quality = 0.95;
        destination_url = data_url + data_uri;
        base64_data = canvas_save.toDataURL(mime_type, quality);

    } // render_image_handler

    /**************************************************************************/
    // Handler to save the image.
    function save_image_handler() {

        /**********************************************************************/
        // Render the image.
        render_image_handler();

        /**********************************************************************/
        // Set the Ajax options.
        var ajax_options = {
            url: destination_url,
            data: {
                persons: 'profiles',
                personid: file_name,
                base64_filename: file_name,
                base64_extension: file_extension,
                base64_mime_type: mime_type,
                base64_data: base64_data
            },
            type: 'POST', 
            cache: false,
            beforeSend: function(jqXHR, settings) {
                save_text.removeClass('d-inline-block').addClass('d-none');
                save_spinner.removeClass('d-none').addClass('d-inline-block');
                restore_original_text.removeClass('d-inline-block').addClass('d-none');
                restore_original_spinner.removeClass('d-none').addClass('d-inline-block');
                upload_image_text.removeClass('d-inline-block').addClass('d-none');
                upload_image_spinner.removeClass('d-none').addClass('d-inline-block');
                reset_text.removeClass('d-inline-block').addClass('d-none');
                reset_spinner.removeClass('d-none').addClass('d-inline-block');
                reset_filter_button.prop('disabled', true);
                save_image_button.prop('disabled', true);
            },
            success: function(response_data, textStatus, jqXHR) {
                save_text.removeClass('d-none').addClass('d-inline-block');
                save_spinner.removeClass('d-inline-block').addClass('d-none');
                restore_original_text.removeClass('d-none').addClass('d-inline-block');
                restore_original_spinner.removeClass('d-inline-block').addClass('d-none');
                upload_image_text.removeClass('d-none').addClass('d-inline-block');
                upload_image_spinner.removeClass('d-inline-block').addClass('d-none');
                reset_text.removeClass('d-none').addClass('d-inline-block');
                reset_spinner.removeClass('d-inline-block').addClass('d-none');
                reset_filter_button.prop('disabled', false);
                save_image_button.prop('disabled', false);
                modal_close_button.click();
                reset_filter_handler();
            },
            error: function(jqXHR, textStatus) {
                console.log('error: ' + jqXHR.status + ' ' + textStatus + ' | ' + jqXHR.getResponseHeader('content-type'));
            }
        };

        /**********************************************************************/
        // Run the Ajax call.
        $.ajax(ajax_options);

    } // save_image_handler

    /**************************************************************************/
    // Handler to download the image.
    function download_image_handler() {

        /**********************************************************************/
        // Render the image.
        render_image_handler();

        /**********************************************************************/
        // Do the actual image download.
        const link = document.createElement('a');
        link.download = file_name;
        link.href = base64_data;
        link.click();

    } // download_image_handler

    /**************************************************************************/
    // Handler to reset the filters.
    function reset_filter_handler() {

        /**********************************************************************/
        // Reset various values.
        brightness_text.innerText = '100%';
        brightness = brightness_slider.value = 100;

        contrast_text.innerText = '100%';
        contrast = contrast_slider.value = 100;

        saturation_text.innerText = '100%';
        saturation = saturation_slider.value = 100;

        tint_text.innerText = '0deg';
        tint = tint_slider.value = 0;

        blur_text.innerText = '0px';
        blur = blur_slider.value = 0;

        rotate = 0;

        flip_horizontal = 1;
        flip_vertical = 1;

        /**********************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

        /**********************************************************************/
        // Disable the crop selection.
        disable_crop_selection();

    } // reset_filter_handler

    /**************************************************************************/
    // Handler for the crop selector.
    function crop_selection_handler() {

        /**********************************************************************/
        // Toggle the crop selector.
        if (crop_selection.hasClass('hide')) {
          enable_crop_selection();
        } // if
        else {
          disable_crop_selection();
        } // else

    } // crop_selection_handler

    /**************************************************************************/
    // Enable the crop selection stuff.
    function enable_crop_selection() {

      crop_selection.removeClass('hide').addClass('show');
      crop_selection.draggable({
        containment: 'parent',
        opacity: 0.35
      });
      crop_selection.resizable({
        containment: 'parent',
        handles: 'n, e, s, w, ne, se, sw, nw',
        animate: false
      });
      crop_selection.draggable('enable');
      crop_selection.resizable('enable');
      crop_selection.css({
        'display': 'block',
        'top': '0px', 
        'left': '0px', 
        'width': Math.round(image_to_edit.width / 2) + 'px', 
        'height': Math.round(image_to_edit.height / 2) + 'px', 
        'border-color': '#cc0000', 
        'border-width': '3px', 
        'border-style': 'dashed'
      });
 
    } // enable_crop_selection

    /**************************************************************************/
    // Disable the crop selection stuff.
    function disable_crop_selection() {

      crop_selection.removeClass('show').addClass('hide');
      crop_selection.draggable();
      crop_selection.draggable('destroy');
      crop_selection.resizable();
      crop_selection.resizable('destroy');
      crop_selection.css({
        'display': 'none',
        'top': '0px', 
        'left': '0px', 
        'width': '0px', 
        'height': '0px',
        'border-width': '0px', 
        'border-style': 'none'
      });
    
    } // disable_crop_selection

    /**************************************************************************/
    // Set the listeners for the sliders.
    brightness_slider.addEventListener('input', update_filter_values_handler);
    contrast_slider.addEventListener('input', update_filter_values_handler);
    saturation_slider.addEventListener('input', update_filter_values_handler);
    tint_slider.addEventListener('input', update_filter_values_handler);
    blur_slider.addEventListener('input', update_filter_values_handler);

    /**************************************************************************/
    // Set the listeners for the rotation buttons.
    crop_selection_button.on('click', _.debounce(crop_selection_handler, general_debounce));

    /**************************************************************************/
    // Set the listeners for the rotation buttons.
    rotate_left_button.on('click', _.debounce(rotate_left_handler, general_debounce));
    rotate_right_button.on('click', _.debounce(rotate_right_handler, general_debounce));
    flip_horizontal_button.on('click', _.debounce(flip_horizontal_handler, general_debounce));
    flip_vertical_button.on('click', _.debounce(flip_vertical_handler, general_debounce));

    /**************************************************************************/
    // Set the listeners for the buttons.
    save_image_button.on('click', _.debounce(save_image_handler, general_debounce));
    download_image_button.on('click', _.debounce(download_image_handler, general_debounce));
    reset_filter_button.on('click', _.debounce(reset_filter_handler, general_debounce));

    /**************************************************************************/
    // Set the listeners for the image upload stuff buttons.
    upload_image_button.on('click', _.debounce(upload_image_handler, general_debounce));
    file_input_field.addEventListener('change', load_file_handler);
    restore_original_button.on('click', _.debounce(restore_original_handler, general_debounce));

  }); // $(document).ready

})(jQuery);