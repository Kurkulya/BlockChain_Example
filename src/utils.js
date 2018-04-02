function isChainValid (blocks, diff) {
    const hashTarget = Array(diff + 1).join("0");
    for (let i = 1; i < blocks.length; i++) {
        const curBlock = blocks[i];
        const prevBlock = blocks[i-1];
        if (!(curBlock.hash === curBlock.calculateHash())) {
            console.log("Current hashes are not equal!");
            return false;
        }
        if (!(prevBlock.hash === prevBlock.calculateHash())) {
            console.log("Previous hashes are not equal!");
            return false;
        }
        if (!(curBlock.hash.substr(0, diff) === hashTarget)) {
            console.log("This block hasn't been mined!");
            return false;
        }
    }
    console.log("Chain is valid!");
    return true;
}

module.exports = isChainValid;