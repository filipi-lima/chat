class Message {
    static createMessageSelfElement = (content) => {
        const div = document.createElement("div");
        div.classList.add("message__self");
        div.innerHTML = content;

        return div;
    };

    static createMessageOtherElement = (userName, userColor, content) => {
        const div = document.createElement("div");
        div.classList.add("message__other");

        const sender = document.createElement("span");
        sender.classList.add("sender");
        sender.innerHTML = userName;
        sender.style.color = userColor;

        const messageText = document.createElement("span");
        messageText.textContent = content;

        div.appendChild(sender);
        div.appendChild(messageText)

        return div;
    };

    static createMessageServer = (content) => {
        const div = document.createElement("div");
        div.classList.add("message__server");
        div.textContent = content;

        return div;
    };
}

export default Message
