function Material(gl, assimpMaterial){
  this.shininess = assimpMaterial[5].value;
  if (assimpMaterial[8] != undefined){
    this.isSupportTex = 1;
    this.texture = loadTexture(gl, 'img/'+assimpMaterial[8].value);
  }
  else{
    this.isSupportTex = 0;

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
}

Material.prototype.setUniforms = function(gl, program){
  gl.uniform1f(gl.getUniformLocation(program, 'material.shininess'), this.shininess);
  gl.uniform1i(gl.getUniformLocation(program, 'material.isSupportTex'), this.isSupportTex);

  if (this.isSupportTex == 1){
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(program, 'texUnit'), 0);
  }
  else{
    gl.uniform3fv(gl.getUniformLocation(program, 'material.ambient'), this.ambient);
    gl.uniform3fv(gl.getUniformLocation(program, 'material.diffuse'), this.diffuse);
    gl.uniform3fv(gl.getUniformLocation(program, 'material.specular'), this.specular);
  }
}
