const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", (data) => {
        const payload = JSON.parse(data.toString());

        if (payload.createUser) {
            ws.userName = payload.userName;
        }

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(data.toString());
            }
        });
    });

    ws.on("close", () => {
        if (ws.userName) {
            const leaveMessage = {
                content: `${ws.userName} saiu do chat`,
                messageServer: true,
            };

            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify(leaveMessage));
                }
            });
        }
    });
});
