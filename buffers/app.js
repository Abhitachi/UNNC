const { Buffer } = require("buffer");
const { crypto } = require("crypto");

const memoryContainer = Buffer.alloc(4); //4 bytes (32bits)

memoryContainer[0] = 0xf4;
console.log(memoryContainer);
console.log(memoryContainer[0]);

//0100 1000 0110 1001 0010 0001
const buff = Buffer.alloc(3);
buff[0] = 0x48;
buff[1] = 0x69;
buff[2] = 0x21;

console.log(buff.toString("utf-8"));

const bffer = Buffer.from("helloworld.png", "base64");
console.log(bffer, "bffer");
console.log(bffer.toString("base64"), "bffer");

const buff1 = Buffer.from("486921", "hex");
console.log(buff1.toString("utf-8"));

//generating a RSA key-pair
// crypto.generateKeyPair(
//   "rsa",
//   {
//     modulusLength: 2048,
//     publicKeyEncoding: {
//       type: "spki",
//       format: "pem",
//     },
//     privateKeyEncoding: {
//       type: "pkcs8",
//       format: "pem",
//       cipher: "aes-256-cbc",
//       passphrase: "wanna be a grt dev",
//     },
//   },
//   (err, publicKey, privateKey) => {
//     if (err) {
//       console.log(err, "error occurred while generating priv and pub keys");
//     } else {
//       console.log("public Key: ", publicKey);
//       console.log("private Key: ", privateKey);
//     }
//   }
// );

const testingBuffer = Buffer.from("hello");
//ASCII ->  h -> 104,    e -> 101, l -> 108,    l -> 108,    o -> 111
//binary -> 0110 1000 -> 0110 0101 ->0110 1100 -> 0110 1100 -> 0110 1111
//hex    ->  6     8  ->  6    5   ->  6    c  ->  6     c  ->  6     f
//<Buffer 68 65 6c 6c 6f>  encodes the string "hello" to hexadecimal
console.log(testingBuffer, "testingBuffer");

const binaryBuffer = Buffer.from("hello", "binary"); //create the same buffer as the above
console.log(binaryBuffer, "binaryBuffer");
console.log(binaryBuffer.toString("utf-8"));

const baseBuffer = Buffer.from("hello", "base64");
//ASCII ->  h -> 104,    e -> 101, l -> 108,    l -> 108,    o -> 111
//binary -> 0110 1000 -> 0110 0101 ->0110 1100 -> 0110 1100 -> 0110 1111
//base64 -> 011010 ->000110
//       -> 26 -> 6
//<Buffer 85 e9 65> baseBuffer encodes the string "hello" to base64
console.log(baseBuffer, "baseBuffer");
