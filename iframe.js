var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var code;
var isVid = 0;
var value;

function submitMe(id) {
    if (isVid == 0) {
        value = document.getElementById(id).value;
        createVideo(value);
    } else {
        delVid();
        value = document.getElementById(id).value;
        createVideo(value);
    }
}


function onYouTubeIframeAPIReady() {
    //document.getElementById("player").setAttribute("allow:", autoplay);
    console.log("blbecci se nacetli")
}

function onPlayerReady() {
    console.log("hey Im ready");
    player.unmute();
    player.playVideo();
}
var done = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(unMute, 10);
        done = true;
    }
}

function unMute() {
    player.setVolume(50);
    player.unMute();
}

function createVideo(value) {
    player = new YT.Player('player', {
        videoId: value, // YouTube Video ID
        width: 560, // Player width (in px)
        height: 316, // Player height (in px)
        playerVars: {
            autoplay: 1, // Auto-play the video on load
            controls: 1, // Show pause/play buttons in player
            showinfo: 0, // Hide the video title
            modestbranding: 1, // Hide the Youtube Logo
            loop: 1, // Run the video in a loop
            fs: 0, // Hide the full screen button
            cc_load_policy: 0, // Hide closed captions
            iv_load_policy: 3, // Hide the Video Annotations
            autohide: 0, // Hide video controls when playing
            mute: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange

        }
    });
    isVid = 1;
}

function delVid() {
    document.getElementById("player").remove();
    isVid = 0;
    createDiv();
}

function createDiv() {
    const g = document.createElement("div");
    g.setAttribute("id", "player");
    const currentDiv = document.getElementById("test");
    document.body.insertBefore(g, currentDiv);
}