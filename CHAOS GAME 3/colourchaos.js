'use strict'
// based on https://interactivecomputergraphics.com/Code/02/gasket1.js

// declare variables with global scope
var gl
var positions = []
var colours = []
var numPositions = 10000

window.onload = function init() {
  var canvas = document.getElementById('gl-canvas')
  gl = canvas.getContext('webgl2')
  if (!gl) window.alert('WebGL 2.0 is not available')

  // Initialize data for the Sierpiński Gasket
  // with the 3 vertices of the initial triangle
  // and colours to go with each
  var vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)]
  var vcolours = [vec4(0.5, 0.69, 0.82, 1.0), //Assign color to each vertex
  vec4(0, 0.04, 0.5, 1.0),
  vec4(0.99, 0.4, 0.26, 1.0)]

  // use the first vertex as the starting point, p
  var p = vertices[0]

  // push that starting point into the array of points
  // to be drawn
  positions.push(p)
  colours.push(vcolours[0])

  // compute subsequent positions from the previous:
  // -> each new point is located midway between the
  //    last point and a vertex chosen at random
  for (var i = 0; positions.length < numPositions; ++i) {
    var j = Math.floor(3 * Math.random())
    p = add(positions[i], vertices[j])
    p = mult(0.5, p)
    positions.push(p)
    colours.push(vcolours[j])
  }

  // configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.9, 0.9, 0.9, 1.0)

  // load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  // load the positions into the GPU
  var vbuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW)

  // associate shader variables with data buffer
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
  // render the triangle
  render()
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, positions.length)
}
