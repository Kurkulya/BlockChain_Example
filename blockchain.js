var sha256 = require('js-sha256').sha256;

function Block (data, prevHash) {
    this.data = data;
    this.prevHash = prevHash;
    this.timeStamp = Date.now();
    this.hash = sha256(prevHash + this.timeStamp.toString() + data);
}

var firstBlock = new Block("Hi, i'm first block", "0");
console.log("Hash for block 1: " + firstBlock.hash);

var secondBlock = new Block("Hi, i'm second block", firstBlock.hash);
console.log("Hash for block 2: " + firstBlock.hash);

var thirdBlock = new Block("Hi, i'm third block", secondBlock.hash);
console.log("Hash for block 3: " + firstBlock.hash);