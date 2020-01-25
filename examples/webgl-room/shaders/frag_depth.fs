precision mediump float;

uniform vec2 clipNearFar;
uniform vec3 lightPos;

varying vec3 fragPos;

void main()
{
	vec3 fromLightToFrag = fragPos - lightPos;
  float len = length(fromLightToFrag - clipNearFar.x);
	float lightToFragDistance = len/(clipNearFar.y - clipNearFar.x);

	gl_FragColor = vec4(lightToFragDistance, lightToFragDistance, lightToFragDistance, 1.0);
}
