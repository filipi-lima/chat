const { WebSocketServer } = require("ws");
const app = require("./app.js");
const db = require("./database");
const http = require("http");
require("dotenv").config();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.post("/", async (req, res) => {
    const { userId, userName, userColor } = req.body;

    if (!userId || !userName || !userColor) {
        return res
            .status(400)
            .json({ message: "Todos os campos são obrigatorios" });
    }

    const user = await db.User.findOne({ userName });

    if (user) {
        return res
            .status(400)
            .json({ message: "Já existe alguém com esse nome" });
    }

    await db.User.create({ _id: userId, userName, userColor });

    return res.status(200).json({ message: "Usuário conectado com sucesso!" });
});

wss.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", async (data) => {
        const payload = JSON.parse(data.toString());

        if (payload.createUser) {
            ws.userName = payload.userName;
            ws.userId = payload.userId;

            const usersConnected = await db.User.find({});
            const joinMessage = {
                usersConnected,
                content: `${ws.userName} entrou no chat`,
                messageServer: true,
            };

            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify(joinMessage));
                }
            });
        } else {
            // Repassa as mensagens normais do chat
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(data.toString());
                }
            });
        }
    });

    ws.on("close", async () => {
        if (ws.userName) {
            await db.User.findByIdAndDelete(ws.userId);

            const leaveMessage = {
                usersConnected: await db.User.find({}),
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

const PORT = process.env.PORT || 8080;
db.connectDB().then(async () => {
    await db.User.deleteMany({});
    server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});
