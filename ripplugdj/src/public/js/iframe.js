import { Manager } from "socket.io-client"

const manager = new Manager(document.URL);

const socket = manager.socket("/"); // main namespace

console.log("running")
loadYoutubeIFrameApiScript();

function loadYoutubeIFrameApiScript() {
  console.log("called load")
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    tag.onload = call();
  }


function call(){
  console.log("loaded")
  socket.emit("ready");
}
socket.on("song", (res) => {
    console.log("answer song - ", res)
    setupPlayer(res["code"], res["sec"])
});

socket.on("clear", () => {
  console.log("clear");
  prepfornext();
})

socket.on("empty", () => {
  console.log("empty playlist")
})

socket.on("playlist", (arg) => {
  console.log(arg)
  clearTable()
  createTable(arg)
})

socket.on("time", (arg) => {
  console.log("Sync:", arg)
  console.log("Player is On:", player.getCurrentTime())
  if ((arg-player.getCurrentTime())>0.5 || (arg-player.getCurrentTime())<-0.5){
    console.log("syncing")
    player.seekTo(arg, true)
  }
})

    let player = null;
    function setupPlayer(id, time) {  
    YT.ready(function() {
        player = new window.YT.Player('player', {
            videoId: id, // YouTube Video ID
            width: 	384, // Player width (in px)
            height: 216, // Player height (in px)
            playerVars: {
                start: time,
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
      });
  
    function onPlayerStateChange(event) {
      var videoStatuses = Object.entries(window.YT.PlayerState);
      console.log(videoStatuses.find(status => status[1] === event.data)[0]);
      player.setPlaybackQuality("small");
      if (videoStatuses.find(status => status[1] === event.data)[0] == "ENDED"){
        prepfornext();
      }
      else if (videoStatuses.find(status => status[1] === event.data)[0] == "PAUSED"){
        player.playVideo();
      }
    }
  }
    function onPlayerReady(event) {
        console.log("hey Im ready");
        event.target.unMute();
        event.target.setVolume(slide.value);
        event.target.playVideo()
    }

function prepfornext(){
  var newplayer = document.createElement("div")
  newplayer.setAttribute("id", "player")
  newplayer.setAttribute("class", "player")
  document.getElementById("player").replaceWith(newplayer)
}

var slide = document.getElementById("slide")
slide.onchange = function updateSlider() {
  player.setVolume(slide.value);
}
  
var field = document.getElementById("field")
var submit = document.getElementById("submit")
submit.onclick = function insert(){
  console.log("click")
  socket.emit("insert", field.value)
}

var skipBtn = document.getElementById("skipBtn")
skipBtn.onclick = function insert(){
  console.log("skip")
  socket.emit("skip")
}

function createTable(playlist){
  var theTable = document.createElement('table');
  theTable.setAttribute("id", "table")
  for (var i = 0, tr, td; i < playlist.length && i < 15; i++) {
      tr = document.createElement('tr');
      td = document.createElement('td');
      td.appendChild(document.createTextNode(playlist[i]));
      tr.appendChild(td);
      theTable.appendChild(tr);
  }

  document.getElementById('playlist').appendChild(theTable);
}

function clearTable(){
  var theTable = document.getElementById("table")
  theTable.remove()
}

function searchSong(url){

}
