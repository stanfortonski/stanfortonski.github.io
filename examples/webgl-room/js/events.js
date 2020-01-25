App.events = {
  initMouseMovement: function(){
    var x = 1, y = 1, lastPosX, lastPosY, firstTime = true;
    function mouseMovement(e){
      let movementX = e.movementX || e.mozMovementX || 0,
          movementY = e.movementY || e.mozMovementY || 0;
      x += movementX;
      y += movementY;

      if (firstTime){
        lastPosX = x;
        lastPosY = y;
        firstTime = false;
      }
      App.camera.rotate(x - lastPosX, lastPosY - y);
      lastPosX = x;
      lastPosY = y;
    }

    App.canvas.requestPointerLock = App.canvas.requestPointerLock || App.canvas.mozRequestPointerLock;
    $(App.canvas).click(function(){
      App.canvas.requestPointerLock();
    });

    $(document).on('pointerlockchange', lockChange);
    document.pointerLockElement = document.pointerLockElement || document.mozPointerLockElement;
    function lockChange(){
      if (document.pointerLockElement === App.canvas)
        document.addEventListener('mousemove', mouseMovement, false);
      else document.removeEventListener('mousemove', mouseMovement, false);
    }

    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    $(document).on('keydown', function(e){
      if ((e.keyCode || e.which) == 'Escape')
        document.exitPointerLock();
    });
  },

  initTouchMovement: function(){
    var x = 1, y = 1;
    function touchStartMovement(e){
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }

    function touchMovement(e){
      let diffX = e.changedTouches[0].clientX - x,
          diffY = e.changedTouches[0].clientY - y;
      App.camera.rotate(-diffX, diffY);
    }
    $(App.canvas).on('touchstart', touchStartMovement).on('touchmove', touchMovement);
  },

  initSliders: function(){
    $('input[type=range]').on('input', function(){
      $(this).trigger('change');
    });

    $('#red').change(function(){
      App.lightColor[0] = parseFloat($(this).val()/100);
    });

    $('#green').change(function(){
      App.lightColor[1] = parseFloat($(this).val()/100);
    });

    $('#blue').change(function(){
      App.lightColor[2] = parseFloat($(this).val()/100);
    });

    $('#shadows').change(function(){
      App.config.shadowSamples = parseInt($(this).val());
    });
  }
};

App.initEvents = function(){
  $(window).resize(App.initWindowSize.bind(App));
  if (isMobile){
    App.camera.sensitivity = 0.02;
    App.events.initTouchMovement();
  }
  else App.events.initMouseMovement();
  App.events.initSliders();
};
