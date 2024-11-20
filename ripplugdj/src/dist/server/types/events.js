export var SocketEvents;
(function (SocketEvents) {
    SocketEvents["Ready"] = "ready";
    SocketEvents["Insert"] = "insert";
    SocketEvents["Skip"] = "skip";
    SocketEvents["Song"] = "song";
    SocketEvents["Clear"] = "clear";
    SocketEvents["Empty"] = "empty";
    SocketEvents["Playlist"] = "playlist";
    SocketEvents["Time"] = "time";
})(SocketEvents || (SocketEvents = {}));
