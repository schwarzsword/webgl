let gl;

let initScene = function () {
    loadTextResource('./shader.vs.glsl', function (vsErr, vsText) {
        if (vsErr) {
            alert('Fatal error getting vertex shader (see console)');
            console.error(vsErr);
        } else {
            loadTextResource('./shader.fs.glsl', function (fsErr, fsText) {
                if (fsErr) {
                    alert('Fatal error getting fragment shader (see console)');
                    console.error(fsErr);
                } else {
                    loadJSONResource('./sword.json', function (modelErr, swordModel) {
                        if (modelErr) {
                            alert('Fatal error getting sword model (see console)');
                            console.error(fsErr);
                        } else {
                            loadImage('./swordTexture.png', function (imgErr, swordImg) {
                                if (imgErr) {
                                    alert('Fatal error getting sword texture (see console)');
                                    console.error(imgErr);
                                } else {
                                    loadImage('./crate.png', function (imgErr, boxImg) {
                                        if (imgErr) {
                                            alert('Fatal error getting box texture (see console)');
                                            console.error(imgErr);
                                        } else {
                                            startScene(vsText, fsText, boxImg, swordImg, swordModel);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

let startScene = function (vertexShaderText, fragmentShaderText, boxImg, swordImg, swordModel) {
    console.log('This is working');

    let canvas = document.getElementById('scene');
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    //
    // Create shaders
    //
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create buffer
    //
    // let boxVertexBufferObject = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    // let boxTexCoordVertexBufferObject = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, boxTexCoordVertexBufferObject);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxTextureCoords), gl.STATIC_DRAW);

    // let boxIndexBufferObject = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    let bladeVertices = swordModel.meshes[3].vertices;
    let bladeIndices = [].concat.apply([], swordModel.meshes[3].faces);
    let bladeTextureCoords = swordModel.meshes[3].texturecoords[0];

    let bladeVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bladeVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bladeVertices), gl.STATIC_DRAW);

    let bladeTexCoordVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bladeTexCoordVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bladeTextureCoords), gl.STATIC_DRAW);

    let bladeIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bladeIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bladeIndices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, bladeVertexBufferObject);
    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, bladeTexCoordVertexBufferObject);
    let textureCoordAttribLocation = gl.getAttribLocation(program, 'vertTextureCoord');
    gl.vertexAttribPointer(
        textureCoordAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(textureCoordAttribLocation);

    //
    // Create texture
    //
    // let boxTexture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texImage2D(
    //     gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
    //     gl.UNSIGNED_BYTE,
    //     boxImg
    // );
    // gl.bindTexture(gl.TEXTURE_2D, null);

    let swordTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, swordTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        swordImg
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

// say what program we use
    gl.useProgram(program);

    let matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    let matViewUniformLocation = gl.getUniformLocation(program, "mView");
    let matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    let identityMatrix = new Float32Array(16);
    let worldMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projMatrix = new Float32Array(16);

    glMatrix.mat4.identity(identityMatrix);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 5, 80], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.height / canvas.width, 0.1, 1000);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    //
    // Main render loop
    //
    let angle = 0;
    let loop = function () {
        angle = performance.now() / 1000 / 10 * 2 * Math.PI;
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(1, 1, 1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, swordTexture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, bladeIndices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop)
    };
    requestAnimationFrame(loop);
};