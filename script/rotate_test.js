jQuery.noConflict();

(function($) {

  /****************************************************************************/
  // The core 'document ready' logic.
  $(document).ready(function() {

    /**************************************************************************/
    // The image preview itself.
    preview_image = document.querySelector('.preview_image img');

    /**************************************************************************/
    // The crop selection area.
    crop_selection = $('#crop_selection');
    test_wrapper = $('#test_wrapper');

    /****************************************************************************/
    // Enable the crop selection stuff.
    function enable_crop_selection() {

      crop_selection.removeClass('hide').addClass('show');
      // if (crop_selection.hasClass('ui-resizable') == false) {
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
          'top': '0px', 
          'left': '0px', 
          'width': Math.round(preview_image.naturalWidth / 2) + 'px', 
          'height': Math.round(preview_image.naturalHeight / 2) + 'px', 
          'border-color': '#cc0000', 
          'border-width': '3px', 
          'border-style': 'dashed'
        });
      // }
    } // enable_crop_selection

    /****************************************************************************/
    // Disable the crop selection stuff.
    function disable_crop_selection() {

      crop_selection.removeClass('show').addClass('hide');
      // if (crop_selection.hasClass('ui-resizable') == true) {
          crop_selection.draggable();
          crop_selection.draggable('disable');
          crop_selection.resizable();
          crop_selection.resizable('disable');
          crop_selection.css({
            'top': '0px', 
            'left': '0px', 
            'width': '0px', 
            'height': '0px',
            'border-width': '0px', 
            'border-style': 'none'
          });
      // }
    
    } // disable_crop_selection

    enable_crop_selection();
    // alert(preview_image.width + ' x ' + preview_image.height);
    // $('.test_wrapper').width(preview_image.naturalHeight);
    // $('.test_wrapper').height(preview_image.naturalWidth);

  }); // $(document).ready

})(jQuery);