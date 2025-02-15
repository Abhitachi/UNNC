const net = require("net");
const fs = require("node:fs/promises");

//creating a server
const server = net.createServer((socket) => {
  console.log(socket, "socket");
});

//whenever someone connect log the message
server.on("connection", (socket) => {
  console.log("new connection");
  let fileHandle, fileStream;

  //whenever recieve the data create a file
  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause(); //pause receiving data from client;
      const indexOfDivider = data.indexOf("--------");
      const fileName = data.subarray(10, indexOfDivider);
      //create a file
      fileHandle = await fs.open(`storage/${fileName}`, "w");
      //create a writable stream to write to the file
      fileStream = fileHandle.createWriteStream();
      fileStream.write(data.subarray(indexOfDivider + 7));
      socket.resume(); //resume receving data after creating the file
      fileStream.on("drain", () => {
        socket.resume(); //when internal stream buffer is empteid start listening to the socket
      });
    } else {
      //write the data
      if (!fileStream.write(data)) {
        socket.pause(); //when my stream becomes not writable stop listening from socket
      }
    }
  });

  socket.on("end", () => {
    if (fileHandle) fileHandle.close();
    fileHandle = undefined;
    fileStream = undefined;
    console.log("connection ended");
  });
});

server.listen("5050", () => {
  console.log("server started");
});
