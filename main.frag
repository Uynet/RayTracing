precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 color;

//座標軸
//x : →
//y : ↑
//z : 奥


//球との当たり判定
float HitShpere(vec3 o,vec3 d,vec3 p,float r){
  float t;
  float a = dot(d,o-p);
  //判別式
  float D = a*a - length(o-p)*length(o-p)+r;
  if(D < 0.0)return -1.0;
  t = -a -sqrt(D);
  return t;
}


void main(){
  //uv座標
  float u = (gl_FragCoord.x - 256.0)/512.0;
  float v = (gl_FragCoord.y - 256.0)/512.0;

  //光源座標
  vec3 light = vec3(1,1,0.5);

  //originとdist
  float po = sqrt(2.0)/2.0;
  float z = sqrt(1.0 - (u*u + v*v)/2.0);
  vec3 origin = vec3(0,0,-1);
  vec3 dist = vec3(po*u,po*v,z);//distination
  
  //球の情報
  vec3 p = vec3(0,0,2);//球の中心点
  float r = 1.0;//半径
  float t = HitShpere(origin,dist,p,r);
  vec3 hit = origin + t*dist; //衝突位置
  vec3 n = hit-p; //法線

  //拡散光
  float c = 0.5 * dot(light-hit,n);
  vec3 dif = vec3(c,0,0);

  //光沢
  float s = 0.008 * pow(
  max(0.0,dot(reflect(hit-origin,n),light-hit)),
  3.5);
  vec3 spec = vec3(s,s,s);
  if(t == -1.0)spec = vec3(0,0,0);


  //環境光
  vec3 amb = vec3(0.1,0.1,0.1);
  if(t == -1.0)amb = vec3(0,0,0);

  gl_FragColor = vec4(dif+amb+spec,1);
}

