function Mesh(gl, vertices, indices, normals, texcoords, material){
  this.vertices = vertices;
  this.normals = normals;
  this.indices = indices;
  this.texcoords = texcoords;
  this.material = material;
  this.createBuffers(gl);
}

Mesh.prototype.createBuffers = function(gl){
  this.bufferVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

  this.bufferNormals = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

  this.bufferTextures = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferTextures);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.STATIC_DRAW);

  this.bufferElement = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferElement);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
}

Mesh.prototype.setArrayBuffers = function(gl, program){
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
  var aPosAttribLoc = gl.getAttribLocation(program, 'aPos');
  gl.vertexAttribPointer(aPosAttribLoc, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(aPosAttribLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
  var aNormalAttribLoc = gl.getAttribLocation(program, 'aNormal');
  gl.vertexAttribPointer(aNormalAttribLoc, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(aNormalAttribLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferTextures);
  var aTexAttribLoc = gl.getAttribLocation(program, 'aTexCoords');
  gl.vertexAttribPointer(aTexAttribLoc, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(aTexAttribLoc);
}

Mesh.prototype.draw = function(gl, program){
  this.setArrayBuffers(gl, program);
  this.material.setUniforms(gl, program);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferElement);
  gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
}

Mesh.prototype.clear = function(gl){
  gl.deleteBuffer(this.bufferVertices);
  gl.deleteBuffer(this.bufferNormals);
  gl.deleteBuffer(this.bufferTextures);
  gl.deleteBuffer(this.bufferElement);
}
