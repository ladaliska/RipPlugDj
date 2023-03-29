import ytdl from "ytdl-core"
import fs from "fs"
var code, len, title, data, feed

function queue(url){
  data = ytdl.getBasicInfo(url)
  data.then(function (result){
    code = result['videoDetails']['videoId']
    len = result['videoDetails']['lengthSeconds']
    title = result['videoDetails']['title']
  }).then(async function() {
      fs.readFile("./songs.json","utf8", (err, done)=>{
        var obj = JSON.parse(done)
        feed = {title:title, code:code, lenght: len, order:Object.keys(obj).length}
        obj.push(feed)
        console.log(obj)
        var str = JSON.stringify(obj)
        fs.writeFile("./songs.json", str, (callback)=>{})
      })
    }
  )
  }