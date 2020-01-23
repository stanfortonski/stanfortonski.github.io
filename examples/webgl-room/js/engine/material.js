Engine.Material = function(gl, assimpMaterial){
  this.shininess = assimpMaterial[5].value;
  this.ambient = glMatrix.vec3.create();
  this.ambient[0] = assimpMaterial[2].value[0];
  this.ambient[1] = assimpMaterial[2].value[1];
  this.ambient[2] = assimpMaterial[2].value[2];

  this.diffuse = glMatrix.vec3.create();
  this.diffuse[0] = assimpMaterial[3].value[0];
  this.diffuse[1] = assimpMaterial[3].value[1];
  this.diffuse[2] = assimpMaterial[3].value[2];

  this.specular = glMatrix.vec3.create();
  this.specular[0] = assimpMaterial[4].value[0];
  this.specular[1] = assimpMaterial[4].value[1];
  this.specular[2] = assimpMaterial[4].value[2];
}

Engine.Material.prototype.setUniforms = function(gl, program){
  gl.uniform1f(gl.getUniformLocation(program, 'material.shininess'), this.shininess);
  gl.uniform3fv(gl.getUniformLocation(program, 'material.ambient'), this.ambient);
  gl.uniform3fv(gl.getUniformLocation(program, 'material.diffuse'), this.diffuse);
  gl.uniform3fv(gl.getUniformLocation(program, 'material.specular'), this.specular);
}
