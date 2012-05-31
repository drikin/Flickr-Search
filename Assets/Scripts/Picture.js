#pragma strict

var photoObj: Transform;
var bgObj: GameObject;
var imgObj: GameObject;

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

function hide() {
    this.animation.Play("Hide");
}

function destroy() {
    //print("destroy");
    DestroyImmediate(this.gameObject, true);
    Resources.UnloadUnusedAssets();
}
