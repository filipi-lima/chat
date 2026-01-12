// Login elements
const login = document.querySelector('.login')
const loginForm = login.querySelector('.login__form')
const loginInput = login.querySelector('.login__input')

// Chat elements
const chat = document.querySelector('.chat')
const chatForm = chat.querySelector('.chat__form')
const chatInput = chat.querySelector('.chat__input')
const chatMessages = chat.querySelector('.chat__messages')

const colors = [
    'cadetblue',
    'darkgoldenrod',
    'cornflowerblue',
    'darkkhaki',
    'hotpink',
    'gold'
]

const user = {id: '', name: '', color: ''}

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement('div')
    div.classList.add('message__self')
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (userName, userColor, content) => {
    const div = document.createElement('div')
    div.classList.add('message__other')

    const sender = document.createElement('span')
    sender.classList.add('sender')
    sender.innerHTML = userName
    sender.style.color = userColor
    div.appendChild(sender)

    div.innerHTML += content

    return div
}

const createMessageServer = (content) => {
    const div = document.createElement('div')
    div.classList.add('message__server')
    div.innerHTML = content

    return div
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content, messageServer} = JSON.parse(data)
    let message = ''

    if (messageServer) {
        message = createMessageServer(content)
    } else {
        message = 
            user.id == userId 
                ? createMessageSelfElement(content)
                : createMessageOtherElement(userName, userColor, content)
    }
    
    chatMessages.appendChild(message)

    scrollScreen()
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const handleLogin = (event) => {
    event.preventDefault()
   
    user.name = loginInput.value
    user.id = crypto.randomUUID()
    user.color = getRandomColor()

    login.style.display = 'none'
    chat.style.display = 'flex'

    websocket = new WebSocket('wss://chat-backend-idsp.onrender.com')

    websocket.onopen = () =>
        websocket.send(JSON.stringify({
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: `${user.name} entrou no chat`,
            messageServer: true
        }))

    websocket.onmessage = processMessage

    console.log(user)
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ''
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)
