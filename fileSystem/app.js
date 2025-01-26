const fs = require("fs/promises");

(async () => {
  //commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const ADD_CONTENT = "add content to a file";
  const RENAME_FILE = "rename a file";

  const createFile = async (path) => {
    console.log(path, "path");
    try {
      //we want to check whether or not we already have the file or not
      //if we try to open file that is not existed we will get an error
      //if file is exist then we will read the file
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();

      //if error that means we already opened that file...
      return console.log(`The file ${path} already exists.`);
    } catch (e) {
      //if we don't have file we will create it
      const newFileHandle = await fs.open(path, "w");
      console.log(`A new file was successfully created`);
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path);
      console.log("The file was successfully removed");
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log("No file at this path to remove");
      } else {
        console.log("en error occured while deleting the file: ");
        console.log(e);
      }
    }
    // console.log(`deleting a file from ${path}`);
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log(`file renamed from ${oldPath} to ${newPath}`);
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log(
          "No file at this path to rename, or destination does not exist"
        );
      } else {
        console.log("An error occured occur while renaming the file: ");
        console.log(e);
      }
    }
  };

  let addedContent;

  const addContentToFile = async (path, content) => {
    console.log(path, content);
    //avoid duplicate
    if (addedContent === content) return;
    try {
      //flag a specifies append data to file
      const fileHandle = await fs.open(path, "a");
      //writing content to the file
      fileHandle.write(content);
      addedContent = content;
      fileHandle.close();
      console.log(`adding ${content} to a file ${path}`);
    } catch (e) {
      console.log("Error occured while writing to a file: ");
      console.log(e);
    }
  };

  const commandFileHandler = await fs.open("./text.txt", "r");
  commandFileHandler.on("change", async () => {
    // stat function returns the info about the file
    //size the amount of bytes we need to read from the file
    const size = (await commandFileHandler.stat("./text.txt")).size;
    //allocate our buffer with the size of the the file;
    const buff = Buffer.alloc(size);
    //the location at which we want to start filling our buffer
    const offset = 0;
    //how many bytes we want to read
    const length = buff.byteLength;
    //the position that we want to start reading the file from
    const position = 0;

    //we always want to read the file from starting to the end
    //whatever we read from the file we start filling that to buff
    await commandFileHandler.read(buff, offset, length, position);

    const command = buff.toString("utf-8");

    //if command is : "create a file":
    if (command.includes(CREATE_FILE)) {
      //reading the filepath from command
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }
    // delete a file:
    // delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    //rename a file:
    //rename a file <oldPath> to <newPath>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldPath = command.substring(RENAME_FILE.length + 1, _idx);
      const newPath = command.substring(_idx + 4);
      renameFile(oldPath, newPath);
    }
    //add to file:
    //add to the file <path> this content: <content>
    if (command.includes(ADD_CONTENT)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_CONTENT.length + 1, _idx);
      const content = command.substring(_idx + 15);
      console.log(filePath, "filepath");
      addContentToFile(filePath, content);
    }
  });

  //watcher for text.txt which watches change on a file or directory
  const watcher = fs.watch("./text.txt");
  console.log("here", watcher);

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
