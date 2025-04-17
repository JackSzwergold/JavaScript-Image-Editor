jQuery.noConflict();

(function($) {

  /****************************************************************************/
  // The core 'document ready' logic.
  $(document).ready(function() {

    /**************************************************************************/
    // Source: https://a402539.github.io/OCR/examples/histogram.html
    var histogram_canvas = document.getElementById('histogram_canvas');
    var histogram_context = histogram_canvas.getContext('2d');

    var histogram_type = document.getElementById('histogram_type');
    var accuracy = document.getElementById('histogram_accuracy');
    var plot_style = document.getElementById('plot_style');
    var plot_fill = document.getElementById('plot_fill');
    var plot_colors = document.getElementById('plot_colors');

    var preview_image = document.getElementById('image_to_edit');

    var image_canvas = document.createElement('canvas');
    var histogram_image_context = image_canvas.getContext('2d');

    var gradients = {
          'red':     histogram_context.createLinearGradient(0, 0, preview_image.width, 0),
          'green':   histogram_context.createLinearGradient(0, 0, preview_image.width, 0),
          'blue':    histogram_context.createLinearGradient(0, 0, preview_image.width, 0),
          'hue':     histogram_context.createLinearGradient(0, 0, preview_image.width, 0),
          'val':     histogram_context.createLinearGradient(0, 0, preview_image.width, 0),
          'cyan':    histogram_context.createLinearGradient(0, 0, preview_image.width, 0),
          'magenta': histogram_context.createLinearGradient(0, 0, preview_image.width, 0),
          'yellow':  histogram_context.createLinearGradient(0, 0, preview_image.width, 0),
          'kelvin':  histogram_context.createLinearGradient(0, 0, preview_image.width, 0)
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
    var histogram_image_data = null;

    /****************************************************************************/
    // The function to init the histogram.
    var initHistogram = function () {

      /**************************************************************************/
      // Set the default form values.
      accuracy_value = 10;
      plot_style_value = 'continuous';
      plot_colors_value = 'flat';
      plot_fill_checked = true;
      histogram_type_value = 'rgb';

      /**************************************************************************/
      // Set the default form values.
      if (accuracy != null) {
        accuracy.value = accuracy_value;
      }
      if (plot_style != null) {
        plot_style.value = plot_style_value;
      }
      if (plot_colors != null) {
        plot_colors.value = plot_colors_value;
      }
      if (plot_fill != null) {
        plot_fill.checked = plot_fill_checked;
      }
      if (histogram_type != null) {
        histogram_type.value = histogram_type_value;
      }

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

      image_canvas.width = preview_image.width;
      image_canvas.height = preview_image.height;

      histogram_image_context.drawImage(preview_image, 0, 0);
      histogram_image_data = histogram_image_context.getImageData(0, 0, preview_image.width, preview_image.height).data;

      update_histogram_handler();

    } // imageLoaded

    /****************************************************************************/
    // The function to calculate the histogram.
    function calculateHistogram(histogram_type_value) {

      histogram_type_value = histogram_type != null ? histogram_type.value : histogram_type_value;
      plot_style_value = plot_style != null ? plot_style.value : plot_style_value;
      plot_colors_value = plot_colors != null ? plot_colors.value : plot_colors_value;
      plot_fill_checked = plot_fill != null ? plot_fill.checked : plot_fill_checked;
      accuracy_value = accuracy != null ? accuracy.value : accuracy_value;

      var chans = [[]];
      var maxCount = 0;
      var val;
      var subtypes = [histogram_type_value];

      if (histogram_type_value === 'rgb') {
        chans = [[], [], []];
        subtypes = ['red', 'green', 'blue'];
      }
      else if (histogram_type_value === 'cmyk') {
        chans = [[], [], [], []];
        subtypes = ['cyan', 'magenta', 'yellow', 'kelvin'];
      }

      var step = parseInt(accuracy_value);
      if (isNaN(step) || step < 1) {
        step = 1;
      }
      else if (step > 50) {
        step = 50;
      }
      accuracy_value = step;
      step *= 4;

      for (var i = 0, n = histogram_image_data.length; i < n; i+= step) {
        if (histogram_type_value === 'rgb' || histogram_type_value === 'red' || histogram_type_value === 'green' || histogram_type_value === 
            'blue') {
          val = [histogram_image_data[i], histogram_image_data[i+1], histogram_image_data[i+2]];

        }
        else if (histogram_type_value === 'cmyk' || histogram_type_value === 'cyan' || histogram_type_value === 'magenta' || 
            histogram_type_value === 'yellow' || histogram_type_value === 'kelvin') {
          val = rgb2cmyk(histogram_image_data[i], histogram_image_data[i+1], histogram_image_data[i+2]);

        }
        else if (histogram_type_value === 'hue' || histogram_type_value === 'sat' || histogram_type_value === 'val') {
          val = rgb2hsv(histogram_image_data[i], histogram_image_data[i+1], histogram_image_data[i+2]);
        }

        if (histogram_type_value === 'red' || histogram_type_value === 'hue' || histogram_type_value === 'cyan') {
          val = [val[0]];
        }
        else if (histogram_type_value === 'green' || histogram_type_value === 'sat' || histogram_type_value === 'magenta') {
          val = [val[1]];
        }
        else if (histogram_type_value === 'blue' || histogram_type_value === 'val' || histogram_type_value === 'yellow') {
          val = [val[2]];
        }
        else if (histogram_type_value === 'kelvin') {
          val = [val[3]];
        }

        for (var y = 0, m = val.length; y < m; y++) {
          if (val[y] in chans[y]) {
            chans[y][val[y]]++;
          }
          else {
            chans[y][val[y]] = 1;
          }

          if (chans[y][val[y]] > maxCount) {
            maxCount = chans[y][val[y]];
          }
        }
      }

      if (maxCount === 0) {
        return;
      }

      histogram_context.clearRect(0, 0, histogram_canvas.width, histogram_canvas.height);

      if (plot_fill_checked && chans.length > 1) {
        histogram_context.globalCompositeOperation = 'lighter';
      }

      for (var i = 0, n = chans.length; i < n; i++) {
        drawHistogram(subtypes[i], chans[i], maxCount);
      }

      if (plot_fill_checked && chans.length > 1) {
        histogram_context.globalCompositeOperation = 'source-over';
      }

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
    function drawHistogram(histogram_type_value, vals, maxCount) {
      var ctxStyle;

      if (plot_fill_checked || plot_style_value === 'discreet') {
        ctxStyle = 'fillStyle';
        histogram_context.strokeStyle = '#000';
      }
      else {
        ctxStyle = 'strokeStyle';
      }

      if (plot_colors_value === 'flat') {
        if (histogram_type_value === 'hue') {
          histogram_context[ctxStyle] = gradients.hue;
        } else if (histogram_type_value in colors && histogram_type_value !== 'val') {
          histogram_context[ctxStyle] = colors[histogram_type_value][1];
        }
        else {
          histogram_context[ctxStyle] = '#000';
        }

      }
      else if (plot_colors_value === 'gradient') {
        if (histogram_type_value in gradients) {
          histogram_context[ctxStyle] = gradients[histogram_type_value];
        }
        else {
          histogram_context[ctxStyle] = '#000';
        }
      }
      else if (plot_colors_value === 'none') {
        histogram_context[ctxStyle] = '#000';
      }

      if (plot_style_value=== 'continuous') {
        histogram_context.beginPath();
        histogram_context.moveTo(0, histogram_canvas.height);
      }

      for (var x, y, i = 0; i <= 255; i++) {
        if (!(i in vals)) {
          continue;
        }

        y = Math.round((vals[i]/maxCount)*histogram_canvas.height);
        x = Math.round((i/255)*histogram_canvas.width);

        if (plot_style_value === 'continuous') {
          histogram_context.lineTo(x, histogram_canvas.height - y);
        }
        else if (plot_style_value === 'discreet') {
          if (plot_fill_checked) {
            histogram_context.fillRect(x, histogram_canvas.height - y, discreetWidth, y);
          }
          else {
            histogram_context.fillRect(x, histogram_canvas.height - y, discreetWidth, 2);
          }
        }
      }

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
    function update_histogram_handler() {
      calculateHistogram(histogram_type_value);
    } // update_histogram_handler

    /****************************************************************************/
    // The handler to update the histogram.
    if (histogram_type != null) {
      histogram_type.addEventListener('change', update_histogram_handler, false);
    }

    if (plot_style != null) {
      plot_style.addEventListener('change', update_histogram_handler, false);
    }

    if (plot_colors != null) {
      plot_colors.addEventListener('change', update_histogram_handler, false);
    }

    if (plot_fill != null) {
      plot_fill.addEventListener('change', update_histogram_handler, false);
    }

    if (accuracy != null) {
      accuracy.addEventListener('change', update_histogram_handler, false);
    }

    initHistogram();
    imageLoaded();

  }); // $(document).ready

})(jQuery);