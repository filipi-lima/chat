import Message from "./classes/Message.js";
import getRandomColor from "./utils/getRandomColor.js";
import scrollScreen from "./utils/scrollScreen.js";

// Login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// Chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

// UserSchema
const user = { id: "", name: "", color: "" };
let websocket;

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content, messageServer } =
        JSON.parse(data);
    let message = "";

    if (messageServer) {
        message = Message.createMessageServer(content);
    } else {
        message =
            user.id == userId
                ? Message.createMessageSelfElement(content)
                : Message.createMessageOtherElement(
                      userName,
                      userColor,
                      content,
                  );
    }

    chatMessages.appendChild(message);

    scrollScreen();
};

const handleLogin = (event) => {
    event.preventDefault();

    user.name = loginInput.value;
    user.id = crypto.randomUUID();
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("wss://chat-backend-idsp.onrender.com");

    websocket.onopen = () =>
        websocket.send(
            JSON.stringify({
                userId: user.id,
                userName: user.name,
                userColor: user.color,
                content: `${user.name} entrou no chat`,
                messageServer: true,
            }),
        );

    websocket.onmessage = processMessage;

    console.log(user);
};

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
        messageServer: false,
    };

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
