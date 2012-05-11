#pragma strict

static var keyword: String = "佐々木希";
var gSkin: GUISkin;

function Start () {

    var scale : float = iPhoneScreen.Scale();
    print(scale);
}

function Update () {

}

function OnGUI(){
    if (gSkin) {
        GUI.skin = gSkin;
    }

    GUILayout.BeginArea(Rect(0,Screen.height*2/3,Screen.width,Screen.height/3));

//    var scale : float = iPhoneScreen.Scale();
//    var scaledMatrix: Matrix4x4 = Matrix4x4.identity.Scale(Vector3(scale,scale,scale));
//    GUI.matrix = scaledMatrix;

    GUILayout.BeginVertical();

    GUILayout.BeginHorizontal();
    GUILayout.Space(100);
    keyword = GUILayout.TextField(keyword);
    GUILayout.Space(100);
    GUILayout.EndHorizontal();

    GUILayout.Space(10);

    GUILayout.BeginHorizontal();
    GUILayout.FlexibleSpace();
    if( GUILayout.Button("Search", GUILayout.MaxWidth(100))) {
        print(keyword);
        if (keyword !== null) {
            PlayerPrefs.SetString("Keyword", keyword);
            Application.LoadLevel("LoadImage");
        }
    }
    GUILayout.FlexibleSpace();
    GUILayout.EndHorizontal();

    GUILayout.EndVertical();
    GUILayout.EndArea();
}
