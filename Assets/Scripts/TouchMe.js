#pragma strict

import FlickrSearch;

var text: String = "";
private var keyboard: TouchScreenKeyboard;

function Start () {

}

function Update () {
    if (Input.touchCount > 0 || Input.GetMouseButtonDown(0)) {
        print("touchme");
        keyboard = TouchScreenKeyboard.Open(text, TouchScreenKeyboardType.Default);
    }
}

function OnGUI() {
    if (keyboard&&keyboard.done) {
        var val: String = keyboard.text;

        print ("User input is: " + val);
        PlayerPrefs.SetString("Keyword", val);

        // hide Touch Me
        var t = GameObject.Find("Touch Me");
        Destroy(t);

        // change Eye animation
        var o = GameObject.Find("Eye");
        o.animation.CrossFade("Searching", 0.2);

        // start to search
        var f = GameObject.Find("Flickr Search Script");
        var s: FlickrSearch = f.GetComponent("FlickrSearch");
        s.loadJson();

        keyboard = null;
    }
}
