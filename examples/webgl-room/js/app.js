glm = glMatrix;
var gl;

var App = {
  canvas: document.getElementById('canvas'),
  camera: new Engine.Camera(),
  totalLoaded: 0, toLoadAmount: 0,
  projection: glm.mat4.create(),

  loadFileText: function(file, callback){
    let self = this;
    ++this.toLoadAmount;
    $.ajax({
      url: file,
      dataType: 'text',
      success: function(text){
        callback(text);
        ++self.totalLoaded;
      }
    });
  },
  loadFileJson: function(file, callback){
    let self = this;
    ++this.toLoadAmount;
    $.ajax({
      url: file,
      dataType: 'json',
      success: function(json){
        callback(json);
        ++self.totalLoaded;
      }
    });
  },

  createGL: function(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (!(gl = this.canvas.getContext('webgl', {antialias: true}))){
      gl = this.canvas.getContext('experimental-webgl');
      if (!gl)
        console.error('Your web browser do not support WebGL.');
    }
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    glm.mat4.perspective(this.projection, glm.glMatrix.toRadian(45), this.canvas.width/this.canvas.height, 0.1, 100.0);
  },

  initEvents: function(){
    let self = this;

    $(window).resize(function(e){
      self.canvas.width = window.innerWidth;
      self.canvas.height = window.innerHeight;
      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      glm.mat4.perspective(self.projection, glm.glMatrix.toRadian(45), self.canvas.width/self.canvas.height, 0.1, 100.0);
    });

    this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
    $(this.canvas).click(function(){
      self.canvas.requestPointerLock();
    });

    $(document).on('pointerlockchange', lockChange);
    document.pointerLockElement = document.pointerLockElement || document.mozPointerLockElement;
    function lockChange(){
      if (document.pointerLockElement === self.canvas)
        document.addEventListener('mousemove', mouseMovement, false);
      else document.removeEventListener('mousemove', mouseMovement, false);
    }

    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    $(document).on('keydown', function(e){
      if ((e.keyCode || e.which) == 'Escape')
        document.exitPointerLock();
    });

    var x = 1, y = 1, lastPosX, lastPosY, firstTime = true;
    function mouseMovement(e) {
      let movementX = e.movementX || e.mozMovementX || 0,
          movementY = e.movementY || e.mozMovementY || 0;
      x += movementX;
      y += movementY;

      if (firstTime){
        lastPosX = x;
        lastPosY = y;
        firstTime = false;
      }
      self.camera.rotate(x - lastPosX, lastPosY - y);
      lastPosX = x;
      lastPosY = y;
    }
  },

  initLoad: function(callback){
    var self = this;
    this.loadFileText('shaders/vert_shader.vs', function(text){
      self.vertexShaderSource = text;
    });
    this.loadFileText('shaders/frag_shader.fs', function(text){
      self.fragmentShaderSource = text;
    });
    this.loadFileJson('objects/room.json', function(json){
      self.roomModel = json;
    });

    var timer = setInterval(function(){
      if (self.totalLoaded == self.toLoadAmount){
        callback();
        clearInterval(timer);
      }
    }, 10);
  },

  initApp: function(callback){
    this.createGL();
    this.initEvents();
    this.initLoad(callback);
  }
};
