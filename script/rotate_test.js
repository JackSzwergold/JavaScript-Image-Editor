jQuery.noConflict();

(function($) {

  /****************************************************************************/
  // The core 'document ready' logic.
  $(document).ready(function() {

    /**************************************************************************/
    // The image preview itself.
    preview_image = document.querySelector('#image_to_edit');

    /**************************************************************************/
    // The crop selection area.
    crop_selection = $('#crop_selection');
    crop_constrainer = $('#crop_constrainer');
    test_wrapper = $('#test_wrapper');

    /****************************************************************************/
    // Enable the crop selection stuff.
    function enable_crop_selection() {

      crop_selection.removeClass('hide').addClass('show');
      // if (crop_selection.hasClass('ui-resizable') == false) {
        crop_selection.draggable({
          containment: '#crop_constrainer',
          opacity: 0.35
        });
        crop_selection.resizable({
          containment: '#crop_constrainer',
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
    // $('#crop_constrainer').width(preview_image.naturalHeight);
    // $('#crop_constrainer').height(preview_image.naturalWidth);
    $('#crop_constrainer').width(preview_image.naturalWidth);
    $('#crop_constrainer').height(preview_image.naturalHeight);

  }); // $(document).ready

})(jQuery);