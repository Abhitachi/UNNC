const fs = require("node:fs/promises");

//writing huge amount of data directly to a file takes a lot of time

// Execution Time: 8s
// CPU Usage: 100% (one core)
// Memory Usage: 50MB

// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w");

//   for (let i = 0; i < 1000000; i++) {
//     await fileHandle.write(` ${i} `);
//   }
//   console.timeEnd("writeMany");
// })();

//where as writing a huge amount of data to buffer and
//then writing it to a file is much faster

// Execution Time: 1.8s
// CPU Usage: 100% (one core)
// Memory Usage: 50MB

// (async () => {
//   console.time("timetaken");

//   fs.open("text1.txt", "w", (err, fd) => {
//     for (i = 0; i < 1000000; i++) {
//       let buffer = Buffer.from(`${i}`, "utf-8");
//       fs.writeSync(fd, buffer);
//     }
//   });

//   console.timeEnd("timetaken");
// })();

// DON'T DO IT THIS WAY!!!!
//with the help of streams we can reduce the execution time to ms.
// Execution Time: 270ms
// CPU Usage: 100% (one core)
// Memory Usage: 200MB
/*
(async () => {
  console.time("timetaken");

  const fileHandler = await fs.open("text1.txt", "w");
  console.log(fileHandler, "fileHandler");
  const stream = fileHandler.createWriteStream();

  for (i = 0; i < 1000000; i++) {
    let buffer = Buffer.from(` ${i} `, "utf-8");
    stream.write(buffer);
  }

  console.timeEnd("timetaken");
})();
*/

// Execution Time: 300ms
// Memory Usage: 50MB

(async () => {
  console.time("timetaken");

  const fileHandler = await fs.open("text1.txt", "w");
  const stream = fileHandler.createWriteStream();
  //the maximum amount of data that can be written to stream buffer.
  console.log(stream.writableHighWaterMark); //16384 bytes
  let i = 0;
  const writeMany = () => {
    let numberOfWrites = 10000000;
    while (i < numberOfWrites) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      // this is our last write
      if (i === numberOfWrites - 1) {
        return stream.end(buff);
      }

      // if stream.write returns false, stop the loop
      if (!stream.write(buff)) break;
      else i++;
    }
  };
  writeMany();

  //resumes writing to stream once buffer is emptied;
  stream.on("drain", () => {
    console.log("drained");
    writeMany();
  });

  stream.on("finish", () => {
    console.log("finished");
    console.timeEnd("timetaken");
    fileHandler.close();
  });
})();
