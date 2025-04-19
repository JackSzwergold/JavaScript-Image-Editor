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
    // The main buttions.
    var reset_filter_button = $('#reset_filter');
    var download_image_button = $('#download_image');
    var save_image_button = $('#save_image');
    var modal_close_button = $('#modal_close');

    /**************************************************************************/
    // The save and reset button related stuff.
    var save_text = $('#save_text');
    var save_spinner = $('#save_spinner');
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

    // const loadImage = () => {
    //     let file = fileInput.files[0];
    //     if (!file) return;
    //     image_to_edit.src = URL.createObjectURL(file);
    //     file_name = file.name
    //     image_to_edit.addEventListener('click', () => {
    //         reset_filter_button.click();
    //     });
    // }

    /****************************************************************************/
    // Handler to init the image.
    function init_image_handler() {
        image_to_edit.addEventListener('click', () => {
            reset_filter_button.click();
        });
    } // init_image_handler

    /****************************************************************************/
    // Handler to apply the filters.
    function apply_filter_handler() {

        image_to_edit.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${tint}deg) blur(${blur}px)`;
        image_to_edit.style.transform = `rotate(${rotate}deg) scale(${flip_horizontal}, ${flip_vertical})`;

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

    /****************************************************************************/
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
        } // if
        else {
            rotate -= 90;
        } // else

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
        } // if
        else {
            rotate += 90;
        } // else

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // rotate_left_handler

    /****************************************************************************/
    // Handler to flip horizontal.
    function flip_horizontal_handler() {

        /************************************************************************/
        // Do it.
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            flip_vertical = flip_vertical === 1 ? -1 : 1;
        } // if
        else {
            flip_horizontal = flip_horizontal === 1 ? -1 : 1;    
        } // else

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // flip_horizontal_handler

    /****************************************************************************/
    // Handler to flip vertical.
    function flip_vertical_handler() {

        /************************************************************************/
        // Do it.
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            flip_horizontal = flip_horizontal === 1 ? -1 : 1;
        } // if
        else {
            flip_vertical = flip_vertical === 1 ? -1 : 1; 
        } // else

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

    } // flip_vertical_handler

    /****************************************************************************/
    // Handler to render the image.
    function render_image_handler() {

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        /************************************************************************/
        // Set a top limit for the resize width and resize height.
        resize_width = resize_width > 900 ? 900 : resize_width;
        resize_height = resize_height > 900 ? 900 : resize_height;

        /************************************************************************/
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

        /************************************************************************/
        // Apply the resize ratios.
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            canvas.width = image_to_edit.naturalHeight * resize_ratio;
            canvas.height = image_to_edit.naturalWidth * resize_ratio;
        } // if
        else {
            canvas.width = image_to_edit.naturalWidth * resize_ratio;
            canvas.height = image_to_edit.naturalHeight * resize_ratio;
        } // else

        /************************************************************************/
        // Save the context.
        context.save();

        /************************************************************************/
        // Make color and tone adjustments to the image.
        context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${tint}deg) blur(${blur}px)`;

        /************************************************************************/
        // Do this for the image rotation stuff.
        context.translate(canvas.width / 2, canvas.height / 2);
 
        /************************************************************************/
        // Rotate the image.
        context.rotate(rotate * (Math.PI / 180));

        /************************************************************************/
        // Flip the image.
        context.scale(flip_horizontal, flip_vertical);

        /************************************************************************/
        // Rotate the image.
        if (rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
            context.drawImage(image_to_edit, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
        } // if
        else {
            context.drawImage(image_to_edit, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        } // else

        /************************************************************************/
        // Restore the context.
        context.restore();

        /************************************************************************/
        // Pasting stuff into a new canvas for final saving,
        var canvas_save = document.createElement('canvas');
        var context_save = canvas_save.getContext('2d');

        /************************************************************************/
        // Setting the crop selector defaults.
        var crop_x = 0;
        var crop_y = 0;
        var crop_w = canvas.width;
        var crop_h = canvas.height;
        var canvas_save_ratio = 1;

        /***********************************************************************/
        // If we have a cropping selector in place, use it.
        if (crop_selection.hasClass('show') == true) {

            /********************************************************************/
            // Set the X and Y values.
            if (typeof(crop_selection.position()) != 'undefined') {
                if (crop_selection.position().left >= 0) {
                    crop_x = Math.round(crop_selection.position().left * cropping_ratio);
                } // if
                if (crop_selection.position().top >= 0) {
                    crop_y = Math.round(crop_selection.position().top * cropping_ratio);
                } // if
            } // if

            /********************************************************************/
            // Set the width value.
            if (typeof(crop_selection.outerWidth()) != 'undefined' || crop_selection.outerWidth() > 0 ) {
                crop_w = Math.round(crop_selection.outerWidth() * cropping_ratio);
            } // if

            /********************************************************************/
            // Set the height value.
            if (typeof(crop_selection.outerHeight()) != 'undefined' || crop_selection.outerHeight() > 0 ) {
                crop_h = Math.round(crop_selection.outerHeight() * cropping_ratio);
            } // if

            /********************************************************************/
            // Calculate the canvas save ratio.
            if (crop_w > crop_h) {
                canvas_save_ratio = (resize_width / crop_w);
            } // if
            else {
                canvas_save_ratio = (resize_height / crop_h);
            } // else

        } // if

        /************************************************************************/
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

        /************************************************************************/
        // Setting the target width and height.
        var source_target_x = crop_x;
        var source_target_y = crop_y;
        var source_target_w = crop_w;
        var source_target_h = crop_h;

        /************************************************************************/
        // Setting the new canvas width and height.
        canvas_save.width = source_target_w * canvas_save_ratio;
        canvas_save.height = source_target_h * canvas_save_ratio;

        /************************************************************************/
        // Setting source and destination coordinates.
        var source_x = source_target_x;
        var source_y = source_target_y;
        var source_w = source_target_w;
        var source_h = source_target_h;
        var dest_x = 0;
        var dest_y = 0;
        var dest_w = canvas_save.width;
        var dest_h = canvas_save.height; 

        /************************************************************************/
        // Draw the image onto the new destination canvas.
        context_save.drawImage(canvas, source_x, source_y, source_w, source_h, dest_x, dest_y, dest_w, dest_h);

        /************************************************************************/
        // Set the variables for the Ajax POST and download.
        mime_type = 'image/jpeg';
        file_extension = 'jpg';
        quality = 0.95;
        destination_url = data_url + data_uri;
        base64_data = canvas_save.toDataURL(mime_type, quality);

    } // render_image_handler

    /****************************************************************************/
    // Handler to save the image.
    function save_image_handler() {

        /************************************************************************/
        // Render the image.
        render_image_handler();

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
            beforeSend: function(jqXHR, settings) {
                save_text.removeClass('d-inline-block').addClass('d-none');
                save_spinner.removeClass('d-none').addClass('d-inline-block');
                reset_text.removeClass('d-inline-block').addClass('d-none');
                reset_spinner.removeClass('d-none').addClass('d-inline-block');
                reset_filter_button.prop('disabled', true);
                save_image_button.prop('disabled', true);
            },
            success: function(response_data, textStatus, jqXHR) {
                save_text.removeClass('d-none').addClass('d-inline-block');
                save_spinner.removeClass('d-inline-block').addClass('d-none');
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

        tint_text.innerText = '0deg';
        tint = tint_slider.value = 0;

        blur_text.innerText = '0px';
        blur = blur_slider.value = 0;

        rotate = 0;

        flip_horizontal = 1;
        flip_vertical = 1;

        /************************************************************************/
        // Apply the filter handler.
        apply_filter_handler();

        /************************************************************************/
        // Disable the crop selection.
        disable_crop_selection();

    } // reset_filter_handler

    /****************************************************************************/
    // Handler for the crop selector.
    function crop_selection_handler() {

        /****************************************************************************/
        // Toggle the crop selector.
        if (crop_selection.hasClass('hide')) {
          enable_crop_selection();
        } // if
        else {
          disable_crop_selection();
        } // else

    } // crop_selection_handler

    /****************************************************************************/
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

    /****************************************************************************/
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
    // Source: https://a402539.github.io/OCR/examples/histogram.html
    var histogram_canvas = document.getElementById('histogram_canvas');
    var histogram_context = histogram_canvas.getContext('2d');

    /**************************************************************************/
    // Select the form elements.
    var histogram_type_element = document.getElementById('histogram_type');
    var plot_colors_element = document.getElementById('plot_colors');
    var plot_style_element = document.getElementById('plot_style');
    var plot_fill_element = document.getElementById('plot_fill');
    var accuracy_element = document.getElementById('histogram_accuracy');

    /**************************************************************************/
    // Set the default form values.
    var histogram_type_value = histogram_type_element ? histogram_type_element.value : 'rgb';
    var plot_colors_value = plot_colors_element ? plot_colors_element.value : 'flat';
    var plot_style_value = plot_style_element ? plot_style_element.value : 'continuous';
    var plot_fill_checked = plot_fill_element ? plot_fill_element.checked : true;
    var accuracy_value = accuracy_element ? accuracy_element.value : 10;

    /**************************************************************************/
    // Setting the gradient values.
    var gradients = {
          'red': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'green': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'blue': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'hue': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'val': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0)
        };

    /**************************************************************************/
    // Setting the color values.
    var colors = {
          'red': ['#000', '#f00'],
          'green': ['#000', '#0f0'],
          'blue': ['#000', '#00f'],
          'hue': [
                  '#f00', // 0, Red, 0
                  '#0f0', // 2, Green, 120
                  '#00f' // 4, Blue, 240
                 ],
          'val':     ['#000', '#fff']
        };

    /****************************************************************************/
    // Setting the discreet width.
    var discreetWidth = Math.round(histogram_canvas.width / 255);

    /****************************************************************************/
    // The function to init the histogram.
    var initHistogram = function () {

      var grad;
      var color;
      var i;
      var n;

      for (grad in gradients) {
        color = colors[grad];
        grad = gradients[grad];
        for (i = 0, n = color.length; i < n; i++) {
          grad.addColorStop(i*1/(n-1), color[i]);
        }
      }

    } // initHistogram

    /****************************************************************************/
    // The init image function.
    function initImage() {

      /**************************************************************************/
      // Setting the new canvas and related context.
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      /**************************************************************************/
      // Setting the canvas width and height.
      canvas.width = image_to_edit.width;
      canvas.height = image_to_edit.height;

      /**************************************************************************/
      // Assign the filter values.
      image_to_edit.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${tint}deg) blur(${blur}px)`;
      context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${tint}deg) blur(${blur}px)`;

      /**************************************************************************/
      // Draw the image to edit onto a new canvas.
      context.drawImage(image_to_edit, 0, 0);

      /**************************************************************************/
      // Get the image data.
      image_data = context.getImageData(0, 0, canvas.width, canvas.height).data;

    } // initImage

    /****************************************************************************/
    // The function to calculate the histogram.
    function calculateHistogram() {

      var chans = [[]];
      var maxCount = 0;
      var val;
      var histogram_subtypes = [histogram_type_value];

      if (histogram_type_value === 'rgb') {
        chans = [[], [], []];
        histogram_subtypes = ['red', 'green', 'blue'];
      } // if

      var step = parseInt(accuracy_value);
      if (isNaN(step) || step < 1) {
        step = 1;
      } // if
      else if (step > 50) {
        step = 50;
      } // else if
      accuracy_value = step;
      step *= 4;

      for (var i = 0, n = image_data.length; i < n; i+= step) {

        if (histogram_type_value === 'rgb' || histogram_type_value === 'red' || histogram_type_value === 'green' || histogram_type_value === 
            'blue') {
          val = [image_data[i], image_data[i+1], image_data[i+2]];
        } // if

        if (histogram_type_value === 'red') {
          val = [val[0]];
        } // if
        else if (histogram_type_value === 'green') {
          val = [val[1]];
        } // else if
        else if (histogram_type_value === 'blue') {
          val = [val[2]];
        } // else if

        for (var y = 0, m = val.length; y < m; y++) {
          if (val[y] in chans[y]) {
            chans[y][val[y]]++;
          } // if
          else {
            chans[y][val[y]] = 1;
          } // else

          if (chans[y][val[y]] > maxCount) {
            maxCount = chans[y][val[y]];
          } // if
        } // for
 
      } // for

      if (maxCount === 0) {
        return;
      }

      histogram_context.clearRect(0, 0, histogram_canvas.width, histogram_canvas.height);

      if (plot_fill_checked && chans.length > 1) {
        histogram_context.globalCompositeOperation = 'lighter';
      } // if

      for (var i = 0, n = chans.length; i < n; i++) {
        drawHistogram(histogram_subtypes[i], chans[i], maxCount);
      } // for

      if (plot_fill_checked && chans.length > 1) {
        histogram_context.globalCompositeOperation = 'source-over';
      } // if

    } // calculateHistogram

    /****************************************************************************/
    // The function to draw the histogram.
    function drawHistogram(histogram_subtype, vals, maxCount) {

      var ctxStyle;

      if (plot_fill_checked || plot_style_value === 'discreet') {
        ctxStyle = 'fillStyle';
        histogram_context.strokeStyle = '#000';
      } // if
      else {
        ctxStyle = 'strokeStyle';
      } // else

      if (plot_colors_value === 'flat') {
        if (histogram_subtype === 'hue') {
          histogram_context[ctxStyle] = gradients.hue;
        } // if
        else if (histogram_subtype in colors && histogram_subtype !== 'val') {
          histogram_context[ctxStyle] = colors[histogram_subtype][1];
        } // else if
        else {
          histogram_context[ctxStyle] = '#000';
        } // else
      } // if
      else if (plot_colors_value === 'gradient') {
        if (histogram_subtype in gradients) {
          histogram_context[ctxStyle] = gradients[histogram_subtype];
        } // if
        else {
          histogram_context[ctxStyle] = '#000';
        } // else
      } // else if
      else if (plot_colors_value === 'none') {
        histogram_context[ctxStyle] = '#000';
      } // else if

      if (plot_style_value=== 'continuous') {
        histogram_context.beginPath();
        histogram_context.moveTo(0, histogram_canvas.height);
      } // if

      for (var x, y, i = 0; i <= 255; i++) {
 
        if (!(i in vals)) {
          continue;
        } // if

        y = Math.round((vals[i]/maxCount)*histogram_canvas.height);
        x = Math.round((i/255)*histogram_canvas.width);

        if (plot_style_value === 'continuous') {
          histogram_context.lineTo(x, histogram_canvas.height - y);
        } // if
        else if (plot_style_value === 'discreet') {
          if (plot_fill_checked) {
            histogram_context.fillRect(x, histogram_canvas.height - y, discreetWidth, y);
          } // if
          else {
            histogram_context.fillRect(x, histogram_canvas.height - y, discreetWidth, 2);
          } // else
        } // else if
      } // for

      if (plot_style_value === 'continuous') {
        histogram_context.lineTo(x, histogram_canvas.height);
        if (plot_fill_checked) {
          histogram_context.fill();
        }
        histogram_context.stroke();
        histogram_context.closePath();
      }

    } // drawHistogram


    /****************************************************************************/
    // Set the listeners for the sliders.
    brightness_slider.addEventListener('input', update_filter_values_handler);
    contrast_slider.addEventListener('input', update_filter_values_handler);
    saturation_slider.addEventListener('input', update_filter_values_handler);
    tint_slider.addEventListener('input', update_filter_values_handler);
    blur_slider.addEventListener('input', update_filter_values_handler);

    /****************************************************************************/
    // Set the listeners for the rotation buttons.
    crop_selection_button.on('click', _.debounce(crop_selection_handler, general_debounce));

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