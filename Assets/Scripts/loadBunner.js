#pragma strict

private var banner: ADBannerView = null;
private var orientation: ScreenOrientation;

function Start () {
    orientation = Screen.orientation;
    StartBanner();
}

function Update () {
    if (orientation != Screen.orientation) {
        orientation = Screen.orientation;
        print("orientation has changed");
        StartBanner();
    }
}

function StartBanner() {
    print("StartBanner");
    banner = new ADBannerView();
    banner.autoSize = true;
    banner.autoPosition = ADPosition.Bottom;

    StartCoroutine(ShowBanner());
}

function ShowBanner() {
    while (!banner.loaded && banner.error == null) {
        yield;
    }

    if (banner.error == null) {
        banner.Show();
    } else {
        print("ShowBanner failed");
        banner = null;
        yield WaitForSeconds(3);
        StartBanner();
    }
}
