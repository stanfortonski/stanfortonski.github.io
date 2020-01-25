/* Copyright (c) 2020 by Stan Fortoński*/

precision mediump float;

attribute vec3 aPos;
attribute vec3 aNormal;

varying vec3 normal;
varying vec3 fragPos;

uniform mat4 viewProject;
uniform mat4 model;

void main()
{
  fragPos = vec3(model * vec4(aPos, 1.0));
  normal = aNormal;
  gl_Position = viewProject * vec4(fragPos, 1.0);
}
