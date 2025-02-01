const net = require("net");
const { moveCursor } = require("readline");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin, //input is from the terminal
  output: process.stdout, //output is to the terminal
});

//clear the line in the terminal on the basis of direction.
// if direction is 0 then clear the line to the left of the cursor
// if direction is 1 then clear the line to the right of the cursor
const clearLine = (direction) => {
  return new Promise((res, rej) => {
    process.stdout.clearLine(direction, () => {
      res();
    });
  });
};

const moveCurs = (dx, dy) => {
  return new Promise((res, rej) => {
    //move the cursor to the left by dx and up by dy from its relative position
    process.stdout.moveCursor(dx, dy, () => {
      res();
    });
  });
};

let id;
//create connection return a socket object
const socket = net.createConnection({ host: "localhost", port: 3098 }, () => {
  const ask = async () => {
    console.log("connected to the server");

    const message = await rl.question("Enter your message: ");
    //move the cursor line up
    await moveCurs(0, -1); //move the cursor up by 1 line
    //clear the line from the  current cursor line
    await clearLine(0);
    socket.write(message);
  };

  ask();

  socket.on("connection", (data) => {
    if (data.substring(0, 2) === "id") {
      id = data.substring(3);
      console.log(`Your id is ${id}`);
    }
  });
  socket.on("data", async (data) => {
    //log the empty line
    console.log();
    //move the cursor line up
    await moveCurs(0, -1);
    //clear the line from the current cursor line
    await clearLine(0);
    //log the data from the server
    console.log(data.toString("utf-8"));
    ask();
  });
});

socket.on("end", () => {
  console.log("disconnected from the server");
});
