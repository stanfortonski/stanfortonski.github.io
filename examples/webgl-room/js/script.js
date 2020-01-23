var gl, canvas;
var deltaTime = 1;
var camera = new Camera();
camera.position[0] = -0.176;
camera.position[1] = 0.369;
camera.position[2] = -0.761;
camera.direction[0] = -0.03;
camera.direction[1] = -0.1;
camera.direction[2] = 1;
camera.yaw = 90;

var postProcessing;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

function setup(){
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
  canvas.onclick = function(){
    canvas.requestPointerLock();
  };

  gl = canvas.getContext('webgl', {antialias: true});
  if (!gl)
  {
    gl = canvas.getContext('experimental-webgl');
    if (!gl)
      console.error('Brak wsparcia dla WebGL.');
  }
  gl.enable(gl.DEPTH_TEST);

  $(window).resize(function(e){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    postProcessing.resize(gl, window.innerWidth, window.innerHeight);
  });

  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  function updateCoords(){
    let coords = $('#coords');
    coords.find('.x').text(camera.position[0]);
    coords.find('.y').text(camera.position[1]);
    coords.find('.z').text(camera.position[2]);
  }

  $(document).on('keydown', function(e){
    switch (e.keyCode || e.which){
    	case 'D'.charCodeAt(0):
    	case 'd'.charCodeAt(0):
    	case 39:
    		camera.moveRight(deltaTime);
        updateCoords();
    	break;

    	case 'A'.charCodeAt(0):
    	case 'a'.charCodeAt(0):
    	case 37:
    		camera.moveLeft(deltaTime);
        updateCoords();
    	break;

    	case 'W'.charCodeAt(0):
    	case 'w'.charCodeAt(0):
    	case 38:
    		camera.moveTop(deltaTime);
        updateCoords();
    	break;

    	case 'S'.charCodeAt(0):
    	case 's'.charCodeAt(0):
    	case 40:
    		camera.moveBottom(deltaTime);
        updateCoords();
    	break;

      case "Escape":
        document.exitPointerLock();
      break;
    }
  });

  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

  function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas){
      document.addEventListener("mousemove", mouseMovement, false);
    }
    else{
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", mouseMovement, false);
    }
  }

  var x = 1, y = 1;
  var lastPosX, lastPosY, firstTime = true;
  function mouseMovement(e) {
    var movementX = e.movementX || e.mozMovementX || 0;
    var movementY = e.movementY || e.mozMovementY || 0;
    x += movementX;
    y += movementY;

    if (firstTime)
    {
      lastPosX = x;
      lastPosY = y;
      firstTime = false;
    }
    camera.rotate(x - lastPosX, lastPosY - y);
    lastPosX = x;
    lastPosY = y;
  }
}

function loading(){
  var vertSource, fragSource, postVertSource, postFragSource, objects = [];
  $.ajax({
    url: 'shaders/vert_shader.vs',
    dataType: 'text',
    success: function(text){
      vertSource = text;
    }
  });

  $.ajax({
    url: 'shaders/frag_shader.fs',
    dataType: 'text',
    success: function(text){
      fragSource = text;
    }
  });

  $.ajax({
    url: 'shaders/postprocessing.vs',
    dataType: 'text',
    success: function(text){
      postVertSource = text;
    }
  });

  $.ajax({
    url: 'shaders/postprocessing.fs',
    dataType: 'text',
    success: function(text){
      postFragSource = text;
    }
  });

  $.ajax({
    url: 'objects/room.json',
    dataType: 'json',
    success: function(json){
      objects.push(json);
      console.log(json);
    }
  });

  var timer = setInterval(function(){
    if (vertSource != undefined && fragSource != undefined && objects.length > 0){
      main(vertSource, fragSource, postVertSource, postFragSource, objects);
      clearInterval(timer);
    }
  }, 10);
}

function main(vertSource, fragSource, postVertSource, postFragSource, objects){
  var vertShader = createShader(gl, gl.VERTEX_SHADER, vertSource),
    fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource),
    postprocessVertShader = createShader(gl, gl.VERTEX_SHADER, postVertSource),
    postprocessFragShader = createShader(gl, gl.FRAGMENT_SHADER, postFragSource),
    myProgram = createProgram(gl, vertShader, fragShader),
    myModel = new Model(gl, objects[0]),
    matViewProjectLoc = gl.getUniformLocation(myProgram, 'viewProject');
    matModelLoc = gl.getUniformLocation(myProgram, 'model'),
    viewPosLoc = gl.getUniformLocation(myProgram, 'viewPos');
  postProcessing = new PostProcessing(gl, postprocessVertShader, postprocessFragShader, canvas.width, canvas.height);

  glm = glMatrix;
  var projection = glm.mat4.create(),
    view = glm.mat4.create(),
    model = glm.mat4.create(),
    vp = glm.mat4.create();

  var axis = glm.vec3.create();
  glm.vec3.set(axis, 0, 1, 0);
  glm.mat4.fromRotation(model, glm.glMatrix.toRadian(180), axis);
  glm.mat4.perspective(projection, glm.glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);




  var lastFrame, end = false;
  function loop(){
    var currentFrame = new Date().getTime();
    deltaTime = currentFrame - lastFrame;
    lastFrame = currentFrame;

    view = camera.getViewMatrix();
    glm.mat4.multiply(vp, projection, view);

    //postProcessing.frameBuffer.use(gl);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(myProgram);
    gl.uniformMatrix4fv(matViewProjectLoc, false, vp);
    gl.uniformMatrix4fv(matModelLoc, false, model);
    gl.uniform3fv(viewPosLoc, camera.position);
    myModel.draw(gl, myProgram);

    /*postProcessing.frameBuffer.unuse(gl);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    postProcessing.draw(gl);*/

    if (!end){
      window.requestAnimationFrame(loop);
    }
    else {
      gl.deleteProgram(myProgram);
      myModel.clear(gl);
      postProcessing.clear(gl);
    }
  }
  loop();
}
setup();
loading();
