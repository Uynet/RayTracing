export default class Drawer{
  static Init(){
    let canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    document.body.appendChild(canvas);
    this.gl = canvas.getContext("webgl");
    let vertexPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER,vertexPositionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([
      -1.0, -1.0,
      1.0, 1.0,
      -1.0, 1.0,
      -1.0, -1.0,
      1.0, 1.0,
      1.0, -1.0,
    ]),this.gl.STATIC_DRAW);


    let program = this.gl.createProgram();
    this.CreateShader("main.vert").then(vs=>{
      this.gl.attachShader(program,vs);
      return this.CreateShader("main.frag");
    }).then(fs=>{
      this.gl.attachShader(program,fs);
      this.gl.linkProgram(program);
      this.gl.useProgram(program);

      let attributeLocation = this.gl.getAttribLocation(program,"position");
      this.gl.enableVertexAttribArray(0);
      this.gl.vertexAttribPointer(0,2,this.gl.FLOAT,false,0,0)

      render();
    });

    let t = 0;
    let render = ()=>{
      requestAnimationFrame(render);
      this.gl.clearColor(0,0,0,1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      let colorLocation = this.gl.getUniformLocation(program,"color");
      let r = Math.sin(t/10);
      this.gl.uniform3f(colorLocation,r,0,0);
      this.gl.drawArrays(this.gl.TRIANGLES,0,3);
      this.gl.drawArrays(this.gl.TRIANGLES,3,3);
      this.gl.flush();
      t++;
    }
  }

  static CreateShader(path){
    return new Promise(res=>{
      let ext = path.split(".")[1];
      let shader;
      switch(ext){
        case "frag" : shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);break;  
        case "vert" : shader = this.gl.createShader(this.gl.VERTEX_SHADER);break;  
      }
      let xhr = new XMLHttpRequest();
      xhr.open("GET",path,true);
      xhr.addEventListener("load",event=>{
        let code = xhr.responseText;
        this.gl.shaderSource(shader,code);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          console.log(this.gl.getShaderInfoLog(shader))
        }
        res(shader);
      });
      xhr.send(null);
    })
  };
}
