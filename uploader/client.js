const net = require("net");
const fs = require("node:fs/promises");
const path = require("path");

//clear line
const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const client = net.createConnection({ host: "::1", port: "5050" }, async () => {
  //take filename from cmd
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  const fileHandle = await fs.open(filePath, "r");
  const fileStream = fileHandle.createReadStream();
  const fileSize = (await fileHandle.stat()).size;

  //for progress line
  let uploadedPercentage = 0;
  let bytesUploaded = 0;

  client.write(`fileName: ${fileName}--------`);

  console.log();

  fileStream.on("data", async (data) => {
    if (!client.write(data)) {
      fileStream.pause(); //when the size of client internal buffer hits hight water markvalue stop reading from the fileStream
    }
    bytesUploaded += data.length; //updating bytes read
    let newPercentage = Math.floor((bytesUploaded / fileSize) * 100);
    if (newPercentage != uploadedPercentage) {
      uploadedPercentage = newPercentage;
      await moveCursor(0, -1);
      await clearLine(0);
      if (newPercentage !== 100) {
        console.log(`Uploading....${uploadedPercentage}%`);
      } else {
        console.log(`Uploaded....${uploadedPercentage}%`);
      }
    }
    client.on("drain", () => {
      fileStream.resume(); //once the client internal buffer becomes free start writing to the client
    });
  });

  fileStream.on("end", () => {
    console.log("the file was successfully uploaded");
    client.end(); //close connection after reading the file
  });
});
