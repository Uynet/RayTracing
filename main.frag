precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 light;


struct Sphere{
  vec3 pos;//中心座標
  float rad;//半径
  vec3 color;//色
};

//平面
struct Plane{
  vec3 pos;//中心座標
  vec3 normal;//法線
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
Intersect HitShpere(vec3 o,vec3 d,Sphere s){
  Intersect i;
  vec3 p = s.pos;
  float r = s.rad;
  float t;
  float a = dot(d,o-p);
  //判別式
  float D = a*a - length(o-p)*length(o-p)+r;
  t = -a -sqrt(D);
  i.time = t;
  i.color = s.color;
  vec3 hitPos = o + t*d; //衝突位置
  i.hitPos = hitPos;
  i.normal = normalize(hitPos-p); //法線
  if(D < 0.0)t = 114514.0;
  return i;
}

Intersect HitPlane(vec3 o,vec3 d,Plane plane){
  Intersect i;
  float t;
  vec3 n = plane.normal;
  vec3 p = plane.pos;

  t = dot(p,n)/dot(d,n) - dot(o,n)/dot(d,n);
  if(t<0.0)t = 114514.0;
  i.time = t;
  i.normal = n;
  i.hitPos = o + t*d;
  i.color = plane.color;
  return i;
}

float rand(vec2 p){
  return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 Light(Intersect iS,vec3 origin){
  //拡散光
  vec3 dif = iS.color * max(0.0,
      dot(normalize(light-iS.hitPos),iS.normal));
  
  //反射光
  float s = 0.3 * pow(
      max(0.0,dot(reflect(normalize(iS.hitPos-origin),iS.normal),normalize(light-iS.hitPos))),
      3.5);
  vec3 spec = vec3(s,s,s);
  if(iS.time == 114514.0)spec = vec3(0,0,0);
  //環境光
  vec3 amb = vec3(0.1,0.1,0.1);
  if(iS.time == 114514.0)amb = vec3(0,0,0);

  return dif + amb + spec;
}

void main(){
  //uv座標
  float u = (gl_FragCoord.x - 256.0)/512.0;
  float v = (gl_FragCoord.y - 256.0)/512.0;

  //光源座標
  //vec3 light = vec3(1,1,0.5);

  //originとdist
  vec3 origin = vec3(0,0,-1);
  vec3 dist = normalize(vec3(0.8*u,0.8*v,1));//distination
  
  //球の情報
  Sphere sphere;
  sphere.pos = vec3(light.x,0,2);//球の中心点
  sphere.rad = 0.2;//半径
  sphere.color = vec3(1,0,0);
  Intersect iS = HitShpere(origin,dist,sphere);

  //壁の情報
  Plane plane1;
  plane1.pos = vec3(0,0,3);
  plane1.color = vec3(0.7,0.7,0.5);
  plane1.normal = vec3(0,0,-1);
  Intersect iS2 = HitPlane(origin,dist,plane1);
//←
  Plane plane2;
  plane2.pos = vec3(-0.9,0,0);
  plane2.color = vec3(1,0,0);
  plane2.normal = vec3(1,0,0);
  Intersect iS3 = HitPlane(origin,dist,plane2);
//下
  Plane plane3;
  plane3.pos = vec3(0,-1,0);
  plane3.color = vec3(0.7,0.7,0.5);
  plane3.normal = vec3(0,1,0);
  Intersect iS4 = HitPlane(origin,dist,plane3);
//→
  Plane plane4;
  plane4.pos = vec3(0.9,0,0);
  plane4.color = vec3(0,1,0);
  plane4.normal = vec3(-1,0,0);
  Intersect iS5 = HitPlane(origin,dist,plane4);
//↑
  Plane plane5;
  plane5.pos = vec3(0,1,0);
  plane5.color = vec3(0.7,0.7,0.5);
  plane5.normal = vec3(0,-1,0);
  Intersect iS6 = HitPlane(origin,dist,plane5);

    vec3 pixelColor;
    pixelColor = Light(iS,origin);
    Intersect result;
    result.time = 114514.0;
  if(iS.time < result.time ) result = iS;
  if(iS2.time < result.time ) result = iS2;
  if(iS3.time < result.time ) result = iS3;
  if(iS4.time < result.time ) result = iS4;
  if(iS5.time < result.time ) result = iS5;
  if(iS6.time < result.time ) result = iS6;
  pixelColor = Light(result,origin);

  gl_FragColor = vec4(pixelColor,1);
}

