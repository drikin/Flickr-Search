#pragma strict

var searchFab: Transform;
private var searchObj: Transform;

function Start () {
    ShowSearch();
}

function Update () {

}

function ShowSearch() {
    var searchObj: Transform = Instantiate(searchFab);
}

function HideSearch() {
    Destroy(searchObj);
}
