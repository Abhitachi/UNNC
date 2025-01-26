const fs = require("node:fs/promises");
//fileSize = 1gb
//memoryUsage = 1gb
//time = 900ms
// (async () => {
//   const destFile = await fs.open("writeFile.txt", "w");
//   const srcFile = await fs.open("readFile.txt", "r");

//   const content = await srcFile.readFile();
//   await destFile.writeFile(content);
// })();

//fileSize = 1gb
//memoryUsage = 30mb
//time = 2s
(async () => {
  const destFile = await fs.open("writeFile.txt", "w");
  const srcFile = await fs.open("readFile.txt", "r");
  console.log("here");

  let bytesRead = -1;

  while (bytesRead !== 0) {
    const readResult = await srcFile.read();
    bytesRead = readResult.bytesRead;

    if (bytesRead !== 16384) {
      const indexOfNotFilled = readResult.buffer.indexOf(0);
      const newBuffer = Buffer.alloc(indexOfNotFilled);
      readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
    } else {
      console.log(readResult.buffer);
      destFile.write(readResult.buffer);
    }
  }
})();
