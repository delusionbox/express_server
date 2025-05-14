const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("move", (data) => {
        //another user deliver
        socket.broadcast.emit("move", data);
    });

    socket.on("disconnect", () => {
        io.emit("user disconnect", socket.id);
    });
});

http.listen(port, () => {
    console.log(`server is running: http://localhost:${port}`);
});