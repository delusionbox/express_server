const socket = io();
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const myId = Math.random().toString(36).substring(2, 9);
const players = {};

let x = Math.random() * 800;
let y = Math.random() * 600;

const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

//notice my position
function sendPosition() {
    socket.emit("move", { id: myId, x, y });
};

//respon position
socket.on("move", data => {
    players[data.id] = data;
});

socket.on('disconnectPlayer', id => {
    delete players[id];
});

//rendering
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //me
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    //another player
    ctx.fillStyle = "red";
    for (const id in players) {
        const p = players[id];
        if (id !== myId) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

function update() {
    const speed = 3;
    if (keys["ArrowUp"]) y -= speed;
    if (keys["ArrowDown"]) y += speed;
    if (keys["ArrowLeft"]) x -= speed;
    if (keys["ArrowRight"]) x += speed;

    sendPosition();
    draw();
    requestAnimationFrame(update);
}

update();
