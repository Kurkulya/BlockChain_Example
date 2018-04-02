const sha256 = require('js-sha256').sha256;
const getMerkleRoot = require('./utils').getMerkleRoot;

class Block {
    constructor (prevHash) {
        this.nonce = 0;
        this.transactions = [];
        this.prevHash = prevHash;
        this.timeStamp = Date.now();
        this.hash = this.calculateHash();
    }
    calculateHash () {
        return sha256(this.prevHash + this.timeStamp + this.nonce + this.merkleRoot);
    }
    mineBlock (diff) {
        this.merkleRoot = getMerkleRoot(this.transactions);
        const target = Array(diff + 1).join("0");
        while(!(this.hash.slice(0, diff) === target)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
    addTransaction (transaction) {
        if (!transaction) return false;
        if (this.prevHash !== '0') {
            if (!transaction.processTransaction()) {
                console.log('\nTransaction failed to process. Discarded.');
                return false;
            }
        }
        this.transactions.push(transaction);
        console.log('\nTransaction successfully added to block!');
        return true;
    }
}

module.exports = Block;