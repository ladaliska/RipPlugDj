import express from 'express';
import http from "http";
import { Server } from "socket.io";
import * as url from 'url';
import fs from "fs"
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  }
});
app.get('/', (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://www.youtube.com/")
  res.set("Cross-Origin-Resource-Policy", "cross-origin")
  res.sendFile(__dirname + '/index.html');

  app.use(express.static(__dirname+"/public"))

});

var json;
var count = 0;
var sec = 0;
var isRunning = 0;
var actual

function first(){
  if (isRunning == 0){
    isRunning = 1;
    second()
  }
  else {
    sendSong()
  }
  
}

function second(){
  var data = fs.readFileSync("./songs.json")
  json = JSON.parse(data)
  sendSong()
  timer()
}

function timer(){
    var call = setInterval(()=>{
      console.log(sec, "s")
      sec++
      if(sec == json[count]["lenght"]){
        console.log("song ended")
        clearInterval(call)
        sec=0
        isRunning = 0
      }
    }, 1000)
}

function sendSong(){
  actual = {code:json[count]["code"], sec:sec}
  io.emit("song", actual)
  console.log(actual)
}

io.on('connection', (socket) => {
  first();
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
