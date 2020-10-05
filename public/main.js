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
                    loadJSONResource('./Susan.json', function (modelErr, model) {
                        if (modelErr) {
                            alert('Fatal error getting sword model (see console)');
                            console.error(fsErr);
                        } else {
                            loadImage('./SusanTexture.png', function (imgErr, modelImg) {
                                if (imgErr) {
                                    alert('Fatal error getting sword texture (see console)');
                                    console.error(imgErr);
                                } else {
                                    loadImage('./crate.png', function (imgErr, boxImg) {
                                        if (imgErr) {
                                            alert('Fatal error getting box texture (see console)');
                                            console.error(imgErr);
                                        } else {
                                            loadImage('./torus.jpg', function (imgErr, torusImg) {
                                                if (imgErr) {
                                                    alert('Fatal error getting box texture (see console)');
                                                    console.error(imgErr);
                                                } else {
                                                    loadImage('./ball.jpg', function (imgErr, ballImg) {
                                                        if (imgErr) {
                                                            alert('Fatal error getting box texture (see console)');
                                                            console.error(imgErr);
                                                        } else {
                                                            startScene(vsText, fsText, boxImg, modelImg, model, torusImg, ballImg);
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
            });
        }
    });
}

let startScene = function (vertexShaderText, fragmentShaderText, boxImg, modelImage, model, torusImg, ballImg) {
    let imageForTexture = ballImg;

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

    // let modelVertices = model.meshes[0].vertices;
    // let modelIndices = [].concat.apply([], model.meshes[0].faces);
    // let modelTextureCoords = model.meshes[0].texturecoords[0];
    // let modelNormals = model.meshes[0].normals;

    // let modelVertices = boxVertices;
    // let modelIndices = boxIndices;
    // let modelTextureCoords = boxTextureCoords;
    // let modelNormals = boxNormals;

    // let modelVertices = torus.vertices;
    // let modelIndices = torus.indices;
    // let modelTextureCoords = torus.texCoords;
    // let modelNormals = torus.normals;

    let modelVertices = sphere.vertices;
    let modelIndices = sphere.indices;
    let modelTextureCoords = sphere.texCoords;
    let modelNormals = sphere.normals;

    let modelVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelVertices), gl.STATIC_DRAW);

    let modelTexCoordVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelTexCoordVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelTextureCoords), gl.STATIC_DRAW);

    let modelNormalsBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalsBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelNormals), gl.STATIC_DRAW);

    let modelIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelIndices), gl.STATIC_DRAW);


    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBufferObject);
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

    gl.bindBuffer(gl.ARRAY_BUFFER, modelTexCoordVertexBufferObject);
    let texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        texCoordAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0
    );
    gl.enableVertexAttribArray(texCoordAttribLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalsBufferObject);
    let normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
    gl.vertexAttribPointer(
        normalAttribLocation,
        3,
        gl.FLOAT,
        gl.TRUE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(normalAttribLocation);

    //
    // Create texture
    //

    let modelTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, modelTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageForTexture
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
    glMatrix.mat4.lookAt(viewMatrix, [0, 10, 30], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.height / canvas.width, 0.1, 1000);
    // glMatrix.mat4.rotate(worldMatrix, identityMatrix, 2, [-1, 0, 0]);


    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


    //
    // Lighting information
    //

    let ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
    let sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
    let sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');

    gl.uniform3f(ambientUniformLocation, 0.1, 0.1, 0.1);
    gl.uniform3f(sunlightDirUniformLocation, 7.0, 7.0, 7.0);
    gl.uniform3f(sunlightIntUniformLocation, 0.7, 0.7, 0.7);

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

        gl.bindTexture(gl.TEXTURE_2D, modelTexture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, modelIndices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop)
    };
    requestAnimationFrame(loop);
};