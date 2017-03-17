class WebSocketWrapper {
	
	constructor() {
		var ws = new WebSocket('ws://localhost:8080');
		ws.onopen = () => {
		  // connection opened

		  ws.send('something'); // send a message
		}

		ws.onmessage = (e) => {
		  // a message was received
		  console.log(e.data);
		}

		ws.onerror = (e) => {
		  // an error occurred
		  console.log(e.message);
		}

		ws.onclose = (e) => {
		  // connection closed
		  console.log(e.code, e.reason);
		}
	}
}
export default WebSocketWrapper;