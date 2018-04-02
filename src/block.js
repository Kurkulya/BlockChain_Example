const sha256 = require('js-sha256').sha256;

class Block {
    constructor (data, prevHash) {
        this.nonce = 0;
        this.data = data;
        this.prevHash = prevHash;
        this.timeStamp = Date.now();
        this.hash = this.calculateHash();
    }
    calculateHash () {
        return sha256(this.prevHash + this.timeStamp.toString() + this.nonce.toString() + this.data);
    }
    mineBlock (diff) {
        const target = Array(diff + 1).join("0");
        while(!(this.hash.slice(0, diff) === target)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

module.exports = Block;