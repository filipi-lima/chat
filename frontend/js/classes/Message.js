class Message {
    static createMessageSelfElement = (
        userId,
        userName,
        userColor,
        content,
        messageResponse,
    ) => {
        const div = document.createElement("div")
        div.classList.add("message__container")

        const message = document.createElement("div");
        message.classList.add("message__self");
        message.dataset.userId = userId;
        message.dataset.userName = userName;
        message.dataset.userColor = userColor;
        message.dataset.content = content;

        if (messageResponse)
            message.appendChild(this.createResponseElement(messageResponse));

        message.innerHTML += content;
        div.appendChild(message)

        return div;
    };

    static createMessageOtherElement = (
        userId,
        userName,
        userColor,
        content,
        messageResponse,
    ) => {
        const div = document.createElement("div")
        div.classList.add("message__container")

        const message = document.createElement("div");
        message.classList.add("message__other");
        message.dataset.userId = userId;
        message.dataset.userName = userName;
        message.dataset.userColor = userColor;
        message.dataset.content = content;

        if (messageResponse)
            message.appendChild(this.createResponseElement(messageResponse, userId));

        const sender = document.createElement("span");
        sender.classList.add("user__name");
        sender.classList.add("sender");
        sender.innerHTML = userName;
        sender.style.color = userColor;

        const messageText = document.createElement("span");
        messageText.textContent = content;

        message.appendChild(sender);
        message.appendChild(messageText);

        div.appendChild(message)
        return div;
    };

    static createMessageServerElement = (content) => {
        const div = document.createElement("div");
        div.classList.add("message__server");
        div.textContent = content;

        return div;
    };

    static createResponseElement = (messageResponse) => {
        const div = document.createElement("div");
        div.classList.add("message__response");

        const userName = document.createElement("span");
        userName.textContent = `${messageResponse.userName}: `
        userName.style.color = messageResponse.userColor;
        userName.style.fontWeight = "bold"
        div.appendChild(userName);

        div.innerHTML += messageResponse.content;
        div.style.borderLeft = `5px solid ${messageResponse.userColor}`;

        return div;
    };
}

export default Message;
