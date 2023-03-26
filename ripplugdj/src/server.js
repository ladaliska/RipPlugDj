import express from 'express';
import http from "http";
import { Server } from "socket.io";
import * as url from 'url';
import fs from "fs"
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const exp = express;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  }
});

var data = fs.readFileSync("./songs.json")
var senddata = JSON.parse(data)

app.get('/', (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://www.youtube.com/")
  res.set("Cross-Origin-Resource-Policy", "cross-origin")
  res.sendFile(__dirname + '/index.html');

  app.use(express.static(__dirname+"/public"))

});
io.on('connection', (socket) => {
  socket.on("waiting", (arg, callback) => {
    console.log(senddata[0]['code'])
    callback(senddata[0]['code'])
  })
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});
