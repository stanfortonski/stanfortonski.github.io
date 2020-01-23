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

vec3 calcPointLight(PointLight light, Material material, vec3 viewDir, vec3 normal, float shadow)
{
  vec3 lightDir = normalize(light.position - fragPos);

  float diff = max(dot(normal, lightDir), 0.0);
  vec3 halfwayDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfwayDir), 0.0), material.shininess);

  float distances = length(light.position - fragPos);
  float weakening = 1.0 / (light.constant + light.linear * distances + light.quadratic * pow(distances, 2.0));

  vec3 ambient = light.ambient * material.ambient * weakening;
  vec3 diffuse = light.diffuse * diff * weakening * material.diffuse;
  vec3 specular = light.specular * spec * weakening * material.specular;
  return ambient + diffuse + specular; //(ambient + (1.0 - shadow) * (diffuse + specular)) * (material.diffuse + material.specular);
}

void main()
{
  vec3 norm = normalize(normal);
  vec3 viewDir = normalize(viewPos - fragPos);

  PointLight light;
  light.position = vec3(0.011, 1.959, 0.003);
  light.ambient = vec3(0.09);
  light.diffuse = vec3(1.1);
  light.specular = vec3(1.0);
  light.constant = 1.0;
  light.linear = 0.01;
  light.quadratic = 0.01;

  vec3 result = calcPointLight(light, material, viewDir, norm, 0.0);
  gl_FragColor = vec4(result, 1.0);
}
