#pragma strict

function Start () {

}

function Update () {
    var d = Date().Now;
    //guiText.text = d.Hours + ":" + d.Minutes + ":" + d.Second;
    guiText.text = d + "";
}
