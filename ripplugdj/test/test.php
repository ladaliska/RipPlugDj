<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="index.css">
    <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js'></script>
</head>

<body>
    <div id="whole">
        <div id="env">
            <div id="player"></div>
            <br id="spacer">
            <input type="text" id="test" value="" />
            </br>
            <button id="testButton">Submit Response</button>
            <script src='./iframe.js'></script>
            <script>
                document.getElementById("testButton").onclick = function () {
                    var url = document.getElementById("test").value
                    console.log(url)
                    fetch("./getdata.py", {
                        method: 'POST',
                        body: JSON.stringify(url), 
                    })
                        .then(Response => Response.json()) 
                }
            </script>
            <input id="slide" type="range" min="0" max="100" step="1" value="10" onchange="updateSlider(this.value)">
            <button id="Logout">Logout</button>
            <script>
                    document.getElementById("Logout").onclick = function () {
                        location.href = "./logout.php";
                    };
            </script>
        </div>
        <div id="playlist">
            <div id="head">
                <p>Playlist</p>
            </div>
            <div id="cont"></div>
        </div>
    </div>
</body>

</html>

<?php
// Initialize the session
session_start();

// Check if the user is logged in, if not then redirect him to login page
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: ../login");
    exit;
}
?>