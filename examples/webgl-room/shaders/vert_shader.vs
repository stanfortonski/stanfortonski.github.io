precision mediump float;

attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec2 aTexCoords;

varying vec3 normal;
varying vec2 texCoords;
varying vec3 fragPos;

uniform mat4 viewProject;
uniform mat4 model;

void main()
{
  fragPos = vec3(model * vec4(aPos, 1.0));
  normal = -aNormal;
  texCoords = aTexCoords;
  gl_Position = viewProject * vec4(fragPos, 1.0);
}
