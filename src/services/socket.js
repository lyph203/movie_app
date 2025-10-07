import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

let client = null;

export function connect(onConnect = () => {}) {
  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    debug: () => {},
    reconnectDelay: 5000,
    onConnect: () => onConnect(client),
  });
  client.activate();
  return client;
}

export function disconnect() {
  if (client) client.deactivate();
  client = null;
}

export function subscribe(topic, callback) {
  if (!client) return null;
  return client.subscribe(topic, (message) => {
    if (message.body) callback(JSON.parse(message.body));
  });
}

export function send(destination, payload) {
  if (!client) return;
  client.publish({ destination, body: JSON.stringify(payload) });
}
