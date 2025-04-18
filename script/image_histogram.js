jQuery.noConflict();

(function($) {

  /****************************************************************************/
  // The core 'document ready' logic.
  $(document).ready(function() {

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
    var histogram_type_value = 'rgb';
    var plot_colors_value = 'flat';
    var plot_style_value = 'continuous';
    var plot_fill_checked = true;
    var accuracy_value = 10;

    /**************************************************************************/
    // Get the preview image.
    var image_to_edit = document.getElementById('image_to_edit');

    var gradients = {
          'red': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'green': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'blue': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'hue': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'val': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'cyan': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'magenta': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'yellow': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0),
          'kelvin': histogram_context.createLinearGradient(0, 0, image_to_edit.width, 0)
        };

    var colors = {
          'red':   ['#000', '#f00'],
          'green': ['#000', '#0f0'],
          'blue':  ['#000', '#00f'],
          'hue':   [
            '#f00',   // 0, Red,       0
            '#ff0',   // 1, Yellow,   60
            '#0f0',   // 2, Green,   120
            '#0ff',   // 3, Cyan,    180
            '#00f',   // 4, Blue,    240
            '#f0f',   // 5, Magenta, 300
            '#f00'],  // 6, Red,     360
          'val':     ['#000', '#fff'],
          'kelvin':  ['#fff', '#000'],
          'cyan':    ['#000', '#0ff'],
          'yellow':  ['#000', '#ff0'],
          'magenta': ['#000', '#f0f']
        };

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
    // The image loaded function.
    function imageLoaded() {

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      canvas.width = image_to_edit.width;
      canvas.height = image_to_edit.height;

      context.drawImage(image_to_edit, 0, 0);
      image_data = context.getImageData(0, 0, image_to_edit.width, image_to_edit.height).data;

      calculateHistogram();

    } // imageLoaded

    /****************************************************************************/
    // The function to calculate the histogram.
    function calculateHistogram() {

      histogram_type_value = histogram_type_element ? histogram_type_element.value : histogram_type_value;
      plot_style_value = plot_style_element ? plot_style_element.value : plot_style_value;
      plot_colors_value = plot_colors_element ? plot_colors_element.value : plot_colors_value;
      plot_fill_checked = plot_fill_element ? plot_fill_element.checked : plot_fill_checked;
      accuracy_value = accuracy_element ? accuracy_element.value : accuracy_value;

      var chans = [[]];
      var maxCount = 0;
      var val;
      var histogram_subtypes = [histogram_type_value];

      if (histogram_type_value === 'rgb') {
        chans = [[], [], []];
        histogram_subtypes = ['red', 'green', 'blue'];
      } // if
      else if (histogram_type_value === 'cmyk') {
        chans = [[], [], [], []];
        histogram_subtypes = ['cyan', 'magenta', 'yellow', 'kelvin'];
      } // else if

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
        else if (histogram_type_value === 'cmyk' || histogram_type_value === 'cyan' || histogram_type_value === 'magenta' || 
            histogram_type_value === 'yellow' || histogram_type_value === 'kelvin') {
          val = rgb2cmyk(image_data[i], image_data[i+1], image_data[i+2]);

        } // else if
        else if (histogram_type_value === 'hue' || histogram_type_value === 'sat' || histogram_type_value === 'val') {
          val = rgb2hsv(image_data[i], image_data[i+1], image_data[i+2]);
        } // else if

        if (histogram_type_value === 'red' || histogram_type_value === 'hue' || histogram_type_value === 'cyan') {
          val = [val[0]];
        } // if
        else if (histogram_type_value === 'green' || histogram_type_value === 'sat' || histogram_type_value === 'magenta') {
          val = [val[1]];
        } // else if
        else if (histogram_type_value === 'blue' || histogram_type_value === 'val' || histogram_type_value === 'yellow') {
          val = [val[2]];
        } // else if
        else if (histogram_type_value === 'kelvin') {
          val = [val[3]];
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
    // The function to handle RGB to HSV conversion.
    function rgb2hsv(red, green, blue) {
 
      red /= 255;
      green /= 255;
      blue /= 255;

      var hue;
      var sat;
      var val;

      var min = Math.min(red, green, blue);
      var max = Math.max(red, green, blue);
      var delta = max - min;
      val  = max;

      // This is gray (red==green==blue)
      if (delta === 0) {
        hue = sat = 0;
      } else {
        sat = delta / max;

        if (max === red) {
          hue = (green -  blue) / delta;
        }
        else if (max === green) {
          hue = (blue  -   red) / delta + 2;
        }
        else if (max ===  blue) {
          hue = (red   - green) / delta + 4;
        }

        hue /= 6;
        if (hue < 0) {
          hue += 1;
        }
      }

      return [Math.round(hue*255), Math.round(sat*255), Math.round(val*255)];
 
    } // rgb2hsv

    /****************************************************************************/
    // The function to handle RGB to CMYK conversion.
    function rgb2cmyk(red, green, blue) {

      var cyan    = 1 - red/255;
      var magenta = 1 - green/255;
      var yellow  = 1 - blue/255;
      var black = Math.min(cyan, magenta, yellow, 1);

      if (black === 1) {
        cyan = magenta = yellow = 0;
      }
      else {
        var w = 1 - black;
        cyan    = (cyan    - black) / w;
        magenta = (magenta - black) / w;
        yellow  = (yellow  - black) / w;
      }

      return [Math.round(cyan*255), Math.round(magenta*255), 
             Math.round(yellow*255), Math.round(black*255)];

    } // rgb2cmyk

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
    // The handler to update the histogram.
    if (histogram_type_element != null) {
      histogram_type_element.addEventListener('change', calculateHistogram, false);
    }

    if (plot_style_element != null) {
      plot_style_element.addEventListener('change', calculateHistogram, false);
    }

    if (plot_colors_element != null) {
      plot_colors_element.addEventListener('change', calculateHistogram, false);
    }

    if (plot_fill_element != null) {
      plot_fill_element.addEventListener('change', calculateHistogram, false);
    }

    if (accuracy_element != null) {
      accuracy_element.addEventListener('change', calculateHistogram, false);
    }

    initHistogram();
    imageLoaded();

  }); // $(document).ready

})(jQuery);