
function Renderer(canvasName, vertSrc, fragSrc) {
  // public member
  this.t = 0.0;
  this.modeVal = 1;

  this.lightPos = [1.0, 1.0, -1.0];
  this.eyePos = [1.5, 1.5, 1.5];
  this.atPos = [0.0, 0.0, 0.0];
  this.upPos = [0.0, 0.0, 1.0];
  this.topPos = [0.0, 0.0, 1.0];
  this.bottomPos=[0.0, 0.0, 1.0];
  this.leftPos=[0.0, 0.0, 1.0];
  this.rightPos=[0.0, 0.0, 1.0];
  
  this.lightVec = new Float32Array(3);
  // eye
  this.eyeVec = new Float32Array(3);
  //up
  this.upVec = new Float32Array(3);
  // at
  this.atVec = new Float32Array(3);
  //top
  this.topVec = new Float32Array(3);
  // bottom
  this.bottomVec=new Float32Array(3);
  //left
  this.leftVec=new Float32Array(3);
  //right
  this.rightVec=new Float32Array(3);

  this.ambientColor = [0.2, 0.1, 0.0];
  this.diffuseColor = [0.8, 0.4, 0.0];
  this.specularColor = [1.0, 1.0, 1.0];
  this.ambientColorM = [0.2, 0.1, 0.0];
  this.diffuseColorM = [0.8, 0.4, 0.0];
  this.specularColorM = [1.0, 1.0, 1.0];
  this.clearColor = [0.0, 0.4, 0.7];
  this.attenuation = 0.01;
  this.shininess = 80.0;
  this.kaVal =1.0;
  this.kdVal =1.0;
  this.ksVal =1.0;
  this.modificationMode;

  // private members (inside closure)
  var canvasName = canvasName;
  var vertSrc = vertSrc;
  var fragSrc = fragSrc;
  var canvas;
  var gl;
  var sceneVertNo = 0;
  var sceneVertNoFileInput = 0;
  var bufID;
  var progID = 0;
  var vertID = 0;
  var fragID = 0;
  var vertexLoc = 0;
  var texCoordLoc = 0;
  var normalLoc = 0;
  var projectionLoc = 0;
  var modelviewLoc = 0;
  var rotationLoc = 0;
  uWireframeLoc = 0;
  var normalMatrixLoc = 0;
  var vposition =0;
  var attenuationLoc = 0;
  var shininessLoc = 0;
  var kaLoc=0;
  var kdLoc=0;
  var ksLoc=0;
  var lightPosLoc = 0;
  var lightVecLoc = 0;
//eyePosition
  var eyePosLoc = 0;
  var eyeVecLoc = 0;

// up position
  var upPosLoc = 0;
  var upVecLoc = 0;
// at postion
  var atPosLoc = 0;
  var atVecLoc = 0;
//top position
var topPosLoc = 0;
var topVecLoc = 0;

//bottom position
var bottomPosLoc = 0;
var bottomVecLoc = 0;
//Left position
var leftPosLoc = 0;
var leftVecLoc = 0;
//right position
var rightPosLoc = 0;
var rightVecLoc = 0;
  var ambientColorLoc = 0;
  var diffuseColorLoc = 0;
  var specularColorLoc = 0;
  var ambientColorLocM = 0;
  var diffuseColorLocM = 0;
  var specularColorLocM = 0;
  var projection = new Float32Array(16);
  var modelview = new Float32Array(16);
  var currentFileName = './knot.txt';
  var rotationMatrix = mat4();
  var scalingFactorLoc = 0;
  var translateLoc = 0;
  var textContentr="";

  var  angle = 0.0;
  var  axis = [0, 0, 1];
  var 	trackingMouse = false;
  var   trackballMove = false;
  var modeLoc = 0;
  
  var scalingFactor = 1.0;
  var isDragging = false;
  var lastMousePosition = { x: 0, y: 0 };


  var isMoving = false;
  var translate = { x: 0, y: 0 };
  var lastMovePosition = { x: 0, y: 0 };

  // public
  this.updateShader = function (newvertSrc, newfragSrc) {
    vertSrc = newvertSrc;
    fragSrc = newfragSrc;

    gl.deleteProgram(progID);
    gl.deleteShader(vertID);
    gl.deleteShader(fragID);

    setupShaders();
  }
  // function to handle input type= file
  this.loadFile=function(textContent){
    textContentr=textContent;
      gl.deleteProgram(progID);
      gl.deleteShader(vertID);
      gl.deleteShader(fragID);
      gl.deleteBuffer(bufID);
      console.log("inside renderer.js"+ textContentr+typeof(textContentr))
      this.init();
    ;
   // loadFile(textContent);
  }
  // public
  this.updateModel = function (newFileName) {
    currentFileName = newFileName;

    gl.deleteProgram(progID);
    gl.deleteShader(vertID);
    gl.deleteShader(fragID);
    gl.deleteBuffer(bufID);

    this.init();
  }

  // public
  this.init = function () {
    this.canvas = window.document.getElementById(canvasName);
    var width = this.canvas.width;
    var height = this.canvas.height;
    
    this.canvas.addEventListener("mousedown", function(event){
      
      //rotate
      var x = 2*event.clientX/width-1;
      var y = 2*(height-event.clientY)/height-1;
      startMotion(-x, -y);

      //scaling 
      isDragging = true;
      lastMousePosition.x = event.clientX;
      lastMousePosition.y = event.clientY;
      
      //translation
      isMoving = true;
      lastMovePosition.x = event.clientX;
      lastMovePosition.y = event.clientY;
    
    });
    
    this.canvas.addEventListener("mouseup", function(event){
      
      //rotate
      var x = 2*event.clientX/width-1;
      var y = 2*(height-event.clientY)/height-1;
      stopMotion(-x, -y);
    
      //scaling
      isDragging = false;

      //translation
      isMoving = false;

    });
    
    this.canvas.addEventListener("mousemove", function(event){
    
      //rotate
      var x = 2*event.clientX/width-1;
      var y = 2*(height-event.clientY)/height-1;
      mouseMotion(-x, -y);

      //scaling
      if (isDragging && getModificationMode() === "scale") {
        var deltaX = event.clientX - lastMousePosition.x;
        var deltaY = event.clientY - lastMousePosition.y;
        var newChangeInFactor = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 100;
        if (deltaX < 0 || deltaY < 0) { 
          scalingFactor -= newChangeInFactor;
        } else {
          scalingFactor += newChangeInFactor;
        }

        if (scalingFactor < 0.1) {
          scalingFactor = 0.1;
        }

        lastMousePosition.x = event.clientX;
        lastMousePosition.y = event.clientY;
      }

      //translation
      if (isMoving && getModificationMode()==="translate") {
        var deltaX = event.clientX - lastMovePosition.x;
        var deltaY = event.clientY - lastMovePosition.y;
        translate.x -= deltaX / 1000;
        translate.y += deltaY / 1000; // invert Y axis for WebGL
        lastMovePosition.x = event.clientX;
        lastMovePosition.y = event.clientY;
      }
    });
    
    
    try {
      gl = this.canvas.getContext("experimental-webgl");
    } catch (e) { }
    if (!gl) {
      window.alert("Error: Could not retrieve WebGL Context");
      return;
    }

    gl.enable(gl.DEPTH_TEST);
    setupShaders();

    // generate a Vertex Buffer Object (VBO)
    bufID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufID);
    if(textContentr==""){
    var sceneVertexData = loadVertexData(currentFileName);
    sceneVertNo = sceneVertexData.length / (3 + 2 + 3);
    gl.bufferData(gl.ARRAY_BUFFER, sceneVertexData, gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_STRIP, 0, sceneVertNo);
   
    
    }
    else{
    var sceneVertexDataFileInput = loadFile(textContentr);
    sceneVertNoFileInput = sceneVertexDataFileInput.length / (3 + 2 + 3);
    gl.bufferData(gl.ARRAY_BUFFER, sceneVertexDataFileInput, gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_STRIP, 0, sceneVertNoFileInput);

  }
    
    
    
    if (vertexLoc != -1) {
      // position
      var offset = 0;
      var stride = (3 + 2 + 3) * Float32Array.BYTES_PER_ELEMENT;
      gl.vertexAttribPointer(vertexLoc, 3, gl.FLOAT, false, stride, offset);
      gl.enableVertexAttribArray(vertexLoc);
    }
    if (texCoordLoc != -1) {
      // texCoord
      offset = 0 + 3 * Float32Array.BYTES_PER_ELEMENT;
      gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, stride, offset);
      gl.enableVertexAttribArray(texCoordLoc);
    }
    if (normalLoc != -1) {
      // normal
      offset = 0 + (3 + 2) * Float32Array.BYTES_PER_ELEMENT;
      gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, stride, offset);
      gl.enableVertexAttribArray(normalLoc);
    }

    this.resize(this.canvas.width, this.canvas.height);
  }
///handling file input
  function loadFile(textContentr){
    console.log(typeof(textContentr))
    var data = new Float32Array(0);
    var floatVals=textContentr.split('\n');
    var numFloats = parseInt(floatVals);
    console.log("indide function in renderer.js"+typeof(numFloats)+numFloats+floatVals)
    //console.log("indide function in renderer.js"+typeof(textContent)+textContent)
    data = new Float32Array(numFloats);
        if (numFloats % (3 + 2 + 3) != 0) return data;

        for (var k = 0; k < numFloats; k++) {
          data[k] = floatVals[k + 1];
        }
        console.log("indide function in renderer.js data="+data)
        return data

  }

  function loadVertexData(filename) {
    var data = new Float32Array(0);
    switch (filename) {
      case "./knot.txt":
        var numFloats = knotData;
        data = new Float32Array(numFloats);
        if (numFloats % (3 + 2 + 3) != 0) return data;

        for (var k = 0; k < numFloats; k++) {
          data[k] = floatVals[k + 1];
        }
        return data

      case "./sphere.txt":
        var numFloats = spdata;
        data = new Float32Array(numFloats);
        if (numFloats % (3 + 2 + 3) != 0) return data;

        for (var k = 0; k < numFloats; k++) {
          data[k] = floatVals[k + 1];
        }
        return data

      case "./cube.txt":
        var numFloats = cubeData;
        data = new Float32Array(numFloats);
        if (numFloats % (3 + 2 + 3) != 0) return data;

        for (var k = 0; k < numFloats; k++) {
          data[k] = floatVals[k + 1];
        }
        return data

      case "./teapot.txt":
        var numFloats = teapotData;
        data = new Float32Array(numFloats);
        if (numFloats % (3 + 2 + 3) != 0) return data;

        for (var k = 0; k < numFloats; k++) {
          data[k] = floatVals[k + 1];
        }
        return data

    
      case "./plane.txt":
        var numFloats = planeData;
        data = new Float32Array(numFloats);
        if (numFloats % (3 + 2 + 3) != 0) return data;

        for (var k = 0; k < numFloats; k++) {
          data[k] = floatVals[k + 1];
        }
        return data

      case "./hose.txt":
          var numFloats = hoseData;
          data = new Float32Array(numFloats);
          if (numFloats % (3 + 2 + 3) != 0) return data;
  
          for (var k = 0; k < numFloats; k++) {
            data[k] = floatVals[k + 1];
          }
          return data

      default:
            var numFloats = knotData;
            data = new Float32Array(numFloats);
            if (numFloats % (3 + 2 + 3) != 0) return data;
    
            for (var k = 0; k < numFloats; k++) {
              data[k] = floatVals[k + 1];
            }
            return data
    }
  }

  //public
  this.resize = function (w, h) {
    gl.viewport(0, 0, w, h);

    // this function replaces gluPerspective
    mat4Perspective(projection, 32.0, w / h, 0.5, 4.0);
    //mat4Print(projection);
  }

  //public
  this.display = function () {
    gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // camera orbits in the z=1.5 plane
    // and looks at the origin
    // mat4LookAt replaces gluLookAt
    axis = normalize(axis);
    var rad = Math.PI / 180.0 * this.t;

    mat4LookAt(modelview,
      //this.eyePos[0]* Math.cos(rad), this.eyePos[1] * Math.sin(rad), this.eyePos[2], // eye
      //-1,1, 1,
      this.eyePos[0],this.eyePos[1],this.eyePos[2],
      this.atPos[0],this.atPos[1],this.atPos[2], // at
      this.upPos[0],this.upPos[1],this.upPos[2], // up
      this.bottomPos[0],this.bottomPos[1],this.bottomPos[2]);

    if(trackballMove) {
      axis = normalize(axis);
      rotationMatrix = mult(rotationMatrix, rotate(angle, axis));
      gl.uniformMatrix4fv(rotationLoc, false, flatten(rotationMatrix));
    }

    var modelviewInv = new Float32Array(16);
    var normalmatrix = new Float32Array(16);
    mat4Invert(modelview, modelviewInv);
    mat4Transpose(modelviewInv, normalmatrix);

    gl.useProgram(progID);

    // Apply scaling to projection matrix
    //mat4.scale(projection, projection, [scale, scale, scale]);
    
    // load the current projection and modelview matrix into the
    // corresponding UNIFORM variables of the shader
    gl.uniformMatrix4fv(projectionLoc, false, projection);
    gl.uniformMatrix4fv(modelviewLoc, false, modelview);
    gl.uniformMatrix4fv(rotationLoc, false, flatten(rotationMatrix));
    if (normalMatrixLoc != -1) gl.uniformMatrix4fv(normalMatrixLoc, false, normalmatrix);
    if (attenuationLoc != -1) gl.uniform1f(attenuationLoc, this.attenuation);
    if (kaLoc != -1) gl.uniform1f(kaLoc, this.kaVal);
    if (kdLoc != -1) gl.uniform1f(kdLoc, this.kdVal);
    if(ksLoc != -1) gl.uniform1f(ksLoc, this.ksVal);
    if (shininessLoc != -1) gl.uniform1f(shininessLoc, this.shininess);
    if (lightPosLoc != -1) gl.uniform3fv(lightPosLoc, this.lightPos);
    if (lightVecLoc != -1) gl.uniform3fv(lightVecLoc, this.lightVec);

    //eye position
    if (eyePosLoc != -1) gl.uniform3fv(eyePosLoc, this.eyePos);
    if (eyeVecLoc != -1) gl.uniform3fv(eyeVecLoc, this.eyeVec);

    // up position
    if (upPosLoc != -1) gl.uniform3fv(upPosLoc, this.upPos);
    if (upVecLoc != -1) gl.uniform3fv(upVecLoc, this.upVec);
    // at position
    if (atPosLoc != -1) gl.uniform3fv(atPosLoc, this.atPos);
    if (atVecLoc != -1) gl.uniform3fv(atVecLoc, this.atVec);
    //top position
    if (topPosLoc != -1) gl.uniform3fv(topPosLoc, this.topPos);
    if (topVecLoc != -1) gl.uniform3fv(topVecLoc, this.topVec);
    // bottom position
    if (bottomPosLoc != -1) gl.uniform3fv(bottomPosLoc, this.bottomPos);
    if (bottomVecLoc != -1) gl.uniform3fv(bottomVecLoc, this.bottomVec);
    //Left position
    if (leftPosLoc != -1) gl.uniform3fv(leftPosLoc, this.leftPos);
    if (leftVecLoc != -1) gl.uniform3fv(leftVecLoc, this.leftVec);

     //right position
     if (rightPosLoc != -1) gl.uniform3fv(rightPosLoc, this.rightPos);
     if (rightVecLoc != -1) gl.uniform3fv(rightVecLoc, this.rightVec);

    if (ambientColorLoc != -1) gl.uniform3fv(ambientColorLoc, this.ambientColor);
    if (diffuseColorLoc != -1) gl.uniform3fv(diffuseColorLoc, this.diffuseColor);
    if (specularColorLoc != -1) gl.uniform3fv(specularColorLoc, this.specularColor);
    if (ambientColorLocM != -1) gl.uniform3fv(ambientColorLocM, this.ambientColorM);
    if (diffuseColorLocM != -1) gl.uniform3fv(diffuseColorLocM, this.diffuseColorM);
    if (specularColorLocM != -1) gl.uniform3fv(specularColorLocM, this.specularColorM);
    if (scalingFactorLoc != -1) gl.uniform1f(scalingFactorLoc, scalingFactor);
    if (translateLoc != -1) gl.uniform4f(translateLoc, translate.x, translate.y, 0.0, 0.0);
    if (modeLoc != -1) gl.uniform1i(modeLoc, this.modeVal);


    gl.bindBuffer(gl.ARRAY_BUFFER, bufID);
   var rwireframe = document.getElementById("select_example_id").value;

   if(rwireframe == 3){
    //gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.LINE_STRIP, 0, sceneVertNo);
    gl.drawArrays(gl.LINE_STRIP, 0, sceneVertNoFileInput);
   }else{
    gl.enable(gl.DEPTH_TEST);
     gl.drawArrays(gl.TRIANGLES, 0, sceneVertNo);
     gl.drawArrays(gl.LINE_STRIP, 0, sceneVertNoFileInput);
   }
    //gl.drawArrays(gl.TRIANGLES, 0, sceneVertNo);
    //gl.drawArrays(gl.TRIANGLES, 0, sceneVertNof);
    // Draw the wireframe if the boolean value is true
    // if (renderWireframe === true) {
    //   gl.drawArrays(gl.LINE_LOOP, 0, 4);
    // } else {
      //gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // }
    //if (renderWireframe === true) {
      //gl.enable(gl.DEPTH_TEST);
      //gl.drawArrays(gl.LINES, 0, sceneVertNo);
      //gl.drawArrays(gl.TRIANGLES, 0, sceneVertNof);
    //} else {
     // gl.enable(gl.DEPTH_TEST);
     // gl.drawArrays(gl.TRIANGLES, 0, sceneVertNo);
    //}
    
  }
  // let renderWireframe = false;
  // public


  // private
  function setupShaders() {
    // create shader
    vertID = gl.createShader(gl.VERTEX_SHADER);
    fragID = gl.createShader(gl.FRAGMENT_SHADER);

    // specify shader source
    gl.shaderSource(vertID, vertSrc);
    gl.shaderSource(fragID, fragSrc);

    // compile the shader
    gl.compileShader(vertID);
    gl.compileShader(fragID);

    var error = false;
    // check for errors
    if (!gl.getShaderParameter(vertID, gl.COMPILE_STATUS)) {
      document.getElementById("code_vert_error").innerHTML = "invalid vertex shader : " + gl.getShaderInfoLog(vertID);
      error = true;
    }
    else {
      document.getElementById("code_vert_error").innerHTML = "";
    }
    if (!gl.getShaderParameter(fragID, gl.COMPILE_STATUS)) {
      document.getElementById("code_frag_error").innerHTML = "invalid fragment shader : " + gl.getShaderInfoLog(fragID);
      error = true;
    } else {
      document.getElementById("code_frag_error").innerHTML = "";
    }
    if (error) return;

    // create program and attach shaders
    progID = gl.createProgram();
    gl.attachShader(progID, vertID);
    gl.attachShader(progID, fragID);

    // link the program
    gl.linkProgram(progID);
    if (!gl.getProgramParameter(progID, gl.LINK_STATUS)) {
      alert(gl.getProgramInfoLog(progID));
      return;
    }
    // retrieve the location of the IN variables of the vertex shader
    vertexLoc = gl.getAttribLocation(progID, "position");
    texCoordLoc = gl.getAttribLocation(progID, "texCoord");
    normalLoc = gl.getAttribLocation(progID, "normal");
    //vposition = gl.getAttribLocation(progID,"vposition");
    // retrieve the location of the UNIFORM variables of the shader
    projectionLoc = gl.getUniformLocation(progID, "projection");
    modelviewLoc = gl.getUniformLocation(progID, "modelview");
    rotationLoc = gl.getUniformLocation(progID, "rotationMatrix");
    normalMatrixLoc = gl.getUniformLocation(progID, "normalMat");
    lightPosLoc = gl.getUniformLocation(progID, "lightPos");
    lightVecLoc = gl.getUniformLocation(progID, "lightVec");

    /// eye position
    eyePosLoc = gl.getUniformLocation(progID, "eyePos");
    eyeVecLoc = gl.getUniformLocation(progID, "lightVec");
    //

    ///up position
    upPosLoc = gl.getUniformLocation(progID, "upPos");
    upVecLoc = gl.getUniformLocation(progID, "lightVec");
    //

    // at position
    atPosLoc = gl.getUniformLocation(progID, "atPos");
    atVecLoc = gl.getUniformLocation(progID, "lightVec");
    //
    //top position
    topPosLoc = gl.getUniformLocation(progID, "topPos");
    topVecLoc = gl.getUniformLocation(progID, "lightVec");
    //

    //bottom position
    bottomPosLoc = gl.getUniformLocation(progID, "bottomPos");
    bottomVecLoc = gl.getUniformLocation(progID, "lightVec");
    //

    //bottom position
    leftPosLoc = gl.getUniformLocation(progID, "leftPos");
    leftVecLoc = gl.getUniformLocation(progID, "lightVec");
    //
// right position
    rightPosLoc = gl.getUniformLocation(progID, "rightPos");
    rightVecLoc = gl.getUniformLocation(progID, "lightVec");
//


    ambientColorLoc = gl.getUniformLocation(progID, "ambientColor");
    diffuseColorLoc = gl.getUniformLocation(progID, "diffuseColor");
    specularColorLoc = gl.getUniformLocation(progID, "specularColor");
    ambientColorLocM = gl.getUniformLocation(progID, "ambientColorM");
    diffuseColorLocM = gl.getUniformLocation(progID, "diffuseColorM");
    specularColorLocM = gl.getUniformLocation(progID, "specularColorM");
    shininessLoc = gl.getUniformLocation(progID, "shininessVal");
    kaLoc = gl.getUniformLocation(progID, "Ka");
    kdLoc = gl.getUniformLocation(progID, "Kd");
    ksLoc = gl.getUniformLocation(progID, "Ks");
    attenuationLoc = gl.getUniformLocation(progID, "attenuationVal");
    scalingFactorLoc = gl.getUniformLocation(progID, "scalingFactor");
    translateLoc = gl.getUniformLocation(progID, "translate");
    modeLoc = gl.getUniformLocation(progID, "mode");
  }

  // the following functions are some matrix and vector helpers
  // they work for this demo but in general it is recommended
  // to use more advanced matrix libraries
  function vec3Dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function vec3Cross(a, b, res) {
    res[0] = a[1] * b[2] - b[1] * a[2];
    res[1] = a[2] * b[0] - b[2] * a[0];
    res[2] = a[0] * b[1] - b[0] * a[1];
  }

  function vec3Normalize(a) {
    var mag = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    a[0] /= mag; a[1] /= mag; a[2] /= mag;
  }

  function mat4Identity(a) {
    a.length = 16;
    for (var i = 0; i < 16; ++i) a[i] = 0.0;
    for (var i = 0; i < 4; ++i) a[i + i * 4] = 1.0;
  }

  function mat4Multiply(a, b, res) {
    for (var i = 0; i < 4; ++i) {
      for (var j = 0; j < 4; ++j) {
        res[j * 4 + i] = 0.0;
        for (var k = 0; k < 4; ++k) {
          res[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k];
        }
      }
    }
  }

  function mat4Perspective(a, fov, aspect, zNear, zFar) {
    var f = 1.0 / Math.tan(fov / 2.0 * (Math.PI / 180.0));
    mat4Identity(a);
    a[0] = f / aspect;
    a[1 * 4 + 1] = f;
    a[2 * 4 + 2] = (zFar + zNear) / (zNear - zFar);
    a[3 * 4 + 2] = (2.0 * zFar * zNear) / (zNear - zFar);
    a[2 * 4 + 3] = -1.0;
    a[3 * 4 + 3] = 0.0;
  }

  function mat4LookAt(viewMatrix,
    eyeX, eyeY, eyeZ,
    centerX, centerY, centerZ,
    upX, upY, upZ) {

    var dir = new Float32Array(3);
    var right = new Float32Array(3);
    var up = new Float32Array(3);
    var eye = new Float32Array(3);

    up[0] = upX; up[1] = upY; up[2] = upZ;
    eye[0] = eyeX; eye[1] = eyeY; eye[2] = eyeZ;

    dir[0] = centerX - eyeX; dir[1] = centerY - eyeY; dir[2] = centerZ - eyeZ;
    vec3Normalize(dir);
    vec3Cross(dir, up, right);
    vec3Normalize(right);
    vec3Cross(right, dir, up);
    vec3Normalize(up);
    // first row
    viewMatrix[0] = right[0];
    viewMatrix[4] = right[1];
    viewMatrix[8] = right[2];
    viewMatrix[12] = -vec3Dot(right, eye);
    // second row
    viewMatrix[1] = up[0];
    viewMatrix[5] = up[1];
    viewMatrix[9] = up[2];
    viewMatrix[13] = -vec3Dot(up, eye);
    // third row
    viewMatrix[2] = -dir[0];
    viewMatrix[6] = -dir[1];
    viewMatrix[10] = -dir[2];
    viewMatrix[14] = vec3Dot(dir, eye);
    // forth row
    viewMatrix[3] = 0.0;
    viewMatrix[7] = 0.0;
    viewMatrix[11] = 0.0;
    viewMatrix[15] = 1.0;
  }

  function mat4Print(a) {
    // opengl uses column major order
    var out = "";
    for (var i = 0; i < 4; ++i) {
      for (var j = 0; j < 4; ++j) {
        out += a[j * 4 + i] + " ";
      }
      out += "\n";
    }
    alert(out);
  }

  function mat4Transpose(a, transposed) {
    var t = 0;
    for (var i = 0; i < 4; ++i) {
      for (var j = 0; j < 4; ++j) {
        transposed[t++] = a[j * 4 + i];
      }
    }
  }

  function mat4Invert(m, inverse) {
    var inv = new Float32Array(16);
    inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

    var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (det == 0) return false;
    det = 1.0 / det;
    for (var i = 0; i < 16; i++) inverse[i] = inv[i] * det;
    return true;
  }

  function mat4rotate(out, matrix, angle, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.sqrt(x*x + y*y + z*z);
    var s, c, t;
    if (Math.abs(len) < glMatrix.EPSILON) {
        return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(angle);
    c = Math.cos(angle);
    t = 1 - c;
    var a00 = matrix[0], a01 = matrix[1], a02 = matrix[2], a03 = matrix[3];
    var a10 = matrix[4], a11 = matrix[5], a12 = matrix[6], a13 = matrix[7];
    var a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11];
    var b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
    var b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
    var b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (matrix !== out) {
        out[12] = matrix[12];
        out[13] = matrix[13];
        out[14] = matrix[14];
        out[15] = matrix[15];
    }
    return out;
}

  function trackballView( x,  y ) {
    var d, a;
    var v = [];

    v[0] = x;
    v[1] = y;

    d = v[0]*v[0] + v[1]*v[1];
    if (d < 1.0)
      v[2] = Math.sqrt(1.0 - d);
    else {
      v[2] = 0.0;
      a = 1.0 /  Math.sqrt(d);
      v[0] *= a;
      v[1] *= a;
    }
    return v;
  }

  function mouseMotion( x,  y)
  {
    var dx, dy, dz;
    var curPos = trackballView(x, y);
    if(trackingMouse && this.modificationMode === "rotate") {
      dx = curPos[0] - lastPos[0];
      dy = curPos[1] - lastPos[1];
      dz = curPos[2] - lastPos[2];

      if (dx || dy || dz) {
	       angle = -50 * Math.sqrt(dx*dx + dy*dy + dz*dz);


	       axis[0] = lastPos[1]*curPos[2] - lastPos[2]*curPos[1];
	       axis[1] = lastPos[2]*curPos[0] - lastPos[0]*curPos[2];
	       axis[2] = lastPos[0]*curPos[1] - lastPos[1]*curPos[0];

         lastPos[0] = curPos[0];
	       lastPos[1] = curPos[1];
	       lastPos[2] = curPos[2];
      }
    }
    this.display;
  }

  function startMotion( x,  y)
{
    trackingMouse = true;
    startX = x;
    startY = y;
    curx = x;
    cury = y;

    lastPos = trackballView(x, y);
	  trackballMove=true;
  }

  function stopMotion( x,  y)
{
    trackingMouse = false;
    if (startX != x || startY != y) {
    }
    else {
	     angle = 0.0;
	     trackballMove = false;
    }
}

}
function modificationChanged() {
  var d = document.getElementById("select_id3").value;
  this.modificationMode = d;
}

function getModificationMode (){
  return this.modificationMode;
}