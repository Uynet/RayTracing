export default class Collision{
  //l : 直線 vec3 o,vec3 d
  //w : 壁 vec3 o,vec3 d
  //当たった壁のuv座標
  static HitPos(l,w){
    let a = DOT(w.point,w.normal)/DOT(l.dist,w.normal);
    let b = DOT(l.origin,w.normal)/DOT(l.dist,w.normal);
    let t = a + b;
    return (w.origin,MLV(t,l.dist));
  }
}

class Line{
  constructor(o,d){
    this.origin = o;//始点
    this.dist = d;//方向ベクトル(ただし単位ベクトル
  }
}

class Wall{
  constructor(p,n){
    this.point = p;//ある壁を通る点
    this.normal = d;//法線ベクトル(ただし単位ベクトル
  }
}

/*
class ColInfo{
  constructor(isHit,p){
    this.isHit = isHit;//衝突したかどうか
    this.p = p;//壁のどのuv座標の点で衝突したか
  }
}
*/
