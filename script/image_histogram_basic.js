jQuery.noConflict();

(function($) {

  /****************************************************************************/
  // The core 'document ready' logic.
  $(document).ready(function() {

    /**************************************************************************/
    // Initial control values.
    var brightness = 100;
    var contrast = 100;
    var saturation = 100;
    var tint = 0;
    var blur = 0;

    /**************************************************************************/
    // Get the preview image.
    var image_to_edit = document.getElementById('image_to_edit');

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
          'val': ['#000', '#fff']
        };

    /**************************************************************************/
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
        } // for
      } // for

    } // initHistogram

    /**************************************************************************/
    // The init image function.
    function initImage() {

      /************************************************************************/
      // Setting the new canvas and related context.
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      /************************************************************************/
      // Setting the canvas width and height.
      canvas.width = image_to_edit.width;
      canvas.height = image_to_edit.height;

      /************************************************************************/
      // Assign the filter values.
      image_to_edit.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${tint}deg) blur(${blur}px)`;
      context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${tint}deg) blur(${blur}px)`;

      /************************************************************************/
      // Draw the image to edit onto a new canvas.
      context.drawImage(image_to_edit, 0, 0);

      /************************************************************************/
      // Get the image data.
      image_data = context.getImageData(0, 0, canvas.width, canvas.height).data;

    } // initImage

    /**************************************************************************/
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
      } // if

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

    /**************************************************************************/
    // The function to draw the histogram.
    function drawHistogram(histogram_subtype, vals, maxCount) {

      var ctxStyle;

      if (plot_fill_checked) {
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

      } // for

      if (plot_style_value === 'continuous') {
        histogram_context.lineTo(x, histogram_canvas.height);
        if (plot_fill_checked) {
          histogram_context.fill();
        } // if
        histogram_context.stroke();
        histogram_context.closePath();
      } // if

    } // drawHistogram

    /**************************************************************************/
    // Setup the histogram.
    initHistogram();
    initImage();
    calculateHistogram();

  }); // $(document).ready

})(jQuery);