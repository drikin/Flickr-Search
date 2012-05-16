#pragma strict

import System.Collections.Hashtable;

var img: GameObject;

//private var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=square&format=json&nojsoncallback=1";
//var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=square&format=json";
//private var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?id=34202117%40N00&format=json&nojsoncallback=1";
//private var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?id=26153219%40N00&format=json&nojsoncallback=1";
//private var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=masakiishitani&format=json&nojsoncallback=1";
private var json_url_base = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=124f163e85a1ad89419349ba560854b0&format=json&nojsoncallback=1&extras=url_z&media=photos&per_page=500&text=";
//private var keywoard = WWW.EscapeURL("佐々木希");

function Start () {
    loadJson();
}

function Update () {
    //transform.Rotate(0, 50*Time.deltaTime, 0);
}

function loadJson() {
    var keywoard = PlayerPrefs.GetString("Keyword");
    var json: WWW = new WWW (json_url_base + WWW.EscapeURL(keywoard));
    yield json;

    var data: Hashtable = MiniJSON.jsonDecode(json.text);

    if (data !== null) {
        //var images: ArrayList = data['items'];
        var photos: Hashtable = data['photos'];
        var images: ArrayList = photos['photo'];

        // get total number of images
        var pp: Number = photos['perpage'];
        var total: String = photos['total'];
        var t: Number = parseInt(total);
        var num = (t < pp)? t: pp;

        StartCoroutine("changeImg", images);
    }
}

function changeImg(images: ArrayList) {
    var i = 0;
    var l = images.Count;

    while(true) {
        if (i > l - 1) {
            i = 0;
        }
        var image: Hashtable = images[i];
        var url: String = image["url_z"];
        print(url);
        if (url === null) {
            i++;
            continue;
        }

        var www: WWW  = new WWW(url);
        yield www;

        // remove loading image
        var loading = GameObject.Find("Loading");
        Destroy(loading);

        var tex: Texture = www.texture;

        var x_scale: float = tex.width * 1.0/tex.height;
        transform.localScale = Vector3(x_scale, 1, 1);

        //DestroyImmediate(renderer.material.mainTexture, true);
        DestroyImmediate(img.renderer.material.mainTexture, true);

        img.renderer.material.mainTexture = www.texture;

        www = null;
        Resources.UnloadUnusedAssets();	

        i++;

        yield WaitForSeconds(3.0);
    }
}
