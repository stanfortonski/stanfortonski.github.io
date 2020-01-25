App.loading = {
  loaded:{},
  totalLoaded: 0,
	toLoadAmount: 0,

  loadFileText: function(file, callback){
    let self = this;
    ++this.toLoadAmount;
    $.ajax({
      url: file,
      dataType: 'text',
      success: function(text){
        callback(text);
        ++self.totalLoaded;
      }
    });
  },

  loadFileJson: function(file, callback){
    let self = this;
    ++this.toLoadAmount;
    $.ajax({
      url: file,
      dataType: 'json',
      success: function(json){
        callback(json);
        ++self.totalLoaded;
      }
    });
  }
};

App.initLoad = function(){
  App.loading.loadFileText('shaders/vert_shader.vs', function(text){
    App.loading.loaded.vertexShaderSource = text;
  });
  App.loading.loadFileText('shaders/frag_shader.fs', function(text){
    App.loading.loaded.fragmentShaderSource = text;
  });
  App.loading.loadFileText('shaders/vert_depth.vs', function(text){
    App.loading.loaded.depthVertexShaderSource = text;
  });
  App.loading.loadFileText('shaders/frag_depth.fs', function(text){
    App.loading.loaded.depthFragmentShaderSource = text;
  });
  App.loading.loadFileJson('objects/room.json', function(json){
    App.loading.loaded.roomModel = json;
  });

  var timer = setInterval(function(){
    if (App.loading.totalLoaded == App.loading.toLoadAmount){
      App.main();
      loaded = null;
      clearInterval(timer);
    }
  }, 10);
}
