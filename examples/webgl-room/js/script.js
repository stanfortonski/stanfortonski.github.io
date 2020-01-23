function main(){
  gl.enable(gl.DEPTH_TEST);

  var vertShader = Engine.createShader(gl, gl.VERTEX_SHADER, App.vertexShaderSource),
      fragShader = Engine.createShader(gl, gl.FRAGMENT_SHADER, App.fragmentShaderSource),
      myProgram = Engine.createProgram(gl, vertShader, fragShader),
      myModel = new Engine.Model(gl, App.roomModel),
      matViewProjectLoc = gl.getUniformLocation(myProgram, 'viewProject');
      matModelLoc = gl.getUniformLocation(myProgram, 'model'),
      viewPosLoc = gl.getUniformLocation(myProgram, 'viewPos'),
      view = glm.mat4.create(), model = glm.mat4.create(),
      vp = glm.mat4.create(), axis = glm.vec3.create();

  glm.vec3.set(axis, 0, 1, 0);
  glm.mat4.fromRotation(model, glm.glMatrix.toRadian(180), axis);

  function loop(){
    view = App.camera.getViewMatrix();
    glm.mat4.multiply(vp, App.projection, view);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(myProgram);
    gl.uniformMatrix4fv(matViewProjectLoc, false, vp);
    gl.uniformMatrix4fv(matModelLoc, false, model);
    gl.uniform3fv(viewPosLoc, App.camera.position);
    myModel.draw(gl, myProgram);

    window.requestAnimationFrame(loop);
  }
  loop();
}
App.initApp(main);
