#pragma strict

static var keyword: String = "AKB48";

function Start () {

}

function Update () {

}

function OnGUI(){
    var scale = 1.5;
    var scaledMatrix: Matrix4x4 = Matrix4x4.identity.Scale(Vector3(scale,scale,scale));
    GUI.matrix = scaledMatrix;
    keyword = GUI.TextField(Rect(Screen.width/2 - 100, Screen.height/2, 200, 20), keyword, 25);
    if( GUI.Button(Rect(Screen.width/2 - 50, Screen.height/2 + 30, 100, 25), "Search")) {
        print(keyword);
        if (keyword !== null) {
            PlayerPrefs.SetString("Keyword", keyword);
            Application.LoadLevel("LoadImage");
        }
    }
}
