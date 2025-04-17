jQuery.noConflict();

(function($) {

  /****************************************************************************/
  // The core 'document ready' logic.
  $(document).ready(function() {

    /**************************************************************************/
    // Source: https://a402539.github.io/OCR/examples/histogram.html
    var histogram_canvas = document.getElementById('histogram');
    var histogram_context = histogram_canvas.getContext('2d');

    var histogram_type = document.getElementById('histogram_type');
    var accuracy = document.getElementById('histogram_accuracy');
    // var runtime = document.getElementById('runtime');
    var plot_style = document.getElementById('plot_style');
    var plot_fill = document.getElementById('plot_fill');
    var plot_colors = document.getElementById('plot_colors');
    // var imgSelector = document.getElementById('imgSelector');

    var preview_image = document.getElementById('image_to_edit');

    var image_canvas = document.createElement('canvas');
    var image_context = image_canvas.getContext('2d');

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
            '#f00',   // 0, Red,       0�
            '#ff0',   // 1, Yellow,   60�
            '#0f0',   // 2, Green,   120�
            '#0ff',   // 3, Cyan,    180�
            '#00f',   // 4, Blue,    240�
            '#f0f',   // 5, Magenta, 300�
            '#f00'],  // 6, Red,     360�
          'val':     ['#000', '#fff'],
          'kelvin':  ['#fff', '#000'],
          'cyan':    ['#000', '#0ff'],
          'yellow':  ['#000', '#ff0'],
          'magenta': ['#000', '#f0f']
        };
    var discreetWidth = Math.round(histogram_canvas.width / 255);
    var imageData = null;

    var initHistogram = function () {

      /**************************************************************************/
      // Set the default form values.
      accuracy_value = 10;
      plot_style_value = 'continuous';
      plot_colors_value = 'flat';
      plot_fill_value = true;
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
        plot_fill.checked = plot_fill_value;
      }
      if (histogram_type != null) {
        histogram_type.value = histogram_type_value;
      }

      var grad,
          color,
          i,
          n;

      for (grad in gradients) {
        color = colors[grad];
        grad = gradients[grad];
        for (i = 0, n = color.length; i < n; i++) {
          grad.addColorStop(i*1/(n-1), color[i]);
        }
      }

    };

    var imageLoaded = function () {
      preview_image.className = '';
      image_canvas.width = preview_image.width;
      image_canvas.height = preview_image.height;
      image_context.drawImage(preview_image, 0, 0);
      imageData = image_context.getImageData(0, 0, preview_image.width, preview_image.height).data;
      preview_image.className = 'thumb';

      updateHistogram();

    };

    var calculateHistogram = function (type) {
      var chans = [[]],
          maxCount = 0, val, subtypes = [type];

      if (type === 'rgb') {
        chans = [[], [], []];
        subtypes = ['red', 'green', 'blue'];
      }
      else if (type === 'cmyk') {
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

      for (var i = 0, n = imageData.length; i < n; i+= step) {
        if (type === 'rgb' || type === 'red' || type === 'green' || type === 
            'blue') {
          val = [imageData[i], imageData[i+1], imageData[i+2]];

        }
        else if (type === 'cmyk' || type === 'cyan' || type === 'magenta' || 
            type === 'yellow' || type === 'kelvin') {
          val = rgb2cmyk(imageData[i], imageData[i+1], imageData[i+2]);

        }
        else if (type === 'hue' || type === 'sat' || type === 'val') {
          val = rgb2hsv(imageData[i], imageData[i+1], imageData[i+2]);
        }

        if (type === 'red' || type === 'hue' || type === 'cyan') {
          val = [val[0]];
        }
        else if (type === 'green' || type === 'sat' || type === 'magenta') {
          val = [val[1]];
        }
        else if (type === 'blue' || type === 'val' || type === 'yellow') {
          val = [val[2]];
        }
        else if (type === 'kelvin') {
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

      if (plot_fill_value && chans.length > 1) {
        histogram_context.globalCompositeOperation = 'lighter';
      }

      for (var i = 0, n = chans.length; i < n; i++) {
        drawHistogram(subtypes[i], chans[i], maxCount);
      }

      if (plot_fill_value && chans.length > 1) {
        histogram_context.globalCompositeOperation = 'source-over';
      }
    };

    var rgb2hsv = function (red, green, blue) {
      red /= 255;
      green /= 255;
      blue /= 255;

      var hue, sat, val,
          min   = Math.min(red, green, blue),
          max   = Math.max(red, green, blue),
          delta = max - min,
          val   = max;

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
    };

    // Note that this is only an approximation of the CMYK color space. for proper
    // CMYK color space conversion one needs to implement support for color
    // profiles.
    var rgb2cmyk = function (red, green, blue) {
      var cyan    = 1 - red/255;
          magenta = 1 - green/255;
          yellow  = 1 - blue/255;
          black = Math.min(cyan, magenta, yellow, 1);

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
    };

    var drawHistogram = function (type, vals, maxCount) {
      var ctxStyle;

      if (plot_fill_value || plot_style_value === 'discreet') {
        ctxStyle = 'fillStyle';
        histogram_context.strokeStyle = '#000';
      }
      else {
        ctxStyle = 'strokeStyle';
      }

      if (plot_colors_value === 'flat') {
        if (type === 'hue') {
          histogram_context[ctxStyle] = gradients.hue;
        } else if (type in colors && type !== 'val') {
          histogram_context[ctxStyle] = colors[type][1];
        }
        else {
          histogram_context[ctxStyle] = '#000';
        }

      }
      else if (plot_colors_value === 'gradient') {
        if (type in gradients) {
          histogram_context[ctxStyle] = gradients[type];
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
          if (plot_fill_value) {
            histogram_context.fillRect(x, histogram_canvas.height - y, discreetWidth, y);
          }
          else {
            histogram_context.fillRect(x, histogram_canvas.height - y, discreetWidth, 2);
          }
        }
      }

      if (plot_style_value === 'continuous') {
        histogram_context.lineTo(x, histogram_canvas.height);
        if (plot_fill_value) {
          histogram_context.fill();
        }
        histogram_context.stroke();
        histogram_context.closePath();
      }
    };

    var updateHistogram = function () {
      var timeStart = (new Date()).getTime();

      // runtime.innerHTML = 'Calculating histogram...';

      calculateHistogram(histogram_type_value);

      // var timeEnd = (new Date()).getTime();
      // runtime.innerHTML = 'Plot runtime: ' + (timeEnd - timeStart) + ' ms.';
    };

    // var thumbClick = function (ev) {
    //   ev.preventDefault();

    //   if (this.className === 'thumb') {
    //     this.className = '';
    //   }
    //   else {
    //     this.className = 'thumb';
    //   }
    // };

    // preview_image.addEventListener('load', imageLoaded, false);
    // preview_image.addEventListener('click', thumbClick, false);
    // histogram_canvas.addEventListener('click', thumbClick, false);

    if (histogram_type != null) {
      histogram_type.addEventListener('change', updateHistogram, false);
    }

    if (plot_style != null) {
      plot_style.addEventListener('change', updateHistogram, false);
    }

    if (plot_fill != null) {
      plot_fill.addEventListener('change', updateHistogram, false);
    }

    if (plot_colors != null) {
      plot_colors.addEventListener('change', updateHistogram, false);
    }

    if (accuracy != null) {
      accuracy.addEventListener('change', updateHistogram, false);
    }

    initHistogram();
    imageLoaded();

  }); // $(document).ready

})(jQuery);