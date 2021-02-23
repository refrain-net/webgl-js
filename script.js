'use strict';
class WebGLUtil {
  wrap = (position, index) => 2 * position / (index % 2 === 0 ? this.width : this.height);
  buffer = null;
  gl = null;
  height = 600;
  program = null;
  width = 800;
  vertex = null;
  constructor (canvas) {
    const gl = canvas.getContext('webgl');
    if (gl === null) throw new Error();
    this.gl = gl;
    this.height = canvas.height;
    this.width = canvas.width;
  }
  clear () {
    const gl = this.gl;
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  initShader (type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
  }
  initProgram (vertexShader, fragmentShader) {
    const gl = this.gl;
    const program = this.program || gl.createProgram();
    const shaders = gl.getAttachedShaders(program);
    if (shaders.length !== 0) {
      for (const shader of shaders) {
        gl.detachShader(program, shader);
      }
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    this.vertex = gl.getAttribLocation(program, 'vertex');
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
    gl.deleteProgram(program);
  }
  initBuffer (positions) {
    const gl = this.gl;
    const buffer = this.buffer || gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return buffer;
  }
  draw (positions) {
    const gl = this.gl;
    const vertex = this.vertex;
    positions = positions.map(this.wrap);
    const buffer = this.initBuffer(positions);
    gl.enableVertexAttribArray(vertex);
    gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, 0, positions.length / 2);
  }
  setShaderSource (vertexShaderSource, fragmentShaderSource) {
    const gl = this.gl;
    const vertexShader = this.initShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.initShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.initProgram(vertexShader, fragmentShader);
  }
}


const canvas = document.querySelector('#canvas');
const gl = new WebGLUtil(canvas);
const {textContent: vertexShaderSource} = document.querySelector('#vertex-shader');
const {textContent: fragmentShaderSource} = document.querySelector('#fragment-shader');

let positions = [400, 300, 0, 150, -400, 300, -200, 0, -400, -300, 0, -150, 400, -300, 200, 0];
gl.setShaderSource(vertexShaderSource, fragmentShaderSource);
gl.draw(positions);

positions = positions.map(position => position / 2);
gl.setShaderSource(vertexShaderSource, fragmentShaderSource.replace('vec4(1, 0, 0, 1)', 'vec4(0, 1, 0, 1)'));
gl.draw(positions);

positions = positions.map(position => position / 2);
gl.setShaderSource(vertexShaderSource, fragmentShaderSource.replace('vec4(1, 0, 0, 1)', 'vec4(0, 0, 1, 1)'));
gl.draw(positions);
