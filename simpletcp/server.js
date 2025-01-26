const net = require("net");
//net module is an asynchronous api for providing
//tcp or ipc(inter process communication) servers
const server = net.createServer((socket) => {
  //socket is a duplex stream of tcp, it will be create whenever some client connects to the server
  // console.log(socket, "socket");
  socket.on("data", (data) => {
    console.log(data);
  });
});

server.listen(3099, "127.0.18.1", () => {
  console.log("opened server on ,", server.address());
});

/**
 * TCP -> Transmission Control Protocol
 *
 * moves a byte stream from one place to another.
 * TCP is a connection-oriented protocol that provides reliable data transfer between two devices on a network.
 *
 *
 * TCP HEADER
 *
 * 1. Source Port(16 bits) - the port number of the sender
 * 2. Destination Port(16 bits) - the port number of the receiver
 * 3. Sequence Number(32 bits) - the sequence number of the first byte in the segment
 * 4. Acknowledgement Number(32 bits) - the sequence number of the next byte expected by the receiver
 * 5. Data Offset(4 bits) - the number of 32-bit words in the header
 * 6. Reserved(6 bits) - reserved for future use
 * 7. Control Bits(6 bits) - flags that control the connection
 * 8. Window(16 bits) - the number of bytes the receiver is willing to accept
 * 9. Checksum(16 bits) - error checking
 *
 */
