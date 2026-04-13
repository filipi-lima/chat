// Classes
import Message from "./classes/Message.js";
import Utils from "./classes/Utils.js";

// Login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");
const errorMessage = login.querySelector(".error-message");

// Chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");
const responseContainer = chat.querySelector(".response__container");
const usersConnectedElement = chat.querySelector(".users-connected");
const numberUsersConnected = chat.querySelector(".number-users-connected");

// UserSchema
const user = { id: "", name: "", color: "" };

let websocket;
let messageResponse;
let users;

const processMessage = ({ data }) => {
    const {
        usersConnected,
        userId,
        userName,
        userColor,
        content,
        messageServer,
        messageResponse,
    } = JSON.parse(data);
    let message = "";

    if (messageServer) {
        users = usersConnected;
        setListUsersConnected();
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

    Utils.scrollScreen();
};

const handleLogin = async (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = Utils.getRandomColor();

    try {
        const response = await fetch("https://chat-backend-idsp.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                userName: user.name.trim().toLowerCase(),
                userColor: user.color,
            }),
        });

        if (response.ok) {
            websocket = new WebSocket("wss://chat-backend-idsp.onrender.com");

            login.style.display = "none";
            chat.style.display = "flex";

            setupWebSocket();
        } else {
            const data = await response.json();
            errorMessage.textContent = data.message;
        }
    } catch (error) {
        errorMessage.textContent = "Ocorreu um erro. Tente novamente mais tarde";
    }
};

const setupWebSocket = async () => {
    websocket.onopen = () =>
        websocket.send(
            JSON.stringify({
                userId: user.id,
                userName: user.name,
                createUser: true,
            }),
        );

    websocket.onmessage = processMessage;
    chatInput.focus();
};

const setListUsersConnected = () => {
    const usersName = users
        .slice(0, 3)
        .map((user) => Utils.capitalize(user.userName))
        .join(", ");

    usersConnectedElement.innerHTML = usersName;
    numberUsersConnected.innerHTML = `${users.length} online`;
    numberUsersConnected.innerHTML = `${users.length} online`;
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
    chatMessages.style.paddingBottom = "70px"
    chatInput.focus();
};

const handleResponse = (event) => {
    const messageElement = event.target.closest(".message__other, .message__self");
    if (!messageElement) return;

    const { userId, userName, userColor, content } = messageElement.dataset;

    responseContainer.replaceChildren();
    responseContainer.style.display = "block";

    const responseText = document.createElement("span");
    responseText.innerHTML = `Responder <b style="color: ${userColor}">${userName}</b>: `;
    
    const textPreview = document.createElement("em");
    textPreview.textContent = content.length > 25 ? `${content.substring(0, 25)}...` : content;
    responseText.appendChild(textPreview);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-response");
    removeBtn.type = "button";
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    
    responseContainer.append(responseText, removeBtn);
    chatMessages.style.paddingBottom = "115px"

    messageResponse = { userId, userName, userColor, content };
    chatInput.focus();
};

// Events
loginForm.addEventListener("submit", handleLogin);
loginInput.addEventListener("input", () => (errorMessage.textContent = ""));
chatForm.addEventListener("submit", sendMessage);
chatMessages.addEventListener("dblclick", handleResponse);
responseContainer.addEventListener("click", ({ target }) => {
    if (target.closest(".remove-response")) {
        responseContainer.style.display = "none";
        responseContainer.innerHTML = ""
        chatMessages.style.paddingBottom = "70px"
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
