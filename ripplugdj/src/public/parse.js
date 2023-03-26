import ytdl from "ytdl-core"
import fs from "fs"
var code, len, title
var url = "https://www.youtube.com/watch?v=gp4z85YAqh8&ab_channel=BeyondGaia%27sHorizon"
let getData = function(url) {
    return ytdl.getBasicInfo(url).then(token => { return token })
}
let data = getData(url)
data.then(function(result) {
    code = result['videoDetails']['videoId']
    len = result['videoDetails']['lengthSeconds']
    title = result['videoDetails']['title']
  })
var feed = {name: title, code: code, lenght: len}
fs.readFile("../songs.json", "utf-8", function readFileCallback(err, datas){
  if (err){
      console.log(err);
  } else {
  obj = JSON.parse(datas); //now it an object
  obj.table.push({feed}); //add some data
  json = JSON.stringify(obj); //convert it back to json
  fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
}})