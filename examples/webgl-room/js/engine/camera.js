Engine.Camera = function(){
  this.position = glMatrix.vec3.create();
  glMatrix.vec3.set(this.position, 0, 0.6, 0);

  this.direction = glMatrix.vec3.create();
  glMatrix.vec3.set(this.direction, 0, 0, 1);

  this.up = glMatrix.vec3.create();
  glMatrix.vec3.set(this.up, 0, 1, 0);

  this.worldUp = glMatrix.vec3.create();
  glMatrix.vec3.set(this.worldUp, 0, 1, 0);

  this.right = glMatrix.vec3.create();
  this.pitch = -35;
  this.yaw = 270;
  this.speed = 0.01;
  this.sensitivity = 0.04;
  this.updateVectors();
}

Engine.Camera.prototype.updateVectors = function(){
  let front = glMatrix.vec3.create();
  front[0] = Math.cos(glMatrix.glMatrix.toRadian(this.yaw)) * Math.cos(glMatrix.glMatrix.toRadian(this.pitch));
  front[1] = Math.sin(glMatrix.glMatrix.toRadian(this.pitch));
  front[2] = Math.sin(glMatrix.glMatrix.toRadian(this.yaw)) *  Math.cos(glMatrix.glMatrix.toRadian(this.pitch));
  glMatrix.vec3.normalize(this.direction, front);

  glMatrix.vec3.cross(this.right, this.direction, this.worldUp);
  glMatrix.vec3.normalize(this.right, this.right);

  glMatrix.vec3.cross(this.up, this.right, this.direction);
  glMatrix.vec3.normalize(this.up, this.up);
}

Engine.Camera.prototype.rotate = function(offsetX, offsetY){
  this.yaw += offsetX * this.sensitivity;
  this.pitch += offsetY * this.sensitivity;

  if (this.pitch > 89) this.pitch = 89;
  else if (this.pitch < -89) this.pitch = -89;

  this.updateVectors();
}

Engine.Camera.prototype.getViewMatrix = function(){
  let matrix = glMatrix.mat4.create(),
      posdir = glMatrix.vec3.create();
  glMatrix.vec3.add(posdir, this.position, this.direction);
  glMatrix.mat4.lookAt(matrix, this.position, posdir, this.up);
  return matrix;
}
