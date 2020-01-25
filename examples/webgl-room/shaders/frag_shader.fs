precision mediump float;

varying vec3 normal;
varying vec3 fragPos;

struct Material
{
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  float shininess;
};

struct PointLight
{
  vec3 position;
  float constant;
  float linear;
  float quadratic;
  vec3 diffuse;
  vec3 ambient;
  vec3 specular;
};

uniform Material material;
uniform vec3 viewPos;
uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec2 clipNearFar;
uniform samplerCube depthMap;
uniform int shadowSamples;

float shadowCalculation(samplerCube shadowMap, vec3 lightPos)
{
  vec3 lightToFrag = fragPos - lightPos;
  float currentDepth = length(lightToFrag);
  float bias = 0.18;
  float shadow = 0.0;
  const float offset = 0.012;

  //Because WEBGL es 1.0 do not support uses not const in loops
  if (shadowSamples == 1)
  {
    float closestDepth = textureCube(shadowMap, lightToFrag).r;
    closestDepth *= clipNearFar.y;
    shadow = currentDepth - bias > closestDepth ? 1.0 : 0.0;
  }
  else if (shadowSamples == 2)
  {
    const int samples = 2;
    const float nextStep = (offset / float(samples)) * 2.0;
    for (float x = -offset; x < offset; x += nextStep)
    {
      for (float y = -offset; y < offset; y += nextStep)
      {
        for (float z = -offset; z < offset; z += nextStep)
        {
          float closestDepth = textureCube(depthMap, lightToFrag + vec3(x, y, z)).r;
          closestDepth *= clipNearFar.y;
          if (currentDepth - bias > closestDepth)
            shadow += 1.0;
        }
      }
    }
    shadow /= float(samples * samples * samples);
  }
  else if (shadowSamples == 3)
  {
    const int samples = 3;
    const float nextStep = (offset / float(samples)) * 2.0;
    for (float x = -offset; x < offset; x += nextStep)
    {
      for (float y = -offset; y < offset; y += nextStep)
      {
        for (float z = -offset; z < offset; z += nextStep)
        {
          float closestDepth = textureCube(depthMap, lightToFrag + vec3(x, y, z)).r;
          closestDepth *= clipNearFar.y;
          if (currentDepth - bias > closestDepth)
            shadow += 1.0;
        }
      }
    }
    shadow /= float(samples * samples * samples);
  }
  else if (shadowSamples == 4)
  {
    const int samples = 4;
    const float nextStep = (offset / float(samples)) * 2.0;
    for (float x = -offset; x < offset; x += nextStep)
    {
      for (float y = -offset; y < offset; y += nextStep)
      {
        for (float z = -offset; z < offset; z += nextStep)
        {
          float closestDepth = textureCube(depthMap, lightToFrag + vec3(x, y, z)).r;
          closestDepth *= clipNearFar.y;
          if (currentDepth - bias > closestDepth)
            shadow += 1.0;
        }
      }
    }
    shadow /= float(samples * samples * samples);
  }
  return shadow;
}

vec3 calcPointLight(PointLight light, Material material, vec3 viewDir, vec3 normal, float shadow)
{
  vec3 lightDir = normalize(light.position - fragPos);

  float diff = max(dot(normal, lightDir), 0.0);
  vec3 halfwayDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfwayDir), 0.0), material.shininess*0.2);

  float distances = length(light.position - fragPos);
  float weakening = 1.0 / (light.constant + light.linear * distances + light.quadratic * pow(distances, 2.0));

  vec3 ambient = light.ambient * material.ambient;
  vec3 diffuse = light.diffuse * diff * weakening;
  vec3 specular = light.specular * spec * weakening;
  return (ambient + (1.0 - shadow) * (diffuse + specular)) * (material.diffuse + material.specular);
}

void main()
{
  vec3 norm = normalize(normal);
  vec3 viewDir = normalize(viewPos - fragPos);

  PointLight light;
  light.position = lightPos;
  light.ambient = vec3(0.15);
  light.diffuse = lightColor;
  light.specular = vec3(0.1);
  light.constant = 1.0;
  light.linear = 0.001;
  light.quadratic = 0.001;

  float shadowVal = shadowCalculation(depthMap, light.position);
  vec3 result = calcPointLight(light, material, viewDir, norm, shadowVal);
  gl_FragColor = vec4(result, 1.0);
}
