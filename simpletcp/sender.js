const net = require("net");

const socket = net.createConnection({ host: "localhost", port: 3099 }, () => {
  const buff = Buffer.alloc(2);
  buff[0] = 12;
  buff[1] = 34;

  socket.write(buff);
});
