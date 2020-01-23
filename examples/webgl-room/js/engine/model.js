function Model(gl, assimp){
  this.meshes = [];
  this.init(gl, assimp.meshes, assimp.materials);
}

Model.prototype.init = function(gl, meshes, materials){
  for (let i = 0; i < meshes.length; ++i){
    var material = new Material(gl, materials[meshes[i].materialindex].properties);
    var mesh = new Mesh(gl, meshes[i].vertices, [].concat.apply([], meshes[i].faces), meshes[i].normals, meshes[i].texturecoords[0], material);
    this.meshes.push(mesh);
  }
}

Model.prototype.draw = function(gl, program){
  for (let i = 0; i < this.meshes.length; ++i)
    this.meshes[i].draw(gl, program);
}

Model.prototype.clear = function(gl){
  for (let i = 0; i < this.meshes.length; ++i)
    this.meshes[i].clear(gl)
}
