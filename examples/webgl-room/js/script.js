App.main = function(){
  var vertShader = Engine.createShader(gl, gl.VERTEX_SHADER, App.loading.loaded.vertexShaderSource),
  fragShader = Engine.createShader(gl, gl.FRAGMENT_SHADER, App.loading.loaded.fragmentShaderSource),
  depthVertShader = Engine.createShader(gl, gl.VERTEX_SHADER, App.loading.loaded.depthVertexShaderSource),
  depthFragShader = Engine.createShader(gl, gl.FRAGMENT_SHADER, App.loading.loaded.depthFragmentShaderSource);

  App.program = Engine.createProgram(gl, vertShader, fragShader);
  App.depthProgram = Engine.createProgram(gl, depthVertShader, depthFragShader);
  App.roomModel = new Engine.Model(gl, App.loading.loaded.roomModel);
  App.view = glm.mat4.create();
  App.model = glm.mat4.create();
  App.vp = glm.mat4.create();
  App.lightPos = glm.vec3.fromValues(0.011, 1.7, 0.003);
  App.lightColor = glm.vec3.fromValues(0.75, 0.75, 0.75);

  App.uniforms = {
    program:{
      viewProject: gl.getUniformLocation(App.program, 'viewProject'),
      model: gl.getUniformLocation(App.program, 'model'),
      viewPos: gl.getUniformLocation(App.program, 'viewPos'),
      clipNearFar: gl.getUniformLocation(App.program, 'clipNearFar'),
      depthMap: gl.getUniformLocation(App.program, 'depthMap'),
      lightColor: gl.getUniformLocation(App.program, 'lightColor'),
      lightPos: gl.getUniformLocation(App.program, 'lightPos'),
      shadowSamples: gl.getUniformLocation(App.program, 'shadowSamples'),
    },

    depthProgram: {
      viewProject: gl.getUniformLocation(App.depthProgram, 'viewProject'),
      model: gl.getUniformLocation(App.depthProgram, 'model'),
      clipNearFar: gl.getUniformLocation(App.depthProgram, 'clipNearFar'),
      lightPos: gl.getUniformLocation(App.depthProgram, 'lightPos')
    }
  };

  App.createShadowMap();
  function loop(){
    App.generateShadowMap();
    App.renderScene();
    window.requestAnimationFrame(loop);
  }
  loop();
}

App.renderScene = function(){
  gl.useProgram(App.program);

  let view = App.camera.getViewMatrix();
  glm.mat4.multiply(App.vp, App.config.projection, view);

  gl.viewport(0, 0, App.canvas.width, App.canvas.height);
  gl.disable(gl.DEPTH_BUFFER);
  gl.disable(gl.CULL_FACE);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniformMatrix4fv(App.uniforms.program.viewProject, false, App.vp);
  gl.uniformMatrix4fv(App.uniforms.program.model, false, App.model);
  gl.uniform3fv(App.uniforms.program.viewPos, App.camera.position);
  gl.uniform2fv(App.uniforms.program.clipNearFar, App.config.clipNearFar);
  gl.uniform3fv(App.uniforms.program.lightColor, App.lightColor);
  gl.uniform3fv(App.uniforms.program.lightPos, App.lightPos);
  gl.uniform1i(App.uniforms.program.shadowSamples, App.config.shadowSamples);
  gl.uniform1i(App.uniforms.program.depthMap, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, App.cubeMap);
  App.roomModel.draw(gl, App.program);
}

App.createShadowMap = function(){
  let projection = glm.mat4.create();
  glm.mat4.perspective(projection, glm.glMatrix.toRadian(90), 1, App.config.clipNearFar[0], App.config.clipNearFar[1]);

  function createShadowViewMat(center, up){
    let added = glm.vec3.add(glm.vec3.create(), App.lightPos, center), lookAt = glm.mat4.create();
    glm.mat4.lookAt(lookAt, App.lightPos, added, up);
    return glm.mat4.multiply(glm.mat4.create(), projection, lookAt);
  }

  App.shadowViewMatrices = [
    createShadowViewMat(glm.vec3.fromValues(1, 0, 0), glm.vec3.fromValues(0, -1, 0)),
    createShadowViewMat(glm.vec3.fromValues(-1, 0, 0), glm.vec3.fromValues(0, -1, 0)),
    createShadowViewMat(glm.vec3.fromValues(0, 1, 0), glm.vec3.fromValues(0, 0, 1)),
    createShadowViewMat(glm.vec3.fromValues(0, -1, 0), glm.vec3.fromValues(0, 0, -1)),
    createShadowViewMat(glm.vec3.fromValues(0, 0, 1), glm.vec3.fromValues(0, -1, 0)),
    createShadowViewMat(glm.vec3.fromValues(0, 0, -1), glm.vec3.fromValues(0, -1, 0)),
  ];

  App.depthFrameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, App.depthFrameBuffer);

  App.depthRenderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, App.depthRenderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, App.config.shadowResolution, App.config.shadowResolution);

  App.cubeMap = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, App.cubeMap);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
	for (let i = 0; i < 6; ++i)
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, App.config.shadowResolution, App.config.shadowResolution, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
}

App.generateShadowMap = function(){
  gl.useProgram(App.depthProgram);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, App.cubeMap);
  gl.bindFramebuffer(gl.FRAMEBUFFER, App.depthFrameBuffer);
  gl.bindRenderbuffer(gl.RENDERBUFFER, App.depthRenderBuffer);

  gl.viewport(0, 0, App.config.shadowResolution, App.config.shadowResolution);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  gl.uniformMatrix4fv(App.uniforms.depthProgram.model, false, App.model);
  gl.uniform2fv(App.uniforms.depthProgram.clipNearFar, App.config.clipNearFar);
  gl.uniform3fv(App.uniforms.depthProgram.lightPos, App.lightPos);

  for (let i = 0; i < 6; ++i){
    gl.uniformMatrix4fv(App.uniforms.depthProgram.viewProject, false, App.shadowViewMatrices[i]);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.cubeMap, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, App.depthRenderBuffer);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    App.roomModel.draw(gl, App.depthProgram);
  }

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
}
App.initApp();
