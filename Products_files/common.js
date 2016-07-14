function getURLVar(key) {
  var value = [];

  var query = String(document.location).split('?');

  if (query[1]) {
    var part = query[1].split('&');

    for (i = 0; i < part.length; i++) {
      var data = part[i].split('=');

      if (data[0] && data[1]) {
        value[data[0]] = data[1];
      }
    }

    if (value[key]) {
      return value[key];
    } else {
      return '';
    }
  }
}

$(document).ready(function() {
  //Form Submit for IE Browser
  $('button[type=\'submit\']').on('click', function() {
    $("form[id*='form-']").submit();
  });

  // Highlight any found errors
  $('.text-danger').each(function() {
    var element = $(this).parent().parent();

    if (element.hasClass('form-group')) {
      element.addClass('has-error');
    }
  });

  // Set last page opened on the menu
  $('#menu a[href]').on('click', function() {
    sessionStorage.setItem('menu', $(this).attr('href'));
  });

  if (!sessionStorage.getItem('menu')) {
    $('#menu #dashboard').addClass('active');
  } else {
    // Sets active and open to selected page in the left column menu.
    $('#menu a[href=\'' + sessionStorage.getItem('menu') + '\']').parents('li').addClass('active open');
  }

  if (localStorage.getItem('column-left') == 'active') {
    $('#button-menu i').replaceWith('<i class="fa fa-dedent fa-lg"></i>');

    $('#column-left').addClass('active');

    // Slide Down Menu
    $('#menu li.active').has('ul').children('ul').addClass('collapse in');
    $('#menu li').not('.active').has('ul').children('ul').addClass('collapse');
  } else {
    $('#button-menu i').replaceWith('<i class="fa fa-indent fa-lg"></i>');

    $('#menu li li.active').has('ul').children('ul').addClass('collapse in');
    $('#menu li li').not('.active').has('ul').children('ul').addClass('collapse');
  }

  // Menu button
  $('#button-menu').on('click', function() {
    // Checks if the left column is active or not.
    if ($('#column-left').hasClass('active')) {
      localStorage.setItem('column-left', '');

      $('#button-menu i').replaceWith('<i class="fa fa-indent fa-lg"></i>');

      $('#column-left').removeClass('active');

      $('#menu > li > ul').removeClass('in collapse');
      $('#menu > li > ul').removeAttr('style');
    } else {
      localStorage.setItem('column-left', 'active');

      $('#button-menu i').replaceWith('<i class="fa fa-dedent fa-lg"></i>');

      $('#column-left').addClass('active');

      // Add the slide down to open menu items
      $('#menu li.open').has('ul').children('ul').addClass('collapse in');
      $('#menu li').not('.open').has('ul').children('ul').addClass('collapse');
    }
  });

  // Menu
  $('#menu').find('li').has('ul').children('a').on('click', function() {
    if ($('#column-left').hasClass('active')) {
      $(this).parent('li').toggleClass('open').children('ul').collapse('toggle');
      $(this).parent('li').siblings().removeClass('open').children('ul.in').collapse('hide');
    } else if (!$(this).parent().parent().is('#menu')) {
      $(this).parent('li').toggleClass('open').children('ul').collapse('toggle');
      $(this).parent('li').siblings().removeClass('open').children('ul.in').collapse('hide');
    }
  });

  // Override summernotes image manager
  $('button[data-event=\'showImageDialog\']').attr('data-toggle', 'image').removeAttr('data-event');

  $(document).delegate('button[data-toggle=\'image\']', 'click', function() {
    $('#modal-image').remove();

    $(this).parents('.note-editor').find('.note-editable').focus();

    $.ajax({
      url: 'index.php?route=common/filemanager&token=' + getURLVar('token'),
      dataType: 'html',
      beforeSend: function() {
        $('#button-image i').replaceWith('<i class="fa fa-circle-o-notch fa-spin"></i>');
        $('#button-image').prop('disabled', true);
      },
      complete: function() {
        $('#button-image i').replaceWith('<i class="fa fa-upload"></i>');
        $('#button-image').prop('disabled', false);
      },
      success: function(html) {
        $('body').append('<div id="modal-image" class="modal">' + html + '</div>');

        $('#modal-image').modal('show');
      }
    });
  });


  /*carga directa de imagenes */

  $(document).on('click', 'a[data-toggle=\'image-direct\']', function(event) {
    event.preventDefault();
    $(this).siblings('input[type=file]').trigger('click');
  });

  $(document).on('change', 'input[data-toggle=\'image-direct-input\']', function(event) {
    var canvas = $(this).siblings('a').children('canvas').get(0);
    var ctx = canvas.getContext('2d');
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img,0,0);

        }
        img.src = event.target.result;
    }
    if (event.target.files[0]){
      reader.readAsDataURL(event.target.files[0]);
      $(canvas).removeClass('hide').siblings('img').hide();
    }else{
      $(canvas).addClass('hide').siblings('img').show();
    }
  });


  // Image Manager
  $(document).delegate('a[data-toggle=\'image\']', 'click', function(e) {
    e.preventDefault();

    $('.popover').popover('hide', function() {
      $('.popover').remove();
    });

    var element = this;

    $(element).popover({
      html: true,
      placement: 'right',
      trigger: 'manual',
      content: function() {
        return '<button type="button" id="button-image" class="btn btn-primary"><i class="fa fa-pencil"></i></button>    <button type="button" id="button-clear" class="btn btn-danger"><i class="fa fa-trash-o"></i></button>';
      }
    });

    $(element).popover('show');

    $('#button-image').on('click', function() {
      $('#modal-image').remove();

      $.ajax({
        url: 'index.php?route=common/filemanager&token=' + getURLVar('token') + '&target=' + $(element).parent().find('input').attr('id') + '&thumb=' + $(element).attr('id'),
        dataType: 'html',
        beforeSend: function() {
          $('#button-image i').replaceWith('<i class="fa fa-circle-o-notch fa-spin"></i>');
          $('#button-image').prop('disabled', true);
        },
        complete: function() {
          $('#button-image i').replaceWith('<i class="fa fa-pencil"></i>');
          $('#button-image').prop('disabled', false);
        },
        success: function(html) {
          $('body').append('<div id="modal-image" class="modal">' + html + '</div>');

          $('#modal-image').modal('show');
        }
      });

      $(element).popover('hide', function() {
        $('.popover').remove();
      });
    });

    $('#button-clear').on('click', function() {
      $(element).find('img').attr('src', $(element).find('img').attr('data-placeholder'));

      $(element).parent().find('input').attr('value', '');

      $(element).popover('hide', function() {
        $('.popover').remove();
      });
    });


    // carga directa
    /*
    $('#button-upload-direct').on('click', function () {
      $('#form-upload-direct').remove();

      $('body').prepend('<form enctype="multipart/form-data" id="form-upload-direct" style="display: none;"><input type="file" name="file" value="" /></form>');

      $('#form-upload-direct input[name=\'file\']').trigger('click');

      if (typeof timer != 'undefined') {
        clearInterval(timer);
      }

      timer = setInterval(function () {
        if ($('#form-upload-direct input[name=\'file\']').val() != '') {
          clearInterval(timer);

          $.ajax({
            url: 'index.php?route=common/filemanager/upload&token=<?php echo $token; ?>&directory=<?php echo $directory; ?>',
            type: 'post',
            dataType: 'json',
            data: new FormData($('#form-upload-direct')[0]),
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
              $('#button-upload-direct i').replaceWith('<i class="fa fa-circle-o-notch fa-spin"></i>');
              $('#button-upload-direct').prop('disabled', true);
            },
            complete: function () {
              $('#button-upload-direct i').replaceWith('<i class="fa fa-upload"></i>');
              $('#button-upload-direct').prop('disabled', false);
            },
            success: function (json) {
              if (json['error']) {
                alert(json['error']);
              }

              if (json['success']) {
                alert(json['success']);

                $('#button-refresh').trigger('click');
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
          });
        }
      }, 500);
    });
    */

  });


  // tooltips on hover
  $('[data-toggle=\'tooltip\']').tooltip({container: 'body', html: true});

  // Makes tooltips work on ajax generated content
  $(document).ajaxStop(function() {
    $('[data-toggle=\'tooltip\']').tooltip({container: 'body'});
  });

  // https://github.com/opencart/opencart/issues/2595
  $.event.special.remove = {
    remove: function(o) {
      if (o.handler) {
        o.handler.apply(this, arguments);
      }
    }
  }

  $('[data-toggle=\'tooltip\']').on('remove', function() {
    $(this).tooltip('destroy');
  });
});

// Autocomplete */
(function($) {
  $.fn.autocomplete = function(option) {
    return this.each(function() {
      this.timer = null;
      this.items = new Array();

      $.extend(this, option);

      $(this).attr('autocomplete', 'off');

      // Focus
      $(this).on('focus', function() {
        this.request();
      });

      // Blur
      $(this).on('blur', function() {
        setTimeout(function(object) {
          object.hide();
        }, 200, this);
      });

      // Keydown
      $(this).on('keydown', function(event) {
        switch(event.keyCode) {
          case 27: // escape
            this.hide();
            break;
          default:
            this.request();
            break;
        }
      });

      // Click
      this.click = function(event) {
        event.preventDefault();

        value = $(event.target).parent().attr('data-value');

        if (value && this.items[value]) {
          this.select(this.items[value]);
        }
      }

      // Show
      this.show = function() {
        var pos = $(this).position();

        $(this).siblings('ul.dropdown-menu').css({
          top: pos.top + $(this).outerHeight(),
          left: pos.left
        });

        $(this).siblings('ul.dropdown-menu').show();
      }

      // Hide
      this.hide = function() {
        $(this).siblings('ul.dropdown-menu').hide();
      }

      // Request
      this.request = function() {
        clearTimeout(this.timer);

        this.timer = setTimeout(function(object) {
          object.source($(object).val(), $.proxy(object.response, object));
        }, 200, this);
      }

      // Response
      this.response = function(json) {
        html = '';

        if (json.length) {
          for (i = 0; i < json.length; i++) {
            this.items[json[i]['value']] = json[i];
          }

          for (i = 0; i < json.length; i++) {
            if (!json[i]['category']) {
              html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
            }
          }

          // Get all the ones with a categories
          var category = new Array();

          for (i = 0; i < json.length; i++) {
            if (json[i]['category']) {
              if (!category[json[i]['category']]) {
                category[json[i]['category']] = new Array();
                category[json[i]['category']]['name'] = json[i]['category'];
                category[json[i]['category']]['item'] = new Array();
              }

              category[json[i]['category']]['item'].push(json[i]);
            }
          }

          for (i in category) {
            html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

            for (j = 0; j < category[i]['item'].length; j++) {
              html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
            }
          }
        }

        if (html) {
          this.show();
        } else {
          this.hide();
        }

        $(this).siblings('ul.dropdown-menu').html(html);
      }

      $(this).after('<ul class="dropdown-menu"></ul>');
      $(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

    });
  }
})(window.jQuery);

/* agregar productos relacionados */
(function(global){
  'use strict';
  global.rel = {
    lastJSON:null,
    baseURLImg:null,
    loadFilter: function (element, event) {
      event.preventDefault();
      var $element = $(element).parent();
      if ($element.parent().parent().hasClass('wait')) return;

      var tienda = $(element.form.empresa_id).find(':selected').data('codigo');
      var catalogo = $(element.form.catalogo_id).find(':selected').data('codigo');
      if (!tienda || !catalogo) {
        alert('Previemnte debe seleccionar una EMPRESA y un CATALOGO');
        return;
      }

      $element.parent().parent().addClass('wait');
      $('#result-items').empty();
      $.ajax({
        url: $element.data('action'),
        jsonp: "callback",
        dataType: "jsonp",
        data: {
          api_key: "e87c6238338b72e531485b7d2a5fe4d3",
          format: "json",
          tienda: tienda,//"saga-falabella",
          catalogo: catalogo,//"sandalias-calzado-accesorios",
          seccion: $('#filter-seccion').val(),
          /*source_id: $('#filter-codigo').val(),*/
          search: $('#filter-nombre').val()
        }
      }).
      done( function (data) {
        var json = rel.lastJSON = JSON.parse(data);
        rel.baseURLImg = $element.data('src');
        var html = '';
        for(var id in json.data) {
          json.data[id].media_image = JSON.parse(json.data[id].media_image);
          var item = json.data[id];
          html += '<li id="prod-resul-' + item.source_id +'"><a href="' + item.url +'" target="_blank"><img src="' + rel.baseURLImg + item.media_image.web.portada.img + '" alt="' + item.title + '"><span class="name">' + item.title  + '</span></a><span class="glyphicon glyphicon-plus" onclick="rel.addItem(this, event, ' + item.source_id + ')"></span></li>'
        }
        $element.parent().parent().removeClass('wait');
        $('#result-items').append(html);
      }).fail(function () {
        alert('No se encontraron cohicidencias');
        $element.parent().parent().removeClass('wait');
      });
    },
    addItem: function (element, event, id){
      event.preventDefault();
      var item = rel.lastJSON.data[id];
      if ($('#prod-select-'+id).length==0) $('#add-more').before('<li id="prod-select-' + id + '" ><input type="hidden" name="product_related[]" value="' + id +'"><a href="' + item.url +'" target="_blank"><img src="' + rel.baseURLImg + item.media_image.web.portada.img + '" alt="' + item.title + '"><span class="name">' + item.title  + '</span></a><span class="glyphicon glyphicon-remove" onclick="rel.removeItem(this, event, ' + item.source_id + ')"></span></li>');
      $(element).parent().slideUp('fast');
    },
    removeItem: function (element, event, id){
      event.preventDefault();
      $(element).parent().remove();
      $('#prod-resul-'+id).slideDown('fast');
    },
    showFilter: function (element, event){
      event.preventDefault();
      var $this = $(element);
      $this.parent().hide();
      $('#filter-box').show();
    },
    hideFilter: function (element, event){
      event.preventDefault();
      var $this = $(element);
      $this.parent().parent().hide();
      $('#add-more').show();
    },
  }

})(window);
