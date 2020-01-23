precision mediump float;

attribute vec2 aPos;
attribute vec2 aTexCoords;

varying vec2 texCoords;

void main()
{
  texCoords = aTexCoords;
  gl_Position = vec4(aPos.x, aPos.y, 0, 1.0);
}
