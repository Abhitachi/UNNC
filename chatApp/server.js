const net = require("net");
const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  console.log("A new connection has been established.");
  const clientId = clients.length + 1;

  socket.write(`id-${clientId}`);
  clients.map((s) => {
    s.write(`User ${clientId} joined !`);
  });
  socket.on("data", (data) => {
    clients.forEach((client) => {
      if (client !== socket) {
        client.write(`User ${clientId} says: ${data}`);
      }
    });
  });
  clients.push(socket);
});

server.listen({ port: 3098, host: "localhost" }, () => {
  console.log("server is listening on port 3099");
});
