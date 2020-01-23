function Camera(){
  this.position = glMatrix.vec3.create();
  glMatrix.vec3.set(this.position, 0, 0, 0);

  this.direction = glMatrix.vec3.create();
  glMatrix.vec3.set(this.direction, 0, 0, -1);

  this.up = glMatrix.vec3.create();
  glMatrix.vec3.set(this.up, 0, 1, 0);

  this.worldUp = glMatrix.vec3.create();
  glMatrix.vec3.set(this.worldUp, 0, 1, 0);

  this.right = glMatrix.vec3.create();
  this.pitch = 0;
  this.yaw = -90;
  this.speed = 0.01;
  this.sensitivity = 0.1;
  this.updateVectors();
}

Camera.prototype.updateVectors = function(){
  var front = glMatrix.vec3.create();
  front[0] = Math.cos(glMatrix.glMatrix.toRadian(this.yaw)) * Math.cos(glMatrix.glMatrix.toRadian(this.pitch));
  front[1] = Math.sin(glMatrix.glMatrix.toRadian(this.pitch));
  front[2] = Math.sin(glMatrix.glMatrix.toRadian(this.yaw)) *  Math.cos(glMatrix.glMatrix.toRadian(this.pitch));
  glMatrix.vec3.normalize(this.direction, front);

  glMatrix.vec3.cross(this.right, this.direction, this.worldUp);
  glMatrix.vec3.normalize(this.right, this.right);

  glMatrix.vec3.cross(this.up, this.right, this.direction);
  glMatrix.vec3.normalize(this.up, this.up);
}

Camera.prototype.moveRight = function(time){
  var value = this.speed * time;
  var vector = glMatrix.vec3.create();
  glMatrix.vec3.copy(vector, this.right);
  vector[0] = vector[0] * value;
  vector[1] = vector[1] * value;
  vector[2] = vector[2] * value;
  glMatrix.vec3.add(this.position, this.position, vector);
}

Camera.prototype.moveLeft = function(time){
  var value = this.speed * time;
  var vector = glMatrix.vec3.create();
  glMatrix.vec3.copy(vector, this.right);
  vector[0] = vector[0] * value;
  vector[1] = vector[1] * value;
  vector[2] = vector[2] * value;
  glMatrix.vec3.negate(vector, vector);
  glMatrix.vec3.add(this.position, this.position, vector);
}

Camera.prototype.moveTop = function(time){
  var value = this.speed * time;
  var vector = glMatrix.vec3.create();
  glMatrix.vec3.copy(vector, this.direction);
  vector[0] = vector[0] * value;
  vector[1] = vector[1] * value;
  vector[2] = vector[2] * value;
  glMatrix.vec3.add(this.position, this.position, vector);
}

Camera.prototype.moveBottom = function(time){
  var value = this.speed * time;
  var vector = glMatrix.vec3.create();
  glMatrix.vec3.copy(vector, this.direction);
  vector[0] = vector[0] * value;
  vector[1] = vector[1] * value;
  vector[2] = vector[2] * value;
  glMatrix.vec3.negate(vector, vector);
  glMatrix.vec3.add(this.position, this.position, vector);
}

Camera.prototype.rotate = function(offsetX, offsetY){
  this.yaw += offsetX * this.sensitivity;
  this.pitch += offsetY * this.sensitivity;

  if (this.pitch > 89) this.pitch = 89;
  else if (this.pitch < -89) this.pitch = -89;

  this.updateVectors();
}

Camera.prototype.getViewMatrix = function(){
  var matrix = glMatrix.mat4.create();
  var posdir = glMatrix.vec3.create();
  glMatrix.vec3.add(posdir, this.position, this.direction);
  glMatrix.mat4.lookAt(matrix, this.position, posdir, this.up);
  return matrix;
}
