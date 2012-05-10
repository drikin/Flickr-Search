#pragma strict

import System.Collections.Hashtable;

//private var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=square&format=json&nojsoncallback=1";
//var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=square&format=json";
//private var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?id=34202117%40N00&format=json&nojsoncallback=1";
//private var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?id=26153219%40N00&format=json&nojsoncallback=1";
//private var json_url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=masakiishitani&format=json&nojsoncallback=1";
private var json_url_base = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=124f163e85a1ad89419349ba560854b0&format=json&nojsoncallback=1&extras=url_z&text=";
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
        //var media: Hashtable = image["media"];
        //var url: String = media["m"];
        //url = url.Replace("_m.jpg", ".jpg");
        var url: String = image["url_z"];
        print(url);

        var www: WWW  = new WWW(url);
        yield www;

        // remove loading image
        var loading = GameObject.Find("Loading");
        Destroy(loading);

        var tex: Texture = www.texture;
        var z_scale: float = tex.height * 1.0/tex.width;
        transform.localScale = Vector3(1, 1, z_scale);
        DestroyImmediate(renderer.material.mainTexture, true);
        renderer.material.mainTexture = www.texture;
        //renderer.material.mainTexture = null;
        www = null;
        Resources.UnloadUnusedAssets();	
        i++;
        yield WaitForSeconds(3.0);
    }
}
