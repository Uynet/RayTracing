precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 poyo;

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
  float ref;  
  int shape;//0:sphere 1:plane
};

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
  i.ref = 0.1;
  i.shape = 0;
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
  i.ref = 0.3;
  i.shape = 1;
  return i;
}

int HitLight(vec3 p){
  if(p.y >= 0.99 ){
    if(p.x > -0.3 || p.x < 0.3){
      if(p.z > -0.3 || p.z < 0.3){
        return 1;
      }
    }
  }
  return 0;
}

float rand(vec2 p){
  return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 rand3d(vec2 p){
  float v1 =  fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
  float v2 =  fract(sin(dot(p-53.1 ,vec2(12.9898,78.233))) * 43758.5453);
  float v3 =  fract(sin(dot(p+47.3 ,vec2(12.9898,78.233))) * 43758.5453);
  return vec3(v1,v2,v3);
}

vec3 Light(Intersect iS,vec3 origin){
  //光源座標
  vec3 light = vec3(0.0,1,0.5);
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

  //originとdist
  vec3 origin = vec3(0,0,-0.8);
  vec3 dist = normalize(vec3(0.8*u,0.8*v,1));//distination
  
  //球の情報
  Sphere spheres[2];
  spheres[0].pos = vec3(poyo.x-0.3,poyo.y,poyo.z);//球の中心点
  spheres[0].rad = 0.2;//半径
  spheres[0].color = vec3(1,0.3,0.6);

  spheres[1].pos = vec3(poyo.x+0.4,poyo.y-0.2,poyo.z+0.3);//球の中心点
  spheres[1].rad = 0.07;//半径
  spheres[1].color = vec3(0.6,0.3,1);

  Plane planes[6];

  //壁の情報
  planes[0].pos = vec3(0,0,3);
  planes[0].color = vec3(0.7,0.7,0.5);
  planes[0].normal = vec3(0,0,-1);
  //←
  planes[1];
  planes[1].pos = vec3(-1,0,0);
  planes[1].color = vec3(1,0,0);
  planes[1].normal = vec3(1,0,0);
  //下
  planes[2];
  planes[2].pos = vec3(0,-1,0);
  planes[2].color = vec3(0.7,0.7,0.5);
  planes[2].normal = vec3(0,1,0);
  //→
  planes[3];
  planes[3].pos = vec3(1,0,0);
  planes[3].color = vec3(0,1,0);
  planes[3].normal = vec3(-1,0,0);
  //↑
  planes[4];
  planes[4].pos = vec3(0,1,0);
  planes[4].color = vec3(0.7,0.7,0.5);
  planes[4].normal = vec3(0,-1,0);
  //手前
  planes[5];
  planes[5].pos = vec3(0,0,-1);
  planes[5].color = vec3(0.7,0.7,0.5);
  planes[5].normal = vec3(0,0,1);

    vec3 pixelColor = vec3(0,0,0);
    Intersect result;
    result.time = 114514.0;

    const int reflectCount = 30;//反射回数
    const float loop = 10.0;

    //反射
    vec3 finalColor = vec3(0,0,0);
    for(float y = 0.0;y<loop;y+=1.0){
      //平均取る
      //初期化
      dist = normalize(vec3(0.8*u,0.8*v,1));//distination
      origin = vec3(0,0,-0.8);
      pixelColor = vec3(0,0,0);
      float str = 0.5;
      for(int x = 0;x<reflectCount;x++){
        result.time = 114514.0;
        //全ての壁との当たり判定
        for(int i = 0;i<6;i++){
          Intersect iP = HitPlane(origin,dist,planes[i]);
          if(iP.time < result.time) result = iP;
        }
        for(int i = 0;i<2;i++){
          Intersect iS = HitShpere(origin,dist,spheres[i]);
          if(iS.time < result.time) result = iS;
        }
        //反射
        //球
        vec2 p = vec2(u,v) + loop;
        if(result.shape == 0){
          //dist = refract(dist,result.normal,0.4);
          dist = reflect(dist,result.normal);
          pixelColor += str * Light(result,origin);
          result.ref = 0.5;
        }
        //壁
        if(result.shape == 1){
          dist = reflect(dist,result.normal);
          pixelColor += str * Light(result,origin);
          result.ref = 0.5;
        }
        //ここで乱数
        dist += (rand3d(p)-0.5)/100.0;
        dist = normalize(dist);
        if(HitLight(origin) == 1)break;
        origin = result.hitPos + 0.04*dist;

        str *= result.ref;
      }
      finalColor += pixelColor;
    }
      finalColor /= loop;
    gl_FragColor = vec4(finalColor,1);
}

