import express from 'express';
import http from "http";
import { Server } from "socket.io";
import * as url from 'url';
import ytdl from "ytdl-core"
//Config load
console.log("Loading config....");
var config, call, Tsync;
import fs from 'fs'
if(fs.existsSync('config/config.json')) {
  let rawconfig = fs.readFileSync('config/config.json');
  config = JSON.parse(rawconfig);
} else {
  console.log("Config not found, exiting...")
  process.exit(1);
}
console.log("Config Loaded")

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  }
});
app.get('/test', (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://www.youtube.com/")
  res.set("Cross-Origin-Resource-Policy", "cross-origin")
  res.sendFile(__dirname + '/test.html');
  app.use(express.static(__dirname+"/public"))
});
app.get('/', (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://www.youtube.com/")
  res.set("Cross-Origin-Resource-Policy", "cross-origin")
  res.set("Same-Site", "None")
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(__dirname+"/public"))
});

var obj = [];
var isRunning = 0, sec = 0, feed;
var count = 0

function sendSongToAll(){
    if(count < obj.length){
        isRunning = 1
        timer();
        io.emit("song", actualSong())
    }
    else {
        io.emit("empty")
    }
    
}

function sendSongOnConnection(socket){
    if(count < obj.length){
        socket.emit("song", actualSong())
    }
    else {
        socket.emit("empty")
    }
}

function timer(){
  var time = obj[count]["length"]
    call = setInterval(()=>{
      if(sec >= time){
        console.log("song ended")
        clearInterval(call)
        sec=0
        isRunning = 0
        count += 1
        scrap()
      }
      sec++
    }, 1000)
}

function scrap(){
    io.emit("clear")
    sendSongToAll()
    sendPlaylist()
}

function skip(){
  if(isRunning == 1){
  clearInterval(call)
  sec=0
  isRunning = 0
  count += 1
  scrap()
  }
}

function insert(url){
    var data = ytdl.getBasicInfo(url)
    data.then(function (result){
        feed = {title:result['videoDetails']['title'], code:result['videoDetails']['videoId'], length: result['videoDetails']['lengthSeconds'], order:obj.length}
        obj.push(feed)
        sendPlaylist()
        if (isRunning == 0){
            sendSongToAll()
        }
    })}

  Tsync = setInterval(()=>{
    io.emit("time", sec)
  }, 5000)



function sendPlaylist(socket){
  if (socket == null){
    let playlist = []
    for (let i = count; i < obj.length; i++) {
      playlist.push(obj[i]["title"])
    }
    io.emit("playlist", playlist)}
    else {
      let playlist = []
    for (let i = count; i < obj.length; i++) {
      playlist.push(obj[i]["title"])
    }
    socket.emit("playlist", playlist)
    }
  }

io.on("connection", (socket)=>{
  //console.log("connected:",socket["id"])
  socket.onAny((event, arg) => {
    if (event == "ready"){
      sendPlaylist(socket)
      sendSongOnConnection(socket)
    }
    else if(event == "insert"){
      insert(arg)
    }
    else if(event == "skip"){
      skip()
    }
  })  
})

function actualSong(){
  return {code:obj[count]["code"], sec:sec}
}

server.listen(3000, () => {
    console.log('listening on *:3000');
  });