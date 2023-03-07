const fs = require('fs');
const ytdl = require('ytdl-core');
url = "https://www.youtube.com/watch?v=RZAq-_gz_W8"
let getData = function(url) {
    return ytdl.getBasicInfo(url).then(token => { return token })
}
let data = getData(url)
data.then(function(result) {
    console.log(result['videoDetails']['videoId'])
    console.log(result['videoDetails']['lengthSeconds'])
})