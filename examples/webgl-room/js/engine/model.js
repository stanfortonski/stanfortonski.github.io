Engine.Model = function(gl, assimp){
  this.meshes = [];
  this.init(gl, assimp.meshes, assimp.materials);
}

Engine.Model.prototype.init = function(gl, meshes, materials){
  for (let i = 0; i < meshes.length; ++i){
    let material = new Engine.Material(gl, materials[meshes[i].materialindex].properties),
        mesh = new Engine.Mesh(gl, meshes[i].vertices, [].concat.apply([], meshes[i].faces), meshes[i].normals, material);
    this.meshes.push(mesh);
  }
}

Engine.Model.prototype.draw = function(gl, program){
  for (let i = 0; i < this.meshes.length; ++i)
    this.meshes[i].draw(gl, program);
}

Engine.Model.prototype.clear = function(gl){
  for (let i = 0; i < this.meshes.length; ++i)
    this.meshes[i].clear(gl)
}
