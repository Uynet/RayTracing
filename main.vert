attribute vec2 position;
uniform vec2 trans;

void main(){
  vec2 pos = position + trans;
  gl_Position = vec4(pos,0.,1.);
}
