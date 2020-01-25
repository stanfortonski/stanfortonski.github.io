/* Copyright (c) 2020 by Stan Fortoński*/

precision mediump float;

attribute vec3 aPos;

uniform mat4 model;
uniform mat4 viewProject;

varying vec3 fragPos;

void main()
{
  fragPos = (model * vec4(aPos, 1.0)).xyz;
  gl_Position = viewProject * vec4(aPos, 1.0);
}
