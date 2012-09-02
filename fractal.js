$(document).ready(function() {
  if (!Julia.prototype.canvasSupported) {
    var message = "You'll need a browser that supports HTML canvas for this demo";
    alert(message);
    return;
  }

  var buildData = function(el) {
    var $el = $(el);
    return {
      top: $el.offset().top,
      left: $el.offset().left,
      max: +$el.data('max'),
      min: +$el.data('min'),
      step: +$el.data('step'),
      base: +$el.data('base')
    };
  };

  var onInputFocus = function() {
    var $el = $(this),
        data = buildData(this);

    $('.scrubber')
      .css({top: data.top - 20, left: data.left + 9})
      .draggable({
        axis: 'x',
        containment: [
          data.left + data.min / data.step, 0,
          data.left + data.max / data.step, 0
        ]
      })
      .show()
      .on('drag', function() {
        var delta = (data.left - $(this).offset().left) * -data.step;
        $el.val(Math.round((data.base + delta) * 10) / 10);
      })
      .on('dragstop', function() {
        $el.trigger('change');
      });
  };

  $('input').on('change', function() {
    var loader = $(this).parents('.fractal').find('.loading'),
        id = $(this).parents('.controls').data('for'),
        fractal = $('canvas#' + id).data('julia'),
        val = +this.value,
        data = buildData(this);
    if (isNaN(val) || val < data.min) this.value = data.base;
    loader.show();
    fractal.options[$(this).attr('name')] = val;
    fractal.drawQueued();
    $(this).parents('.fractal').find('.loading').show();
  });

  $('canvas').on('drawstop', function() {
    $(this).parent().find('.loading').hide();
  });

  $('input')
    .on('focus', onInputFocus)
    .on('blur', function() {
      $('.scrubber')
        .off('drag dragstop')
        .hide();
    });

  // Give the page a chance to render before the thread is blocked drawing fractals.
  setTimeout(function() {

    var f1 = new Julia(document.getElementById('fractal1'), {
      iterFunc: Julia.prototype.iterate2,
    });

    var f2 = new Julia(document.getElementById('fractal2'), {
      iterFunc: Julia.prototype.iterate3,
      colors: [
        'rgb(84,30,50)',
        'rgb(142,53,87)',
        'rgb(136,163,62)',
        'rgb(194,189,134)',
        'rgb(247,242,178)'
      ]
    });

    var f3 = new Julia(document.getElementById('fractal3'), {
      iterFunc: Julia.prototype.iterate4,
      colors: [
        'rgb(59,47,48)',
        'rgb(151,117,103)',
        'rgb(230,222,213)',
        'rgb(43,30,27)',
        'rgb(42,0,1)'
      ]
    });

    $('.loading').hide();

  }, 100);

});
