var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var match;
var isVid = 0;
var value;

function submitMe(id) {
    if (isVid == 0) {
        value = document.getElementById(id).value;
        parse(value);
        createVideo(match[2]);
    } else {
        delVid();
        value = document.getElementById(id).value;
        parse(value);
        createVideo(match[2]);
    }
}


function onYouTubeIframeAPIReady() {
    //document.getElementById("player").setAttribute("allow:", autoplay);
    console.log("Ok")
}

function onPlayerReady() {
    console.log("hey Im ready");
    player.unMute();
    player.setVolume(slide.value);
    player.playVideo();
}


function onPlayerStateChange() {
    player.playVideo();
}

function createVideo(value) {
    player = new YT.Player('player', {
        videoId: value, // YouTube Video ID
        width: 560, // Player width (in px)
        height: 316, // Player height (in px)
        playerVars: {
            start: 0,
            autoplay: 1, // Auto-play the video on load
            controls: 0, // Show pause/play buttons in player
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
    const currentDiv = document.getElementById("spacer");
    document.body.insertBefore(g, currentDiv);
}

function updateSlider() {
    player.setVolume(slide.value);
}

function parse(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    match = url.match(regExp);
    if (match && match[2].length == 11) {
        console.log(match[2]);
        return match[2];
    } else {
        createVideo(value)
    }
}