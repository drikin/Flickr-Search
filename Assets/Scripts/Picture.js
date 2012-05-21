#pragma strict

var photoObj: Transform;
var imgObj: Transform;

function Start () {
}

function Update () {

}

function setTexture(tex: Texture) {
    // arrange Aspect ratio
    var x_scale: float = tex.width * 1.0/tex.height;
    photoObj.transform.localScale = Vector3(x_scale, 1, 1);

    // set texture
    imgObj.renderer.material.mainTexture = tex;
}

