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
const responseContainer = chat.querySelector(".response__container");

// UserSchema
const user = { id: "", name: "", color: "" };
let websocket;
let messageResponse = null;

const processMessage = ({ data }) => {
    const {
        userId,
        userName,
        userColor,
        content,
        messageServer,
        messageResponse,
    } = JSON.parse(data);
    let message = "";

    if (messageServer) {
        message = Message.createMessageServerElement(content);
    } else {
        message =
            user.id == userId
                ? Message.createMessageSelfElement(
                      userId,
                      userName,
                      userColor,
                      content,
                      messageResponse,
                  )
                : Message.createMessageOtherElement(
                      userId,
                      userName,
                      userColor,
                      content,
                      messageResponse,
                  );
    }

    chatMessages.appendChild(message);

    scrollScreen();
};

const handleLogin = (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("wss://chat-backend-idsp.onrender.com");

    websocket.onopen = () =>
        websocket.send(
            JSON.stringify({
                userName: user.name,
                content: `${user.name} entrou no chat`,
                messageServer: true,
            }),
        );

    websocket.onmessage = processMessage;
    chatInput.focus();
};

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
        messageServer: false,
        messageResponse,
    };

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
    messageResponse = null;
    responseContainer.style.display = "none";
    chatInput.focus();
};

const handleResponse = (event) => {
    const messageElement = event.target.closest(".message__other, .message__self",);
    if (!messageElement) return;

    const { userId, userName, userColor, content } = messageElement.dataset;

    responseContainer.style.display = "block";
    responseContainer.innerHTML = `
        <span>Responder <b style="color: ${userColor}">${userName}</b>: ${content}</span>
        <button type="button" class="remove-response">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    messageResponse = { userId, userName, userColor, content };
    chatInput.focus();
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
chatMessages.addEventListener("dblclick", handleResponse);
responseContainer.addEventListener("click", ({ target }) => {
    if (target.closest(".remove-response")) {
        responseContainer.style.display = "none";
        messageResponse = null;
    }
});

// Touch events
let pressTimer;

chatMessages.addEventListener("touchstart", (event) => {
    pressTimer = setTimeout(() => {
        handleResponse(event);
    }, 500);
});

chatMessages.addEventListener("touchend", () => clearTimeout(pressTimer));
chatMessages.addEventListener("touchmove", () => clearTimeout(pressTimer));
