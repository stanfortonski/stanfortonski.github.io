function PostProcessing(gl, vertPostProcessShader, fragPostProccessShader, width, height){
  this.createProgramAndArrayBuffer(gl, vertPostProcessShader, fragPostProccessShader);
  this.frameBuffer = new FrameBuffer(gl, width, height);
}

PostProcessing.prototype.createProgramAndArrayBuffer = function(gl, vertPostProcessShader, fragPostProccessShader){
  this.program = createProgram(gl, vertPostProcessShader, fragPostProccessShader);

  var vertices = [
    -1, 1, 0, 1,
    -1, -1, 0, 0,
    1, -1, 1, 0,
    -1, 1, 0, 1,
    1, -1, 1, 0,
    1, 1, 1, 1
  ];

  this.arrayBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

PostProcessing.prototype.clear = function(gl){
  this.framebuffer.clear(gl);
  gl.deleteProgram(this.program);
  gl.deleteBuffer(this.arrayBuffer);
}

PostProcessing.prototype.draw = function(gl){
  gl.useProgram(this.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer);
  var aPosAttribLoc = gl.getAttribLocation(this.program, 'aPos');
  gl.vertexAttribPointer(aPosAttribLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(aPosAttribLoc);

  var aTexCoordsAttribLoc = gl.getAttribLocation(this.program, 'aTexCoords');
  gl.vertexAttribPointer(aTexCoordsAttribLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(aTexCoordsAttribLoc);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.frameBuffer.texture);
  gl.uniform1i(gl.getUniformLocation(this.program, 'screenTexture'), 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

PostProcessing.prototype.resize = function(gl, width, height){
  this.frameBuffer.clear(gl);
  this.frameBuffer = new FrameBuffer(gl, width, height);
}
