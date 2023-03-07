var mysql = require('mysql');
const yt = require('yt-dlp-wrap').default;
var jQuary = require('jquery')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tempplaylist"
});

function insertSong() {
    con.connect(function(err) {
        if (err) throw err;
        con.query("INSERT INTO song (code,name,lenght,", function(err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
}



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

function parse(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    match = url.match(regExp);
    if (match && match[2].length == 11) {
        console.log(match[2]);
        return match[2];
    } else {
        console.log("not a valid URL")
    }
}

$.ajax({
    url: "/api/getWeather",
    data: {
        zipcode: 97201
    },
    success: function(result) {
        $("#weather-temp").html("<strong>" + result + "</strong> degrees");
    }
});