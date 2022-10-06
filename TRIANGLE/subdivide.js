'use strict'
// based on https://interactivecomputergraphics.com/Code/02/gasket2.js

// declare variables with global scope
var canvas
var gl
var positions = []
var colours = []
var numTimesToSubdivide = 5

window.onload = function init () {
  canvas = document.getElementById('gl-canvas')
  gl = canvas.getContext('webgl2')
  if (!gl) {
    window.alert('WebGL 2.0 is not available')
  }

  // initialize  data for the Sierpiński Gasket
  var vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)]
  

  // subdivide triangle recursively
  divideTriangle(vertices[0], vertices[1], vertices[2], numTimesToSubdivide,0)

  // configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  // load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  

  // load the data into the GPU
  var vBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW)

  // associate out shader variables with our data buffer
  var positionLoc = gl.getAttribLocation(program, 'aPosition')
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(positionLoc)

  // load the colours into the GPU
  var cbuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colours), gl.STATIC_DRAW)

  // associate shader variables with data buffer
  var colourLoc = gl.getAttribLocation(program, 'aColor')
  gl.vertexAttribPointer(colourLoc, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(colourLoc)

  // render
  render()
}

function triangle (a, b, c,colour) {
  positions.push(a, b, c)

  //add colors for vertices
  var vcolours = [vec4(0.95,.25,0.75, 1.0), 
  vec4(0.25,0.75,.35,1.0), 
	vec4( .10,.97,0.98, 1.0)];
  colours.push(vcolours[colour],vcolours[colour],vcolours[colour]);
 
}

function divideTriangle (a, b, c, count,color) {
  // check for end of recursion
  if (count === 0) {
    triangle(a, b, c,color)
  } else {
    // bisect the sides
    var ab = mix(a, b, 0.5)
    var ac = mix(a, c, 0.5)
    var bc = mix(b, c, 0.5)
    --count

    if(count==4)
    {
      color=0
    }
    // create three new triangles
    divideTriangle(a, ab, ac, count,color)
    if(count==4)
    {
      color=1
    }
    divideTriangle(c, ac, bc, count,color)
    if(count==4)
    {
      color=2
    }
    divideTriangle(b, bc, ab, count,color)
  }
}

function render () {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, positions.length)
}
