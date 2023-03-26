import { Manager } from "socket.io-client"
var player;
var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function script() {
    const manager = new Manager("localhost:3000");

    const socket = manager.socket("/"); // main namespace

    socket.on("connect", () => {
        const engine = socket.io.engine;
        console.log(engine.transport.name); // in most cases, prints "polling"

        engine.once("upgrade", () => {
            // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
            console.log(engine.transport.name); // in most cases, prints "websocket"
            socket.emit("waiting", "id", (res) => {
                console.log(res)
                createVideo(res);
            })
        });
    });
}
document.getElementById('closed').onclick = function () {
    script();
};
document.getElementById('close').onclick = function () {
    script();
}; 

function createVideo(value) {
    player = new YT.Player('player', {
        videoId: value, // YouTube Video ID
        width: 560, // Player width (in px)
        height: 316, // Player height (in px)
        playerVars: {
            start: 0,
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
}
function updateSlider() {
    player.setVolume(slide.value);
}
function onYouTubeIframeAPIReady() {
    document.getElementById("player").setAttribute("allow:", autoplay);
    console.log("Ok")
}

function onPlayerReady(event) {
    console.log("hey Im ready");
    event.target.unMute();
    event.target.setVolume(slide.value);
    event.target.playVideo();
}


function onPlayerStateChange(event) {
    event.target.playVideo();
}