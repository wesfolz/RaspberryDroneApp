
class WebSocketWrapper {
	
	constructor() {
		this.ws = new WebSocket('ws://192.168.0.103:8080/websocket');

		this.ws.onmessage = (e) => {
		  // a message was received
		  console.log(e.data);
		}

		this.ws.onerror = (e) => {
		  // an error occurred
		  console.log(e.message);
		}

		this.ws.onclose = (e) => {
		  // connection closed
		  console.log(e.code, e.reason);
		}
	}

	send(message)
	{
		this.ws.send(message);
	}
}
export default WebSocketWrapper;