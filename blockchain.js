var sha256 = require('js-sha256').sha256;

var difficulty = 6;
var blocks = [];

function Block (data, prevHash) {
    this.nonce = 0;
    this.data = data;
    this.prevHash = prevHash;
    this.timeStamp = Date.now();
    this.calculateHash = function () {
        return sha256(prevHash + this.timeStamp.toString() + this.nonce.toString() + data);
    };
    this.hash = this.calculateHash();
    this.mineBlock = function (diff) {
        let target = Array(diff + 1).join("0");
        while(!(this.hash.slice(0, diff) === target)) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
        console.log("Block mined: " + this.hash);
    }
}

function isChainValid () {
    var curBlock;
    var prevBlock;
    var hashTarget = Array(difficulty + 1).join("0");
    for (let i = 1; i < blocks.length; i++) {
        curBlock = blocks[i];
        prevBlock = blocks[i-1];
        if (!(curBlock.hash === curBlock.calculateHash())) {
            console.log("Current hashes are not equal!"); 
            return false;
        }
        if (!(prevBlock.hash === prevBlock.calculateHash())) {
            console.log("Current hashes are not equal!");
            return false;
        }
        if (!(curBlock.hash.substr(0, difficulty) === hashTarget)) {
            console.log("This block hasn't been mined!");
            return false;
        }
    }
    console.log("Chain is valid!");
    return true;
}

blocks.push(new Block("Hi, i'm first block", "0"));
console.log("Trying to mine block 1...");
blocks[0].mineBlock(difficulty);
blocks.push(new Block("Hi, i'm second block", blocks[blocks.length - 1].hash));
console.log("Trying to mine block 2...");
blocks[1].mineBlock(difficulty);
blocks.push(new Block("Hi, i'm third block", blocks[blocks.length - 1].hash));
console.log("Trying to mine block 3...");
blocks[2].mineBlock(difficulty);

isChainValid();

console.log(blocks);