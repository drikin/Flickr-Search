#pragma strict

import System.Collections.Hashtable;
import Picture;

var searchFab: Transform;
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

function Update () { // {{{
    // triple tap handling
    if(Input.touchCount > 0 && Input.GetTouch(0).tapCount >= 3) {
        if (Input.GetTouch(0).phase==TouchPhase.Began) {
            showSearchScreen();
            return;
        }
    }

    if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved) {
        // Get movement of the finger since last frame
        var touchDeltaPosition:Vector2 = Input.GetTouch(0).deltaPosition;

        var p = GameObject.Find("Picture(Clone)");

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

    if (Input.touchCount > 0 || Input.GetMouseButtonDown(0)) {
        pause = !pause;
        print("pause:" + pause);

        if (flickr_url) {
            Application.OpenURL(flickr_url);
        }
    }
} // }}}

function showSearchScreen() {
    var s = GameObject.Find("Search(Clone)");
    if (s) {return;}

    var o = GameObject.Find("Picture(Clone)");
    if (o) {
        Destroy(o.gameObject);
    }
    var search: Transform = Instantiate(searchFab);
}

function hideSearchScreen() {
    var o = GameObject.Find("Search(Clone)");
    Destroy(o);
}

function loadJson() {
    var keyword: String = PlayerPrefs.GetString("Keyword");

    var url = flickr_latest_phots_url;
    if (keyword) {
        url = flickr_search_url_base + WWW.EscapeURL(keyword);
    }

    var json: WWW = new WWW (url);
    yield json;

//    print(json.text);

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
    }
}

function createPictures(images: ArrayList) {
    var i = 0;
    var l = images.Count;

    while(true) {
        if (i > l - 1) {
            i = 0;
        }
        var image: Hashtable = images[i];
        var url: String = image["url_z"];
        var owner: String = image["owner"];
        var id: String = image["id"];
        flickr_url = flickr_base_url + owner + "/" + id;
        print(flickr_url);
        if (url === null) {
            i++;
            continue;
        }

        var www: WWW  = new WWW(url);
        yield www;

        while (pictures.length > 0) {
            var p: Transform = pictures.pop();
            Destroy(p.gameObject);
        }
        var pic: Transform = Instantiate(Picture);
        var s: Picture = pic.GetComponent("Picture");
        s.setTexture(www.texture);

        pictures.push(pic);

        i++;

        yield WaitForSeconds(3.0);
    }
}
