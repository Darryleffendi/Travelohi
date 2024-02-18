

export function getSocketConnection(messageFunction : any) : WebSocket {
    const socket = new WebSocket('ws://localhost:8000/game');

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({'request': 'Establish Connection'}))
    });

    // Listen for messages
    socket.addEventListener('message', messageFunction);

    return socket;
}