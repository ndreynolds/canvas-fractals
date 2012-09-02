(function()  {

  var Julia = this.Julia = function(canvas, options) {
    if (!this.canvasSupported) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.defaults = {
      max: 2,
      a: -0.4,
      b: 0.9,
      res: 1,
      maxIter: 24,
      box: [-200, -200, 200, 200],
      iterFunc: this.iterate4,
      colors: [
        'rgb(70,127,113)',
        'rgb(255,232,122)',
        'rgb(255,202,83)',
        'rgb(255,137,59)',
        'rgb(229,39,56)'
      ]
    };
    this.options = $.extend(this.defaults, options);
    this.draw();
  };

  // Hyperbolic trig funcs for later.
  var sinh = function(x) {
    return (Math.pow(Math.E, x) - Math.pow(Math.E, -x)) / 2;
  };
  var cosh = function(x) {
    return (Math.pow(Math.E, x) + Math.pow(Math.E, -x)) / 2;
  };

  // Return the absolute value of a complex number, given in parts.
  var complexAbs = function(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  };

  $.extend(Julia.prototype, {

    canvasSupported: function() {
      var el = document.createElement('canvas');
      return !!(el.getContext && el.getContext('2d'));
    },

    // f(z) = z^2 + c
    // f(x + yi) = (x + yi)^2 + a + bi
    iterate2: function(x, y) {
      return [
        (x*x - y*y) + this.options.a,
        2*x*y + this.options.b
      ];
    },

    // f(z) = z^3 + c
    // f(x + yi) = (x + yi)^3 + a + bi
    iterate3: function(x, y) {
      return [
        (x*x*x - 3*x*y*y) + this.options.a,
        (3*x*x*y - y*y*y) + this.options.b
      ];
    },

    // f(z) = z^4 + c
    // f(x + yi) = (x + yi)^4 + a + bi
    iterate4: function(x, y) {
      var pw = Math.pow;
      return [
        (x*x*x*x - 6*x*x*y*y + y*y*y*y) + this.options.a,
        (4*x*x*x*y - 4*y*y*y*x) + this.options.b
      ];
    },

    // f(z) = c * cos(z)
    // f(x + yi) = (a + bi) * cos(x + yi)
    iterateCos: function(x, y) {
      var a = this.options.a,
          b = this.options.b,
          sin = Math.sin,
          cos = Math.cos;
      return [
        a*cos(x)*cosh(y) + b*sin(x)*sinh(y),
        -a*sin(x)*sinh(y) + b*cos(x)*cosh(x)
      ];
    },

    plot: function(x, y) {
      var inputs = [x / this.options.box[2], y / this.options.box[3]];
      var colors = this.options.colors;
      for (var i=0; i<this.options.maxIter; i++) {
        inputs = this.options.iterFunc.apply(this, inputs);
        if (complexAbs.apply(this, inputs) > this.options.max)
          break;
      }
      this.ctx.fillStyle = colors[i % colors.length];
      this.ctx.fillRect(x + 200, y + 200, 1, 1);
    },

    draw: function() {
      var box = this.options.box,
          res = this.options.res,
          xMin = box[0], yMin = box[1],
          xMax = box[2], yMax = box[3];

      $(this.canvas).data('julia', this);
      $(this.canvas).trigger('drawstart');
      this.ctx.clearRect(0, 0, xMax - xMin, yMax - yMin);
      for (var i=xMin; i<=xMax; i+=res)
        for (var j=yMin; j<=yMax; j+=res)
          this.plot(i, j);
      $(this.canvas).trigger('drawstop');
    },

    // Attempt to alleviate some of the ui-blocking from drawing.
    drawQueued: function() {
      setTimeout(this.draw.bind(this), 100);
    }
  
  });

}());
