function FrameBuffer(gl, width, height){
  this.id = gl.createFramebuffer();
  this.use(gl);
  this.createTexture(gl, width, height);
  this.createRenderBuffer(gl, width, height);

  var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status != gl.FRAMEBUFFER_COMPLETE)
    console.error(status);
  this.unuse(gl);
}

FrameBuffer.prototype.createTexture = function(gl, width, height){
  this.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
}

FrameBuffer.prototype.createRenderBuffer = function(gl, width, height){
  this.renderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);
}

FrameBuffer.prototype.use = function(gl){
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
}

FrameBuffer.prototype.unuse = function(gl){
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

FrameBuffer.prototype.clear = function(gl){
  gl.deleteFramebuffer(this.id);
  gl.deleteTexture(this.texture);
  gl.deleteRenderbuffer(this.renderBuffer);
}
