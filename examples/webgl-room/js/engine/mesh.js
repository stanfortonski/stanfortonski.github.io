/* Copyright (c) 2019-2020 by Stan Fortoński*/

Engine.Mesh = function(gl, vertices, indices, normals, material){
  this.vertices = vertices;
  this.normals = normals;
  this.indices = indices;
  this.material = material;
  this.createBuffers(gl);
}

Engine.Mesh.prototype.createBuffers = function(gl){
  this.bufferVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

  this.bufferNormals = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

  this.bufferElement = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferElement);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
}

Engine.Mesh.prototype.setArrayBuffers = function(gl, program){
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
  let aPosAttribLoc = gl.getAttribLocation(program, 'aPos');
  gl.vertexAttribPointer(aPosAttribLoc, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(aPosAttribLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
  let aNormalAttribLoc = gl.getAttribLocation(program, 'aNormal');
  gl.vertexAttribPointer(aNormalAttribLoc, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(aNormalAttribLoc);
}

Engine.Mesh.prototype.draw = function(gl, program){
  this.setArrayBuffers(gl, program);
  this.material.setUniforms(gl, program);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferElement);
  gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
}

Engine.Mesh.prototype.clear = function(gl){
  gl.deleteBuffer(this.bufferVertices);
  gl.deleteBuffer(this.bufferNormals);
  gl.deleteBuffer(this.bufferElement);
}
