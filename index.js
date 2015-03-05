var express =   require("express"),
    app     =   express(),
    http    =   require("http").Server(app)
    path    =   require("path"),
    io      =   require("socket.io")(http);

var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname,"dist")));

var players = [];
io.on("connect", function(socket){
    if(typeof players[socket.id] === "undefined"){
        console.log("Player %s connected", socket.id);
        players[socket.id] = {};
    }

    socket.on("player infos", function(data){
       socket.broadcast.emit("player update", data);
    });

    socket.on("disconnect", function(){
        if(typeof players[this.id] !== "undefined"){
            delete players[this.id];
        }
        socket.broadcast.emit("player delete", this.id);
        console.log("Player %s disconnected",this.id);
    });
});



http.listen(port, function(){
    console.log("listening to port %s", port);
});