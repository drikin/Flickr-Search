#pragma strict

private var banner : ADBannerView = null;

function Start () {
    banner = new ADBannerView();
    banner.autoSize = true;
    banner.autoPosition = ADPosition.Bottom;
    StartCoroutine(ShowBanner());
}

function Update () {

}

function ShowBanner() {
    while (!banner.loaded && banner.error == null) {
        yield;
    }

    if (banner.error == null) {
        banner.Show();
    } else {
        banner = null;
    }
}
