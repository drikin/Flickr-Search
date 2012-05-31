#pragma strict

import System.Collections.Hashtable;
import Main;
import Picture;

var controllerFab: Transform;
var Picture: Transform;

// flickr urls /// {{{
private var flickr_base_url:String = "http://www.flickr.com/photos/";
private var flickr_url:String = null;
private var flickr_search_url_base = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=124f163e85a1ad89419349ba560854b0&format=json&nojsoncallback=1&extras=url_z&media=photos&per_page=500&text=";
private var flickr_latest_phots_url = "http://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=124f163e85a1ad89419349ba560854b0&extras=url_z&per_page=500&format=json&nojsoncallback=1";
// }}}

private var pictures: Array = [];
private var pause: boolean = false;

private var speed = 0.02;

function Start () {
}

function SingleTap() {
    yield WaitForSeconds(0.7);
    print("single");

    var c = GameObject.FindWithTag("Controller");
    if (c) {
        pause = !pause;
        print("pause:" + pause);
        var o: GameObject;
        if (pause) {
            o = c.Find("Pause");
        } else {
            o = c.Find("Play");
        }
        o.animation.Play();
    }
}

function DoubleTap() {
    yield WaitForSeconds(0.5);
    print("double");

    StopCoroutine("SingleTap");

    if (flickr_url) {
        Application.OpenURL(flickr_url);
    }
}

function TripleTap() {
    yield WaitForSeconds(0.3);
    print("triple");

    StopCoroutine("DoubleTap");
    StopCoroutine("SingleTap");

    showSearchScreen();
}

function Update () { // {{{
    // single tap
    if(Input.touchCount > 0 && Input.GetTouch(0).tapCount == 1) {
        if (Input.GetTouch(0).phase==TouchPhase.Began) {
            StartCoroutine("SingleTap");
        }
    }
    if(Input.GetMouseButtonDown(0)) {
        //StartCoroutine("SingleTap");
    }

    // double tap handling
    if(Input.touchCount > 0 && Input.GetTouch(0).tapCount == 2) {
        if (Input.GetTouch(0).phase==TouchPhase.Began) {
            StartCoroutine("DoubleTap");
        }
    }

    // triple tap handling
    if(Input.touchCount > 0 && Input.GetTouch(0).tapCount == 3) {
        if (Input.GetTouch(0).phase==TouchPhase.Began) {
            StartCoroutine("TripleTap");
        }
    }

    if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved) {
        StopCoroutine("SingleTap");

        // Get movement of the finger since last frame
        var touchDeltaPosition:Vector2 = Input.GetTouch(0).deltaPosition;

        var p = GameObject.FindWithTag("Picture");

        if (p) {
            // Move object across XY plane
            p.transform.Translate (-touchDeltaPosition.x * speed, 
                -touchDeltaPosition.y * speed, 0);
            if (p.transform.position.y > 8) {
                p.transform.position.y = 8;
            }
            if (p.transform.position.y < -8) {
                p.transform.position.y = -8;
            }
        }
        return;
    }
} // }}}

function showSearchScreen() {
    var s = GameObject.FindWithTag("Search");
    if (s) {return;}

    var cobjs = GameObject.FindGameObjectsWithTag("Controller");
    for (var c in cobjs) {
        Destroy(c.gameObject);
    }

    pictures = [];
    StopCoroutine("createPictures");

    yield WaitForSeconds(1);

    var objs = GameObject.FindGameObjectsWithTag("Picture");
    for (var o in objs) {
        Destroy(o.gameObject);
    }

    var mObj = GameObject.Find("Main Script");
    var m: Main = mObj.GetComponent("Main");
    m.ShowSearch();
}

function hideSearchScreen() {
    var objs = GameObject.FindGameObjectsWithTag("Search");
    for (var o in objs) {
        Destroy(o.gameObject);
    }
}

function restart() {
    hideSearchScreen();
    yield WaitForSeconds(1);
    showSearchScreen();
}

function loadJson() {
    var keyword: String = PlayerPrefs.GetString("Keyword");

    var url = flickr_latest_phots_url;
    if (keyword) {
        url = flickr_search_url_base + WWW.EscapeURL(keyword);
    }

    var json: WWW = new WWW (url);
    yield json;
    //print(json.text);

    if (json.error !== null) {
        Debug.Log(json.error);
        restart();
    }

    var data: Hashtable = MiniJSON.jsonDecode(json.text);

    if (data !== null) {
        //var images: ArrayList = data['items'];
        var photos: Hashtable = data['photos'];
        var images: ArrayList = photos['photo'];

        // get total number of images
        var pp: Number = photos['perpage'];

        var t: Number;
        if (url === flickr_latest_phots_url) { // annoying workaround for the differences between apis
            t = photos['total'];
        } else {
            var total: String = photos['total'];
            t = parseInt(total);
        }
        var num = (t < pp)? t: pp;

        StartCoroutine("createPictures", images);

        hideSearchScreen();
    } else {
        restart();
    }
}

function createPictures(images: ArrayList) {
    var i = 0;
    var l = images.Count;

    pause = false;
    Instantiate(controllerFab);

    while(true) {
        if (pause) {
            yield;
            continue;
        }

        if (i > l - 1) {
            i = 0;
        }
        var image: Hashtable = images[i];
        var url: String = image["url_z"];
        var owner: String = image["owner"];
        var id: String = image["id"];
        flickr_url = flickr_base_url + owner + "/" + id;
        //print(flickr_url);
        if (url === null) {
            i++;
            continue;
        }

        var www: WWW  = new WWW(url);
        yield www;

        while (pictures.length > 0) {
            //var p: Transform = pictures.pop();
            //Destroy(p.gameObject);
            var pp: Transform = pictures.pop();
            var ps: Picture = pp.GetComponent("Picture");
            ps.hide();
        }

        var pic: Transform = Instantiate(Picture);
        var s: Picture = pic.GetComponent("Picture");
        s.setTexture(www.texture);

        pictures.push(pic);

        i++;

        yield WaitForSeconds(3.0);
    }
}

// vim: tabstop=4 shiftwidth=4 textwidth=0 expandtab foldmethod=marker nowrap
