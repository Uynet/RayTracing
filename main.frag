precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 color;

void main(){
  float a = gl_FragCoord.x /512.0;
  gl_FragColor = vec4(a,0,0,1);
}
