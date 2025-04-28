class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Map();
    this.pendingSubscriptions = [];
  }

  connect() {
    const token = localStorage.getItem('token');
    // this.socket = new WebSocket(`wss://port-0-workermangers-be-m9ax68es6a756190.sel4.cloudtype.app/ws-chat?token=${token}`);
    this.socket = new WebSocket(`ws://localhost:8080/ws-chat?token=${token}`);
    this.socket.onopen = () => {
      console.log('WebSocket 연결 성공');
      // 연결이 열린 후에만 구독 메시지 전송
      this.pendingSubscriptions.forEach(({ roomId }) => {
        this.socket.send(JSON.stringify({ type: 'SUBSCRIBE', roomId }));
      });
      this.pendingSubscriptions = [];
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const handlers = this.messageHandlers.get(message.roomId) || [];
      handlers.forEach(handler => handler(message));
    };

    this.socket.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket 에러:', error);
    };
  }

  subscribe(roomId, handler) {
    if (!this.messageHandlers.has(roomId)) {
      this.messageHandlers.set(roomId, []);
    }
    this.messageHandlers.get(roomId).push(handler);

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'SUBSCRIBE', roomId }));
    } else {
      // 아직 연결이 안 됐으면 큐에 저장
      this.pendingSubscriptions.push({ roomId });
    }
  }

  unsubscribe(roomId, handler) {
    const handlers = this.messageHandlers.get(roomId);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  sendMessage(roomId, content) {
    this.socket.send(JSON.stringify({
      type: 'MESSAGE',
      roomId: roomId,
      content: content
    }));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const websocketService = new WebSocketService(); 