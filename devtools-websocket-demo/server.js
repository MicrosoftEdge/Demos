import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  ws.on('error', console.error);
  
  const ip = req.socket.remoteAddress;
  console.log(`New connection from ${ip}`);

  ws.on('message', function message(data) {
    // Message received from a client.
    // Sending the same message back to the client.
    ws.send("" + data);
  });
});
