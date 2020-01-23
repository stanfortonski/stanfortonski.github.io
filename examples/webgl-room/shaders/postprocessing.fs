precision mediump float;

varying vec2 texCoords;

uniform sampler2D screenTexture;

void main()
{
  gl_FragColor = vec4(texture2D(screenTexture, texCoords).rgb, 1.0);
}
