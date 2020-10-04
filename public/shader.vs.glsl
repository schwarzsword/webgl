precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTextureCoord;
varying vec2 fragTextureCoord;
uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

void main()
{
    fragTextureCoord = vertTextureCoord;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}