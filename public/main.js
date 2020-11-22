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
                                                            startScene(vsText, fsText, boxImg, modelImg, model, torusImg, ballImg, 0);
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
    })
    sphere.makeVerts();
    torus.makeVerts();
}

let startScene = function (vertexShaderText, fragmentShaderText, boxImg, modelImage, model, torusImg, ballImg, angle) {
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
    let eye = [40 * Math.sin(angle * Math.PI / 180), 15, 40 * Math.cos(angle * Math.PI / 180)]
    glMatrix.mat4.lookAt(viewMatrix, eye, [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.height / canvas.width, 0.1, 1000);


    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


    //
    // Lighting information
    //
    {
        let ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
        let sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
        let sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');

        gl.uniform3f(ambientUniformLocation, 0.1, 0.1, 0.1);
        gl.uniform3f(sunlightDirUniformLocation, 7.0, 7.0, 7.0);
        gl.uniform3f(sunlightIntUniformLocation, 0.7, 0.7, 0.7);
    }

    let draw = function (vertexShaderText, fragmentShaderText, boxImg, modelImage, model, torusImg, ballImg) {

        //drawing
        {
            //sphere
            {
                let sphereVert = sphere.vertices;
                let sphereInd = sphere.indices;
                let sphereTex = sphere.texCoords;
                let sphereNorm = sphere.normals;

                let sphereVertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVert), gl.STATIC_DRAW);

                let sphereTexCoordVertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereTexCoordVertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTex), gl.STATIC_DRAW);

                let sphereNormalsBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNorm), gl.STATIC_DRAW);

                let sphereIndexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBufferObject);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereInd), gl.STATIC_DRAW);


                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBufferObject);
                let spherePositionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
                gl.vertexAttribPointer(
                    spherePositionAttribLocation, // Attribute location
                    3, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0 // Offset from the beginning of a single vertex to this attribute
                );
                gl.enableVertexAttribArray(spherePositionAttribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, sphereTexCoordVertexBufferObject);
                let sphereTexCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
                gl.vertexAttribPointer(
                    sphereTexCoordAttribLocation, // Attribute location
                    2, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0
                );
                gl.enableVertexAttribArray(sphereTexCoordAttribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBufferObject);
                let sphereNormalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
                gl.vertexAttribPointer(
                    sphereNormalAttribLocation,
                    3,
                    gl.FLOAT,
                    gl.TRUE,
                    3 * Float32Array.BYTES_PER_ELEMENT,
                    0
                );
                gl.enableVertexAttribArray(sphereNormalAttribLocation);

                //
                // Create texture
                //

                let sphereTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texImage2D(
                    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    ballImg
                );
                gl.bindTexture(gl.TEXTURE_2D, null);


                gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
                gl.activeTexture(gl.TEXTURE0);
                gl.drawElements(gl.TRIANGLES, sphereInd.length, gl.UNSIGNED_SHORT, 0);
            }
            //torus
            {
                let torusVer = torus.vertices;
                let torusInd = torus.indices;
                let torusTex = torus.texCoords;
                let torusNorm = torus.normals;

                let torusVertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(torusVer), gl.STATIC_DRAW);

                let torusTexCoordVertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, torusTexCoordVertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(torusTex), gl.STATIC_DRAW);

                let torusNormalsBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, torusNormalsBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(torusNorm), gl.STATIC_DRAW);

                let torusIndexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torusIndexBufferObject);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torusInd), gl.STATIC_DRAW);


                gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexBufferObject);
                let torusPositionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
                gl.vertexAttribPointer(
                    torusPositionAttribLocation, // Attribute location
                    3, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0 // Offset from the beginning of a single vertex to this attribute
                );
                gl.enableVertexAttribArray(torusPositionAttribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, torusTexCoordVertexBufferObject);
                let torusTexCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
                gl.vertexAttribPointer(
                    torusTexCoordAttribLocation, // Attribute location
                    2, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0
                );
                gl.enableVertexAttribArray(torusTexCoordAttribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, torusNormalsBufferObject);
                let torusNormalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
                gl.vertexAttribPointer(
                    torusNormalAttribLocation,
                    3,
                    gl.FLOAT,
                    gl.TRUE,
                    3 * Float32Array.BYTES_PER_ELEMENT,
                    0
                );
                gl.enableVertexAttribArray(torusNormalAttribLocation);

                //
                // Create texture
                //

                let torusTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, torusTexture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texImage2D(
                    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    torusImg
                );
                gl.bindTexture(gl.TEXTURE_2D, null);


                gl.bindTexture(gl.TEXTURE_2D, torusTexture);
                gl.activeTexture(gl.TEXTURE0);
                gl.drawElements(gl.TRIANGLES, torusInd.length, gl.UNSIGNED_SHORT, 0);
            }
            //box
            {

                let boxVert = boxVertices;
                let boxInd = boxIndices;
                let boxTex = boxTextureCoords;
                let boxNorm = boxNormals;

                let boxVertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVert), gl.STATIC_DRAW);

                let boxTexCoordVertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, boxTexCoordVertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxTex), gl.STATIC_DRAW);

                let boxNormalsBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, boxNormalsBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxNorm), gl.STATIC_DRAW);

                let boxIndexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxInd), gl.STATIC_DRAW);


                gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
                let boxPositionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
                gl.vertexAttribPointer(
                    boxPositionAttribLocation, // Attribute location
                    3, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0 // Offset from the beginning of a single vertex to this attribute
                );
                gl.enableVertexAttribArray(boxPositionAttribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, boxTexCoordVertexBufferObject);
                let boxTexCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
                gl.vertexAttribPointer(
                    boxTexCoordAttribLocation, // Attribute location
                    2, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0
                );
                gl.enableVertexAttribArray(boxTexCoordAttribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, boxNormalsBufferObject);
                let boxNormalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
                gl.vertexAttribPointer(
                    boxNormalAttribLocation,
                    3,
                    gl.FLOAT,
                    gl.TRUE,
                    3 * Float32Array.BYTES_PER_ELEMENT,
                    0
                );
                gl.enableVertexAttribArray(boxNormalAttribLocation);

                //
                // Create texture
                //

                let boxTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, boxTexture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texImage2D(
                    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    boxImg
                );
                gl.bindTexture(gl.TEXTURE_2D, null);


                gl.bindTexture(gl.TEXTURE_2D, boxTexture);
                gl.activeTexture(gl.TEXTURE0);
                gl.drawElements(gl.TRIANGLES, boxInd.length, gl.UNSIGNED_SHORT, 0);
            }
            //monkey
            {
                let modelVert = model.meshes[0].vertices;
                let modelInd = [].concat.apply([], model.meshes[0].faces);
                let modelTex = model.meshes[0].texturecoords[0];
                let modelNorm = model.meshes[0].normals;

                let modelVertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelVert), gl.STATIC_DRAW);

                let modelTexCoordVertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, modelTexCoordVertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelTex), gl.STATIC_DRAW);

                let modelNormalsBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalsBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelNorm), gl.STATIC_DRAW);

                let modelIndexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBufferObject);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelInd), gl.STATIC_DRAW);


                gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBufferObject);
                let modelPositionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
                gl.vertexAttribPointer(
                    modelPositionAttribLocation, // Attribute location
                    3, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0 // Offset from the beginning of a single vertex to this attribute
                );
                gl.enableVertexAttribArray(modelPositionAttribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, modelTexCoordVertexBufferObject);
                let modelTexCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
                gl.vertexAttribPointer(
                    modelTexCoordAttribLocation, // Attribute location
                    2, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0
                );
                gl.enableVertexAttribArray(modelTexCoordAttribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalsBufferObject);
                let modelNormalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
                gl.vertexAttribPointer(
                    modelNormalAttribLocation,
                    3,
                    gl.FLOAT,
                    gl.TRUE,
                    3 * Float32Array.BYTES_PER_ELEMENT,
                    0
                );
                gl.enableVertexAttribArray(modelNormalAttribLocation);

                // Monkey texture

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
                    modelImage
                );
                gl.bindTexture(gl.TEXTURE_2D, null);


                gl.bindTexture(gl.TEXTURE_2D, modelTexture);
                gl.activeTexture(gl.TEXTURE0);
                gl.drawElements(gl.TRIANGLES, modelInd.length, gl.UNSIGNED_SHORT, 0);
            }
            //ashes
        //     {
        //     let ashesVert = ashes.vertices;
        //     let torusInd = ashes.indices;
        //     let torusTex = ashes.texCoords;
        //     let torusNorm = ashes.normals;
        //
        //     let torusVertexBufferObject = gl.createBuffer();
        //     gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexBufferObject);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ashesVert), gl.STATIC_DRAW);
        //
        //     let torusTexCoordVertexBufferObject = gl.createBuffer();
        //     gl.bindBuffer(gl.ARRAY_BUFFER, torusTexCoordVertexBufferObject);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(torusTex), gl.STATIC_DRAW);
        //
        //     let torusNormalsBufferObject = gl.createBuffer();
        //     gl.bindBuffer(gl.ARRAY_BUFFER, torusNormalsBufferObject);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(torusNorm), gl.STATIC_DRAW);
        //
        //     let torusIndexBufferObject = gl.createBuffer();
        //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torusIndexBufferObject);
        //     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torusInd), gl.STATIC_DRAW);
        //
        //
        //     gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexBufferObject);
        //     let torusPositionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        //     gl.vertexAttribPointer(
        //         torusPositionAttribLocation, // Attribute location
        //         3, // Number of elements per attribute
        //         gl.FLOAT, // Type of elements
        //         gl.FALSE,
        //         3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        //         0 // Offset from the beginning of a single vertex to this attribute
        //     );
        //     gl.enableVertexAttribArray(torusPositionAttribLocation);
        //
        //     gl.bindBuffer(gl.ARRAY_BUFFER, torusTexCoordVertexBufferObject);
        //     let torusTexCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
        //     gl.vertexAttribPointer(
        //         torusTexCoordAttribLocation, // Attribute location
        //         2, // Number of elements per attribute
        //         gl.FLOAT, // Type of elements
        //         gl.FALSE,
        //         2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        //         0
        //     );
        //     gl.enableVertexAttribArray(torusTexCoordAttribLocation);
        //
        //     gl.bindBuffer(gl.ARRAY_BUFFER, torusNormalsBufferObject);
        //     let torusNormalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
        //     gl.vertexAttribPointer(
        //         torusNormalAttribLocation,
        //         3,
        //         gl.FLOAT,
        //         gl.TRUE,
        //         3 * Float32Array.BYTES_PER_ELEMENT,
        //         0
        //     );
        //     gl.enableVertexAttribArray(torusNormalAttribLocation);
        //
        //     //
        //     // Create texture
        //     //
        //
        //     let torusTexture = gl.createTexture();
        //     gl.bindTexture(gl.TEXTURE_2D, torusTexture);
        //     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //     gl.texImage2D(
        //         gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        //         gl.UNSIGNED_BYTE,
        //         torusImg
        //     );
        //     gl.bindTexture(gl.TEXTURE_2D, null);
        //
        //
        //     gl.bindTexture(gl.TEXTURE_2D, torusTexture);
        //     gl.activeTexture(gl.TEXTURE0);
        //     gl.drawElements(gl.TRIANGLES, torusInd.length, gl.UNSIGNED_SHORT, 0);
        // }
        }
    }


    draw(vertexShaderText, fragmentShaderText, boxImg, modelImage, model, torusImg, ballImg);

    if (angle < 360) {

        angle++;
        setTimeout(() => startScene(vertexShaderText, fragmentShaderText, boxImg, modelImage, model, torusImg, ballImg, angle), 10)
    }
};