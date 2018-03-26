precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 light;


struct Sphere{
  vec3 pos;//中心座標
  float rad;//半径
  vec3 color;//色
};

//衝突判定情報
struct Intersect{
  float time;//t
  vec3 normal;
  vec3 hitPos;//衝突位置
  vec3 color;
}unko;

//座標軸
//x : →
//y : ↑
//z : 奥

//球との当たり判定
Intersect HitShpere(vec3 o,vec3 d,vec3 p,float r){
  Intersect i;
  float t;
  float a = dot(d,o-p);
  //判別式
  float D = a*a - length(o-p)*length(o-p)+r;
  t = -a -sqrt(D);
  i.time = t;
  i.color = vec3(1,1,1);
  vec3 hitPos = o + t*d; //衝突位置
  i.hitPos = hitPos;
  i.normal = hitPos-p; //法線
  if(D < 0.0)t = -1.0;
  return i;
}

float HitWall(vec3 o,vec3 d,vec3 p,vec3 n){
  float t;
  t = dot(p,n)/dot(d,n) - dot(o,n)/dot(d,n);
  return t;
}

float rand(vec2 p){
  return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){
  //uv座標
  float u = (gl_FragCoord.x - 256.0)/512.0;
  float v = (gl_FragCoord.y - 256.0)/512.0;

  //光源座標
  //vec3 light = vec3(1,1,0.5);

  //originとdist
  float po = sqrt(2.0)/2.0;
  float z = sqrt(1.0 - (u*u + v*v)/2.0);
  vec3 origin = vec3(0,0,-1);
  vec3 dist = vec3(po*u,po*v,z);//distination
  
  //球の情報
  Sphere sphere;
  sphere.pos = vec3(0,0,2);//球の中心点
  sphere.rad = 0.2;//半径
  sphere.color = vec3(1,1,0);
  Intersect iS = HitShpere(origin,dist,sphere.pos,sphere.rad);
  vec3 n = iS.normal;

  //拡散光
  float c = 0.5 * dot(light-iS.hitPos,n);
  vec3 dif = c * sphere.color;
  //反射光
  float s = 0.008 * pow(
      max(0.0,dot(reflect(iS.hitPos-origin,n),light-iS.hitPos)),
      3.5);
  vec3 spec = vec3(s,s,s);
  if(iS.time == -1.0)spec = vec3(0,0,0);
  //環境光
  vec3 amb = vec3(0.1,0.1,0.1);
  if(iS.time == -1.0)amb = vec3(0,0,0);

  gl_FragColor = vec4(dif+amb+spec,1);
}

