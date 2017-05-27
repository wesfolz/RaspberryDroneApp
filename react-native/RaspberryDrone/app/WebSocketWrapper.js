class WebSocketWrapper {

	constructor(url, onMessageCallback) {
		this.socket = null;
		this.url = url;// 'ws://192.168.0.102:8080/websocket';
		this.onMessageCallback = onMessageCallback;
	}

	connect = () => {
		this.socket = new WebSocket(this.url);

		this.socket.onmessage = (e) => {
		  // a message was received
  		  console.log(e.data);
		  this.onMessageCallback(e.data);
		};

		this.socket.onerror = (e) => {
		  // an error occurred
		  console.log(e.message);
		};

		this.socket.onclose = (e) => {
		  // connection closed
		  this.onMessageCallback('socketClosed');
		  console.log(e.code, e.reason);
		};
	};

	send = (message) => {
		if(this.socket) {
			console.log('sending');
			this.socket.send(message);
		}
		else
			console.log('socket null');
	};

	disconnect = () => {
    if (!this.socket) {
      return;
    }
    this.socket.close();
    this.socket = null;
  };

}
export default WebSocketWrapper;